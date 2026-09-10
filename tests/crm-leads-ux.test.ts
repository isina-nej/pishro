import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

describe('leads tab UX', () => {
  it('list page uses new name, guide box, help popover and row actions', () => {
    const page = read('app/admin/crm/leads/page.tsx');
    assert.ok(page.includes('سرنخ‌های فروش'), 'title renamed');
    assert.ok(page.includes('LeadsGuideBox'), 'guide box rendered');
    assert.ok(page.includes('LeadsHelpPopover'), 'help ? button rendered');
    assert.ok(page.includes('LeadRowActions'), 'row actions menu used');
    assert.ok(!page.includes('>مشاهده</Link>'), 'old plain view button removed');
  });

  it('detail page has edit tab (?tab=edit) and delete button', () => {
    const page = read('app/admin/crm/leads/[id]/page.tsx');
    assert.ok(page.includes('LeadEditTab'), 'edit tab mounted');
    assert.ok(page.includes("searchParams.get('tab')"), 'deep-link ?tab=edit supported');
    assert.ok(page.includes('DeleteLeadButton'), 'delete button mounted');
    assert.ok(page.includes('سرنخ فروش:'), 'detail title renamed');
  });

  it('lead hooks expose single delete with confirm-friendly toast copy', () => {
    const hooks = read('lib/hooks/useCrmLeads.ts');
    assert.ok(hooks.includes('useDeleteCrmLead'), 'delete hook exists');
    assert.ok(hooks.includes('سرنخ فروش حذف شد'), 'delete toast renamed');
  });

  it('sidebar and bulk registry use the new label', () => {
    assert.ok(
      read('components/admin/shell/AdminSidebar.tsx').includes('سرنخ‌های فروش'),
      'sidebar renamed',
    );
    assert.ok(
      read('lib/admin/bulk-registry.ts').includes('label: "سرنخ فروش"'),
      'bulk label renamed',
    );
  });

  it('row actions confirm dialog warns about conversion stats', () => {
    const row = read('components/admin/crm/LeadRowActions.tsx');
    assert.ok(row.includes('از دست‌رفته'), 'suggests LOST instead of delete');
    assert.ok(row.includes(`/admin/crm/leads/${'${lead.id}'}?tab=edit`), 'edit deep link');
  });
});
