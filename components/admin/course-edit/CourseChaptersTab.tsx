// @/components/admin/course-edit/CourseChaptersTab.tsx
'use client';

import { useState } from 'react';
import {
  useChapters,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  useReorderChapters,
} from '@/lib/hooks/useChapters';
import { Button } from '@/components/ui/button';
import ReorderableTable from './ReorderableTable';
import ChapterModal from './ChapterModal';

interface Chapter {
  id: string;
  title: string;
  position: number;
  lessons?: Array<{ id: string; title: string }>;
}

interface CourseChaptersTabProps {
  courseId: string;
}

export default function CourseChaptersTab({ courseId }: CourseChaptersTabProps) {
  const { data: chapters = [], isLoading } = useChapters(courseId);
  const createMutation = useCreateChapter();
  const updateMutation = useUpdateChapter();
  const deleteMutation = useDeleteChapter();
  const reorderMutation = useReorderChapters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const handleCreate = async (data: { title: string }) => {
    await createMutation.mutateAsync({
      courseId,
      data,
    });
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: { title: string }) => {
    if (!editingChapter) return;
    await updateMutation.mutateAsync({
      id: editingChapter.id,
      data,
    });
    setEditingChapter(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await deleteMutation.mutateAsync({ id, courseId });
  };

  const handleReorder = async (newOrder: Chapter[]) => {
    await reorderMutation.mutateAsync({
      courseId,
      order: newOrder.map((ch) => ch.id),
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-card rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-6 flex-row-reverse">
        <h2 className="text-xl font-bold">فصل‌ها</h2>
        <Button onClick={() => setIsModalOpen(true)}>فصل جدید</Button>
      </div>

      {chapters.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">فصلی ایجاد نشده</p>
      ) : (
        <ReorderableTable
          items={chapters}
          onReorder={handleReorder}
          columns={[
            { key: 'title', label: 'نام فصل', width: '40%' },
            {
              key: 'lessonCount',
              label: 'تعداد درس‌ها',
              width: '20%',
              render: (ch: Chapter) => ch.lessons?.length ?? 0,
            },
          ]}
          actions={[
            {
              label: 'ویرایش',
              onClick: (ch) => setEditingChapter(ch),
              variant: 'secondary',
            },
            {
              label: 'حذف',
              onClick: (ch) => handleDelete(ch.id),
              variant: 'danger',
            },
          ]}
        />
      )}

      <ChapterModal
        isOpen={isModalOpen || !!editingChapter}
        chapter={editingChapter}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChapter(null);
        }}
        onSubmit={editingChapter ? handleUpdate : handleCreate}
        isLoading={
          createMutation.isPending || updateMutation.isPending
        }
      />
    </div>
  );
}
