'use client';

import { useState } from 'react';
import { useChapters, useReorderLessons } from '@/lib/hooks/useChapters';
import {
  useCourseLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from '@/lib/hooks/useLessons';
import { Button } from '@/components/ui/button';
import ReorderableTable from './ReorderableTable';
import LessonModal from './LessonModal';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationSeconds?: number;
  order: number;
  chapterId?: string;
}

interface CourseLessonsTabProps {
  courseId: string;
  hasChapters: boolean;
}

export default function CourseLessonsTab({
  courseId,
  hasChapters,
}: CourseLessonsTabProps) {
  const { data: chapters = [] } = useChapters(courseId, hasChapters);
  const { data: lessons = [], isLoading } = useCourseLessons(courseId);
  const createMutation = useCreateLesson(courseId);
  const updateMutation = useUpdateLesson(courseId);
  const deleteMutation = useDeleteLesson(courseId);
  const reorderMutation = useReorderLessons();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const handleCreate = async (data: Record<string, unknown>) => {
    await createMutation.mutateAsync(data);
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editingLesson) return;
    await updateMutation.mutateAsync({ id: editingLesson.id, data });
    setEditingLesson(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleReorder = async (newOrder: Lesson[]) => {
    await reorderMutation.mutateAsync({
      courseId,
      order: newOrder.map((l) => l.id),
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="bg-white dark:bg-cardBg rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">درس‌ها</h2>
        <Button onClick={() => setIsModalOpen(true)} aria-label="ایجاد درس جدید">
          درس جدید
        </Button>
      </div>

      {lessons.length === 0 ? (
        <p className="text-gray-500 text-center py-8">درسی ایجاد نشده</p>
      ) : (
        <ReorderableTable
          items={lessons}
          onReorder={handleReorder}
          columns={[
            { key: 'title', label: 'نام درس', width: '35%' },
            {
              key: 'durationSeconds',
              label: 'مدت (ثانیه)',
              width: '15%',
              render: (l: Lesson) => l.durationSeconds ?? '—',
            },
            {
              key: 'chapter',
              label: 'فصل',
              width: '20%',
              render: (l: Lesson) => {
                const ch = chapters.find((c) => c.id === l.chapterId);
                return ch ? ch.title : '—';
              },
            },
          ]}
          actions={[
            {
              label: 'ویرایش',
              onClick: (l) => setEditingLesson(l),
              variant: 'secondary',
            },
            {
              label: 'حذف',
              onClick: (l) => handleDelete(l.id),
              variant: 'danger',
            },
          ]}
        />
      )}

      <LessonModal
        isOpen={isModalOpen || !!editingLesson}
        lesson={editingLesson}
        chapters={chapters}
        hasChapters={hasChapters}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={editingLesson ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
