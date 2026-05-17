import { redirect } from 'next/navigation';

export default async function CourseRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/courses/${id}/edit`);
}
