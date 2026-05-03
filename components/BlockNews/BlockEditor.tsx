/**
 * Block Editor Component
 * 
 * Drag-and-drop editor for content blocks
 * Supports: Text, Heading, Image, Gallery, Quote, List
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { ContentBlockResponse } from '@/lib/types/block-news';
import BlockItem from './BlockItem';
import BlockTypeSelector from './BlockTypeSelector';

interface BlockEditorProps {
  newsId: string;
  blocks: ContentBlockResponse[];
  isLoading?: boolean;
  onAddBlock: (type: string) => Promise<void>;
  onUpdateBlock: (blockId: string, content: Record<string, unknown>) => Promise<void>;
  onDeleteBlock: (blockId: string) => Promise<void>;
  onReorderBlocks: (newOrder: Array<{ blockId: string; sortOrder: number }>) => Promise<void>;
}

export default function BlockEditor({
  newsId,
  blocks,
  isLoading = false,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
}: BlockEditorProps) {
  const [items, setItems] = useState<ContentBlockResponse[]>(blocks);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle drag end - reorder blocks
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Send reorder request to API
      try {
        const reorderData = newItems.map((item, index) => ({
          blockId: item.id,
          sortOrder: index,
        }));
        await onReorderBlocks(reorderData);
      } catch (error) {
        console.error('خطا در تغییر ترتیب بلاک‌ها:', error);
        // Revert on error
        setItems(blocks);
      }
    },
    [items, blocks, onReorderBlocks]
  );

  // Handle add block
  const handleAddBlock = useCallback(
    async (type: string) => {
      setIsAdding(true);
      try {
        await onAddBlock(type);
        setShowTypeSelector(false);
      } catch (error) {
        console.error('خطا در افزودن بلاک:', error);
      } finally {
        setIsAdding(false);
      }
    },
    [onAddBlock]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">محتوای خبر</h3>
        <Button
          onClick={() => setShowTypeSelector(!showTypeSelector)}
          disabled={isAdding || isLoading}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          افزودن بلاک
        </Button>
      </div>

      {/* Block Type Selector */}
      {showTypeSelector && (
        <BlockTypeSelector
          onSelect={handleAddBlock}
          isLoading={isAdding}
          onCancel={() => setShowTypeSelector(false)}
        />
      )}

      {/* Blocks List */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>هیچ بلاکی وجود ندارد</p>
          <p className="text-sm">برای شروع، یک بلاک جدید اضافه کنید</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((block, index) => (
                <BlockItem
                  key={block.id}
                  block={block}
                  index={index}
                  onUpdate={(content) => onUpdateBlock(block.id, content)}
                  onDelete={() => onDeleteBlock(block.id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
