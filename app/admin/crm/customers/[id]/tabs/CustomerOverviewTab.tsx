'use client';

import { useState } from 'react';
import { Plus, Tag as TagIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import {
  useAssignCustomerTag,
  useCrmTags,
  useUnassignCustomerTag,
  type CrmCustomerDetail,
} from '@/lib/hooks/useCrmCustomer';

interface CustomerOverviewTabProps {
  customerId: string;
  user: CrmCustomerDetail['user'];
  tags: CrmCustomerDetail['tags'];
}

function ProfileField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-1 text-right">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value?.trim() ? value : '—'}</p>
    </div>
  );
}

export default function CustomerOverviewTab({ customerId, user, tags }: CustomerOverviewTabProps) {
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const { data: allTags, isLoading: isTagsLoading } = useCrmTags();
  const assignTag = useAssignCustomerTag(customerId);
  const unassignTag = useUnassignCustomerTag(customerId);

  const assignableTags = (allTags ?? []).filter(
    (tag) => !tags.some((assigned) => assigned.id === tag.id)
  );

  const handleAssign = () => {
    if (!selectedTagId) return;
    assignTag.mutate(selectedTagId, {
      onSuccess: () => setSelectedTagId(''),
    });
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">اطلاعات پروفایل</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="نام" value={user.firstName} />
          <ProfileField label="نام خانوادگی" value={user.lastName} />
          <ProfileField label="شماره تلفن" value={user.phone} />
          <ProfileField label="ایمیل" value={user.email} />
          <ProfileField label="کد ملی" value={user.nationalCode} />
          <ProfileField
            label="تاریخ تولد"
            value={user.birthDate ? new Date(user.birthDate).toLocaleDateString('fa-IR') : null}
          />
          <ProfileField label="شماره کارت" value={user.cardNumber} />
          <ProfileField label="شماره شبا" value={user.shebaNumber} />
          <ProfileField label="صاحب حساب" value={user.accountOwner} />
          <ProfileField
            label="تاریخ عضویت"
            value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : null}
          />
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">برچسب‌های مشتری</h3>

        {tags.length === 0 ? (
          <AdminEmptyState title="برچسبی ثبت نشده" description="برای این مشتری هنوز برچسبی اضافه نشده است." />
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="flex items-center gap-1.5"
                style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
              >
                <TagIcon className="h-3 w-3" />
                {tag.name}
                <button
                  type="button"
                  aria-label={`حذف برچسب ${tag.name}`}
                  className="rounded-full p-0.5 hover:bg-muted"
                  onClick={() => unassignTag.mutate(tag.id)}
                  disabled={unassignTag.isPending}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            size="sm"
            onClick={handleAssign}
            disabled={!selectedTagId || assignTag.isPending}
          >
            <Plus className="h-4 w-4" />
            افزودن برچسب
          </Button>
          <Select value={selectedTagId} onValueChange={setSelectedTagId}>
            <SelectTrigger className="w-52">
              <SelectValue
                placeholder={isTagsLoading ? 'در حال بارگذاری...' : 'انتخاب برچسب'}
              />
            </SelectTrigger>
            <SelectContent>
              {assignableTags.length === 0 ? (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  برچسب دیگری موجود نیست
                </div>
              ) : (
                assignableTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
}
