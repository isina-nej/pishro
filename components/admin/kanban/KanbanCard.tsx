'use client';

import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  id: string;
  children: ReactNode;
}

export default function KanbanCard({ id, children }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab rounded-xl border border-border bg-background p-3 text-sm shadow-sm active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
    >
      {children}
    </div>
  );
}
