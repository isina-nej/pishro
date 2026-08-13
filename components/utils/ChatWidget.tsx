"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Headphones,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";

type Step = "topics" | "identity" | "chat";

type ChatMessage = {
  id: string;
  sender: "VISITOR" | "ADMIN";
  body: string;
  createdAt: string;
  adminName?: string | null;
};

const TOPICS = [
  "دوره‌های آموزشی",
  "سبدهای سرمایه‌گذاری",
  "کریپتو",
  "بورس",
  "متاورس",
  "NFT",
  "ایردراپ",
  "مشاوره کسب‌وکار",
];

const STORAGE_KEY = "pishro-live-chat-v1";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      id: string;
      visitorToken: string;
      firstName: string;
      lastName: string;
      phone: string;
      topic?: string | null;
    };
  } catch {
    return null;
  }
}

function saveStored(data: {
  id: string;
  visitorToken: string;
  firstName: string;
  lastName: string;
  phone: string;
  topic?: string | null;
}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function ChatWidget() {
  const { play } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("topics");
  const [topic, setTopic] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [draft, setDraft] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorToken, setVisitorToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pulse, setPulse] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const knownCount = useRef(0);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  }, []);

  const refreshMessages = useCallback(async () => {
    if (!conversationId || !visitorToken) return;
    try {
      const res = await fetch(
        `/api/public/live-chat/${conversationId}?token=${encodeURIComponent(visitorToken)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok || json.status !== "success") return;
      const next = (json.data.messages || []) as ChatMessage[];
      if (next.length > knownCount.current) {
        const added = next.slice(knownCount.current);
        if (added.some((m) => m.sender === "ADMIN")) {
          play("chat");
        }
      }
      knownCount.current = next.length;
      setMessages(next);
      scrollToBottom();
    } catch {
      // ignore poll errors
    }
  }, [conversationId, visitorToken, scrollToBottom, play]);

  useEffect(() => {
    const stored = loadStored();
    if (!stored) return;
    setConversationId(stored.id);
    setVisitorToken(stored.visitorToken);
    setFirstName(stored.firstName);
    setLastName(stored.lastName);
    setPhone(stored.phone);
    setTopic(stored.topic || null);
    setStep("chat");
  }, []);

  useEffect(() => {
    if (!isOpen || step !== "chat") return;
    void refreshMessages();
    const timer = window.setInterval(() => void refreshMessages(), 4000);
    return () => window.clearInterval(timer);
  }, [isOpen, step, refreshMessages]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!isOpen) return;
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen]);

  const openWidget = () => {
    setIsOpen(true);
    setPulse(false);
  };

  const startChat = async () => {
    setErrors({});
    const nextErrors: Record<string, string> = {};
    if (firstName.trim().length < 2) nextErrors.firstName = "نام را وارد کنید";
    if (lastName.trim().length < 2) nextErrors.lastName = "نام خانوادگی را وارد کنید";
    if (phone.trim().length < 10) nextErrors.phone = "شماره تماس معتبر نیست";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/public/live-chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          topic,
          message: draft.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        setErrors({ form: json.message || "شروع گفتگو ناموفق بود" });
        return;
      }
      const data = json.data;
      setConversationId(data.id);
      setVisitorToken(data.visitorToken);
      setMessages(data.messages || []);
      knownCount.current = (data.messages || []).length;
      saveStored({
        id: data.id,
        visitorToken: data.visitorToken,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        topic: data.topic,
      });
      setDraft("");
      setStep("chat");
      play("send");
      scrollToBottom();
    } catch {
      setErrors({ form: "ارتباط با سرور برقرار نشد" });
    } finally {
      setBusy(false);
    }
  };

  const sendMessage = async () => {
    if (!conversationId || !visitorToken || !draft.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/public/live-chat/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft.trim(), visitorToken }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") return;
      setDraft("");
      play("send");
      await refreshMessages();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            key="live-chat-panel"
            initial={{ opacity: 0, y: 28, scale: 0.94, x: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 18, scale: 0.96, x: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-24 right-4 z-[60] flex h-[min(560px,78vh)] w-[min(100vw-1.5rem,360px)] flex-col overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/95 text-foreground shadow-2xl shadow-primary/15 backdrop-blur-2xl sm:bottom-28 sm:right-6"
          >
            <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-l from-primary via-primary to-success px-4 py-3 text-primary-foreground">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -end-6 -top-8 size-28 rounded-full bg-white/15 blur-2xl"
                animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                    <Headphones className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">پشتیبانی آنلاین پیشرو</p>
                    <p className="text-[11px] text-primary-foreground/80">
                      پاسخ‌گویی سریع تیم پشتیبانی
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/10 p-2 transition-transform duration-300 hover:scale-110"
                  aria-label="بستن"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              {step === "topics" && (
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  <p className="text-sm text-muted-foreground">
                    موضوع گفتگو را انتخاب کنید:
                  </p>
                  <div className="grid gap-2">
                    {TOPICS.map((item, index) => (
                      <motion.button
                        key={item}
                        type="button"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTopic(item);
                          setStep("identity");
                        }}
                        data-sound="chat"
                        className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-start text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === "identity" && (
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  <button
                    type="button"
                    onClick={() => setStep("topics")}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-transform hover:scale-105"
                  >
                    <ArrowRight className="size-3.5" />
                    بازگشت
                  </button>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground">
                    موضوع: <span className="font-semibold">{topic}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    برای شروع چت، مشخصات تماس را وارد کنید.
                  </p>
                  <div className="space-y-2">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="نام"
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-destructive">{errors.firstName}</p>
                    )}
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="نام خانوادگی"
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-destructive">{errors.lastName}</p>
                    )}
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="شماره تماس"
                      dir="ltr"
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-destructive">{errors.phone}</p>
                    )}
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="پیام اول (اختیاری)"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    />
                    {errors.form && (
                      <p className="text-[11px] text-destructive">{errors.form}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    data-sound="off"
                    onClick={() => void startChat()}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
                  >
                    <Sparkles className="size-4" />
                    شروع گفتگو
                  </button>
                </div>
              )}

              {step === "chat" && (
                <>
                  <div className="border-b border-border/40 px-4 py-2 text-[11px] text-muted-foreground">
                    {firstName} {lastName} · {phone}
                    {topic ? ` · ${topic}` : ""}
                  </div>
                  <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
                    {messages.length === 0 && (
                      <p className="rounded-2xl bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">
                        پیام خود را بنویسید؛ پشتیبانی به‌زودی پاسخ می‌دهد.
                      </p>
                    )}
                    {messages.map((message) => {
                      const mine = message.sender === "VISITOR";
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${mine ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                              mine
                                ? "bg-primary text-primary-foreground"
                                : "border border-border/60 bg-background text-foreground"
                            }`}
                          >
                            {!mine && message.adminName ? (
                              <p className="mb-1 text-[10px] opacity-70">
                                {message.adminName}
                              </p>
                            ) : null}
                            <p>{message.body}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="border-t border-border/50 p-3">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={1}
                        placeholder="پیام خود را بنویسید..."
                        className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            void sendMessage();
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={busy || !draft.trim()}
                        data-sound="off"
                        onClick={() => void sendMessage()}
                        className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 hover:scale-110 disabled:opacity-50"
                        aria-label="ارسال"
                      >
                        <Send className="size-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        data-chat-fab
        data-sound="chat"
        data-sound-role="chat"
        data-cursor="chat"
        onClick={() => (isOpen ? setIsOpen(false) : openWidget())}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="پشتیبانی آنلاین"
        className="fixed bottom-5 right-4 z-[60] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 sm:bottom-6 sm:right-6 sm:size-16"
      >
        {pulse && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        )}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-success to-primary opacity-40 blur-md" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="relative size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="size-7" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
