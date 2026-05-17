// @/components/admin/course-edit/CourseLessonsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useChapters, useReorderLessons } from '@/lib/hooks/useChapters';
import { Button } from '@/components/ui/button';
import ReorderableTable from './ReorderableTable';
import LessonModal from './LessonModal';
import { toast } from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
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
  const reorderMutation = useReorderLessons();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/admin/courses/${courseId}/chapters`);
        const allLessons: Lesson[] = [];
        data.data.forEach((chapter: any) => {
          if (chapter.lessons) {
            allLessons.push(...chapter.lessons);
          }
        });
        setLessons(allLessons.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        toast.error('خطا در دریافت درس‌ها');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleCreate = async (data: any) => {
    try {
      await axios.post('/api/admin/lessons', {
        courseId,
        ...data,
        chapterId: selectedChapterId || undefined,
      });
      toast.success('درس با موفقیت ایجاد شد');
      setIsModalOpen(false);
      // Refresh lessons
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'خطا در ایجاد درس');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingLesson) return;
    try {
      await axios.patch(`/api/admin/lessons/${editingLesson.id}`, data);
      toast.success('درس با موفقیت به‌روز شد');
      setEditingLesson(null);
      // Refresh lessons
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'خطا در به‌روزرسانی درس');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    try {
      await axios.delete(`/api/admin/lessons/${id}`);
      toast.success('درس با موفقیت حذف شد');
      setLessons(lessons.filter((l) => l.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'خطا در حذف درس');
    }
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
        <Button onClick={() => setIsModalOpen(true)}>درس جدید</Button>
      </div>

      {lessons.length === 0 ? (
        <p className="text-gray-500 text-center py-8">درسی ایجاد نشده</p>
      ) : (
        <ReorderableTable
          items={lessons}
          onReorder={handleReorder}
          columns={[
            { key: 'title', label: 'نام درس', width: '40%' },
            { key: 'duration', label: 'مدت زمان', width: '20%' },
            {
              key: 'chapter',
              label: 'فصل',
              width: '20%',
              render: (lesson: Lesson) => {
                const chapter = chapters.find((c) => c.id === lesson.chapterId);
                return chapter ? chapter.title : '—';
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
        courseId={courseId}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={editingLesson ? handleUpdate : handleCreate}
        isLoading={false}
      />
    </div>
  );
}
