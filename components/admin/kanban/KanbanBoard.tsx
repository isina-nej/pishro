'use client';

import { useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';

export interface KanbanItem {
  id: string;
  columnId: string;
}

export interface KanbanColumnDef {
  id: string;
  title: string;
}

interface KanbanBoardProps<T extends KanbanItem> {
  columns: KanbanColumnDef[];
  items: T[];
  renderCard: (item: T) => ReactNode;
  onItemMove: (itemId: string, toColumnId: string) => void;
}

/**
 * Generic multi-column drag-and-drop board on @dnd-kit — the pipeline/deal
 * board is the first consumer. Includes keyboard sensor support
 * (Tab to a card, Space to pick up, Arrow keys to move, Space to drop) since
 * this is the first drag-and-drop implementation in the app, with no local
 * precedent to lean on for accessibility.
 */
export function KanbanBoard<T extends KanbanItem>({
  columns,
  items,
  renderCard,
  onItemMove,
}: KanbanBoardProps<T>) {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    const item = items.find((i) => i.id === event.active.id);
    setActiveItem(item ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeItemData = items.find((i) => i.id === active.id);
    if (!activeItemData) return;

    // `over.id` is either a column id (dropped on an empty column area) or
    // another card's id (dropped on/near a card within a column).
    const overColumnId =
      columns.find((c) => c.id === over.id)?.id ?? items.find((i) => i.id === over.id)?.columnId;

    if (overColumnId && overColumnId !== activeItemData.columnId) {
      onItemMove(String(active.id), overColumnId);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            items={items.filter((i) => i.columnId === column.id)}
            renderCard={renderCard}
          />
        ))}
      </div>
      <DragOverlay>{activeItem ? renderCard(activeItem) : null}</DragOverlay>
    </DndContext>
  );
}
