/**
 * Automated bug-hunt: desktop + mobile, overflow, console errors, network failures.
 * Writes report to /tmp/bug-hunt-report.json and screenshots to /opt/cursor/artifacts/bug-hunt/
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const OUT = "/opt/cursor/artifacts/bug-hunt";
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  "/",
  "/courses",
  "/library",
  "/news",
  "/faq",
  "/investment-plans",
  "/business-consulting",
  "/about-us",
  "/crypto-prices",
  "/checkout",
  "/skyroom-classes",
  "/class",
  "/profile/acc",
  "/profile/courses",
  "/admin/login",
  "/admin/dashboard",
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const bugs = [];
const notes = [];

function addBug(b) {
  bugs.push({ id: bugs.length + 1, ...b, foundAt: new Date().toISOString() });
}

async function collectPageIssues(page, urlPath, viewportName) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  page.on("response", (res) => {
    const u = res.url();
    if (!u.includes(BASE) && !u.includes("_next")) return;
    if (res.status() >= 400) {
      failedRequests.push({ url: u, status: res.status() });
    }
  });

  const full = `${BASE}${urlPath}`;
  let status = 0;
  try {
    const resp = await page.goto(full, { waitUntil: "domcontentloaded", timeout: 45000 });
    status = resp?.status() || 0;
    await page.waitForTimeout(1500);
  } catch (e) {
    addBug({
      severity: "critical",
      title: `Page failed to load: ${urlPath}`,
      url: full,
      viewport: viewportName,
      expected: "Page loads",
      actual: String(e),
    });
    return;
  }

  // Redirect check for public pages
  const finalUrl = page.url();
  if (
    !urlPath.startsWith("/admin") &&
    !urlPath.startsWith("/profile") &&
    finalUrl.includes("/admin/login")
  ) {
    addBug({
      severity: "critical",
      title: "Public page redirected to admin login",
      url: full,
      viewport: viewportName,
      expected: `Stay on ${urlPath}`,
      actual: `Ended at ${finalUrl}`,
    });
  }

  // Admin dashboard without auth should not fully expose protected UI without guard
  if (urlPath === "/admin/dashboard") {
    const isLogin = page.url().includes("/admin/login");
    const hasDash = await page.locator("text=داشبورد").first().isVisible().catch(() => false);
    if (!isLogin && hasDash) {
      // Check if sensitive data visible without cookies
      const cookies = await page.context().cookies();
      const hasAdmin = cookies.some((c) => c.name.includes("admin"));
      if (!hasAdmin) {
        addBug({
          severity: "high",
          title: "Admin dashboard reachable without auth cookie (middleware gap)",
          url: full,
          viewport: viewportName,
          expected: "Redirect to /admin/login",
          actual: `Rendered dashboard content at ${page.url()}`,
        });
      }
    }
  }

  // Horizontal overflow
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const sw = Math.max(doc.scrollWidth, body.scrollWidth);
    const cw = Math.max(doc.clientWidth, window.innerWidth);
    const offenders = [];
    if (sw > cw + 2) {
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > cw + 2 || r.left < -2)) {
          const tag = el.tagName.toLowerCase();
          const cls = (el.className && String(el.className).slice?.(0, 80)) || "";
          offenders.push({ tag, cls, right: Math.round(r.right), left: Math.round(r.left), w: Math.round(r.width) });
        }
      });
    }
    return { sw, cw, overflow: sw > cw + 2, offenders: offenders.slice(0, 8) };
  });

  if (overflow.overflow) {
    const shot = path.join(OUT, `${viewportName}${urlPath.replace(/\//g, "_") || "_home"}-overflow.png`);
    await page.screenshot({ path: shot, fullPage: false });
    addBug({
      severity: viewportName === "mobile" ? "high" : "medium",
      title: `Horizontal overflow on ${urlPath}`,
      url: full,
      viewport: viewportName,
      expected: "No horizontal scroll",
      actual: `scrollWidth=${overflow.sw} clientWidth=${overflow.cw}; offenders=${JSON.stringify(overflow.offenders.slice(0, 3))}`,
      screenshot: shot,
    });
  }

  // Empty content signals when APIs should have data
  if (["/courses", "/library", "/news"].includes(urlPath) && viewportName === "desktop") {
    const bodyText = await page.locator("body").innerText();
    const emptySignals = [
      "هیچ دوره‌ای",
      "کتابی با این مشخصات",
      "نمایش ۰ از ۰",
      "موردی یافت نشد",
      "یافت نشد",
    ];
    for (const sig of emptySignals) {
      if (bodyText.includes(sig)) {
        addBug({
          severity: "high",
          title: `Empty content state on ${urlPath} despite seeded data`,
          url: full,
          viewport: viewportName,
          expected: "List of items from seed data",
          actual: `Found empty signal: ${sig}`,
        });
        break;
      }
    }
  }

  // FAQ duplicate questions
  if (urlPath === "/faq" && viewportName === "desktop") {
    const questions = await page.locator("h3").allInnerTexts();
    const counts = {};
    for (const q of questions) {
      const t = q.trim();
      if (!t) continue;
      counts[t] = (counts[t] || 0) + 1;
    }
    const dups = Object.entries(counts).filter(([, c]) => c > 1);
    if (dups.length) {
      addBug({
        severity: "medium",
        title: "FAQ shows duplicate identical questions",
        url: full,
        viewport: viewportName,
        expected: "Unique FAQ questions",
        actual: JSON.stringify(dups.slice(0, 5)),
      });
    }
  }

  // Broken images
  const brokenImgs = await page.evaluate(() => {
    return Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
      .map((img) => img.src)
      .slice(0, 10);
  });
  if (brokenImgs.length) {
    addBug({
      severity: "medium",
      title: `Broken images on ${urlPath}`,
      url: full,
      viewport: viewportName,
      expected: "Images load",
      actual: brokenImgs.join(", "),
    });
  }

  // Console / page errors (filter noisy)
  const meaningfulConsole = consoleErrors.filter(
    (t) =>
      !t.includes("Download the React DevTools") &&
      !t.includes("favicon") &&
      !/hydration/i.test(t) === false // keep hydration
  );
  // keep hydration and real errors
  const filtered = consoleErrors.filter(
    (t) =>
      !t.includes("Download the React DevTools") &&
      !t.includes("favicon.ico") &&
      !t.includes("third-party")
  );
  if (pageErrors.length) {
    addBug({
      severity: "high",
      title: `JS pageerror on ${urlPath}`,
      url: full,
      viewport: viewportName,
      expected: "No uncaught JS errors",
      actual: pageErrors.slice(0, 3).join(" | "),
    });
  }
  if (filtered.length) {
    addBug({
      severity: "medium",
      title: `Console errors on ${urlPath}`,
      url: full,
      viewport: viewportName,
      expected: "Clean console",
      actual: filtered.slice(0, 5).join(" || "),
    });
  }

  const apiFails = failedRequests.filter(
    (r) => r.url.includes("/api/") && r.status >= 500
  );
  if (apiFails.length) {
    addBug({
      severity: "high",
      title: `API 5xx on ${urlPath}`,
      url: full,
      viewport: viewportName,
      expected: "APIs succeed",
      actual: JSON.stringify(apiFails.slice(0, 5)),
    });
  }

  // Low-contrast heuristic: dark text on dark-ish backgrounds in hero-ish areas
  if (viewportName === "desktop") {
    const contrastIssues = await page.evaluate(() => {
      function parseColor(c) {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return null;
        return [+m[1], +m[2], +m[3]];
      }
      function lum([r, g, b]) {
        const a = [r, g, b].map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      }
      const issues = [];
      const nodes = Array.from(document.querySelectorAll("h1,h2,p,span,a,button,label")).slice(0, 200);
      for (const el of nodes) {
        const style = getComputedStyle(el);
        const color = parseColor(style.color);
        if (!color) continue;
        let bgEl = el;
        let bg = parseColor(style.backgroundColor);
        while (bgEl && (!bg || bg.join() === "0,0,0" && style.backgroundColor === "rgba(0, 0, 0, 0)")) {
          bgEl = bgEl.parentElement;
          if (!bgEl) break;
          const bs = getComputedStyle(bgEl);
          bg = parseColor(bs.backgroundColor);
          if (bs.backgroundColor === "rgba(0, 0, 0, 0)" || bs.backgroundColor === "transparent") {
            bg = null;
            continue;
          }
          break;
        }
        if (!color || !bg) continue;
        const L1 = lum(color);
        const L2 = lum(bg);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const text = (el.textContent || "").trim().slice(0, 60);
        if (ratio < 2.5 && text.length > 8) {
          issues.push({ text, ratio: +ratio.toFixed(2), color: style.color, bg: getComputedStyle(bgEl).backgroundColor });
        }
      }
      return issues.slice(0, 5);
    });
    if (contrastIssues.length) {
      const shot = path.join(OUT, `${viewportName}${urlPath.replace(/\//g, "_") || "_home"}-contrast.png`);
      await page.screenshot({ path: shot, fullPage: false });
      addBug({
        severity: "high",
        title: `Low text contrast on ${urlPath}`,
        url: full,
        viewport: viewportName,
        expected: "Readable contrast (WCAG-ish)",
        actual: JSON.stringify(contrastIssues),
        screenshot: shot,
      });
    }
  }

  // Screenshot each page once per viewport (top)
  const shotPath = path.join(OUT, `${viewportName}${urlPath.replace(/\//g, "_") || "_home"}.png`);
  await page.screenshot({ path: shotPath, fullPage: false });
  notes.push({ urlPath, viewportName, status, finalUrl, shotPath });
}

async function testInteractions(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "fa-IR" });
  const page = await context.newPage();

  // Home slider / nav
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // Click nav links
  const navHrefs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("header a, nav a"))
      .map((a) => a.getAttribute("href"))
      .filter(Boolean)
      .slice(0, 20);
  });
  for (const href of navHrefs) {
    if (!href.startsWith("/") || href.startsWith("/#")) continue;
    const resp = await page.request.get(`${BASE}${href}`).catch(() => null);
    if (resp && resp.status() >= 400) {
      addBug({
        severity: "high",
        title: `Broken nav link: ${href}`,
        url: `${BASE}${href}`,
        viewport: "desktop",
        expected: "200",
        actual: String(resp.status()),
      });
    }
  }

  // Mobile menu
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "fa-IR" });
  const mpage = await mobile.newPage();
  await mpage.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await mpage.waitForTimeout(1500);
  const menuBtn = mpage.locator('button[aria-label*="منو"], button[aria-label*="menu"], button:has-text("منو"), header button').first();
  if (await menuBtn.count()) {
    await menuBtn.click().catch(() => {});
    await mpage.waitForTimeout(800);
    const open = await mpage.evaluate(() => document.body.innerText.includes("دوره") || document.body.innerText.includes("اخبار"));
    const shot = path.join(OUT, "mobile-menu.png");
    await mpage.screenshot({ path: shot });
    if (!open) {
      addBug({
        severity: "medium",
        title: "Mobile menu may not open / show links",
        url: `${BASE}/`,
        viewport: "mobile",
        expected: "Menu opens with nav links",
        actual: "Could not confirm menu content after click",
        screenshot: shot,
      });
    }
  } else {
    addBug({
      severity: "medium",
      title: "No mobile menu button found",
      url: `${BASE}/`,
      viewport: "mobile",
      expected: "Hamburger / menu button visible",
      actual: "No matching button",
    });
  }

  // Admin login attempt
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const phone = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="موبایل"], input[placeholder*="09"]').first();
  const pass = page.locator('input[type="password"]').first();
  if (await phone.count() && await pass.count()) {
    await phone.fill("09123456789");
    await pass.fill("Admin@123");
    // Check if typed text is visible inside input (misalignment bug)
    const phoneBox = await phone.boundingBox();
    const shot = path.join(OUT, "admin-login-typed.png");
    await page.screenshot({ path: shot });
    await page.locator('button[type="submit"], button:has-text("ورود")').first().click();
    await page.waitForTimeout(2500);
    if (!page.url().includes("/admin/dashboard") && !page.url().includes("/admin/")) {
      addBug({
        severity: "high",
        title: "Admin login did not navigate to dashboard",
        url: `${BASE}/admin/login`,
        viewport: "desktop",
        expected: "Navigate to /admin/dashboard",
        actual: page.url(),
        screenshot: shot,
      });
    }
    // Input misalignment: value exists but visual overflow of input content
    if (phoneBox) {
      notes.push({ adminPhoneBox: phoneBox });
    }
  }

  await context.close();
  await mobile.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: "fa-IR",
    });
    for (const p of PAGES) {
      const page = await context.newPage();
      try {
        await collectPageIssues(page, p, vp.name);
      } catch (e) {
        addBug({
          severity: "high",
          title: `Collector crashed on ${p}`,
          url: `${BASE}${p}`,
          viewport: vp.name,
          expected: "Collector completes",
          actual: String(e),
        });
      }
      await page.close();
    }
    await context.close();
  }

  await testInteractions(browser);
  await browser.close();

  // Deduplicate similar titles
  const seen = new Set();
  const unique = [];
  for (const b of bugs) {
    const key = `${b.title}|${b.url}|${b.viewport}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(b);
  }

  const report = {
    summary: {
      total: unique.length,
      critical: unique.filter((b) => b.severity === "critical").length,
      high: unique.filter((b) => b.severity === "high").length,
      medium: unique.filter((b) => b.severity === "medium").length,
      low: unique.filter((b) => b.severity === "low").length,
    },
    bugs: unique,
    notes,
  };
  fs.writeFileSync("/tmp/bug-hunt-report.json", JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary, null, 2));
  console.log("---BUGS---");
  for (const b of unique) {
    console.log(`[${b.severity}] #${b.id} ${b.title} (${b.viewport})`);
    console.log(`  actual: ${String(b.actual).slice(0, 220)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
