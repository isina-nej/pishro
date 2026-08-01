'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { navSections } from './AdminSidebar';
import type { AdminUser } from '@/lib/hooks/useAdminAuth';

interface CommandPaletteProps {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * v1 scope: jump to any top-level nav destination. Once CRM list endpoints
 * exist (Phase F), extend with debounced entity search (customer/lead/deal/
 * ticket) as additional CommandGroups — deliberately not building
 * non-functional search UI ahead of those APIs existing.
 */
export default function CommandPalette({ user, open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.disabled && item.roles.includes(user.role)),
    }))
    .filter((section) => section.items.length > 0);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="جستجو یا رفتن به بخش..." />
      <CommandList>
        <CommandEmpty>موردی یافت نشد.</CommandEmpty>
        {visibleSections.map((section, idx) => (
          <CommandGroup key={section.label ?? `section-${idx}`} heading={section.label ?? 'عمومی'}>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.key} onSelect={() => go(item.href)}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
