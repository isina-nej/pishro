'use client';

import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import KanbanCard from './KanbanCard';
import type { KanbanColumnDef, KanbanItem } from './KanbanBoard';

interface KanbanColumnProps<T extends KanbanItem> {
  column: KanbanColumnDef;
  items: T[];
  renderCard: (item: T) => ReactNode;
}

export default function KanbanColumn<T extends KanbanItem>({
  column,
  items,
  renderCard,
}: KanbanColumnProps<T>) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <span className="text-sm font-semibold">{column.title}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {items.length.toLocaleString('fa-IR')}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-24 flex-1 flex-col gap-2 p-2 transition-colors',
          isOver && 'bg-surfaceSelected'
        )}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <KanbanCard key={item.id} id={item.id}>
              {renderCard(item)}
            </KanbanCard>
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
