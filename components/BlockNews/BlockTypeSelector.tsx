/**
 * Block Type Selector Component
 * 
 * UI for selecting block type to add
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Type,
  Heading2,
  Image as ImageIcon,
  Images,
  Quote,
  List,
} from 'lucide-react';

interface BlockTypeSelectorProps {
  onSelect: (type: string) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const BLOCK_TYPES = [
  {
    type: 'TEXT',
    label: 'متن',
    description: 'پاراگراف متن',
    icon: Type,
  },
  {
    type: 'HEADING',
    label: 'عنوان',
    description: 'عنوان و زیرعنوان',
    icon: Heading2,
  },
  {
    type: 'IMAGE',
    label: 'تصویر',
    description: 'یک تصویر منفرد',
    icon: ImageIcon,
  },
  {
    type: 'GALLERY',
    label: 'نگارخانه',
    description: 'چند تصویر',
    icon: Images,
  },
  {
    type: 'QUOTE',
    label: 'نقل‌قول',
    description: 'نقل‌قول با نویسنده',
    icon: Quote,
  },
  {
    type: 'LIST',
    label: 'فهرست',
    description: 'لیست سفارش‌دار یا نه',
    icon: List,
  },
];

export default function BlockTypeSelector({
  onSelect,
  isLoading = false,
  onCancel,
}: BlockTypeSelectorProps) {
  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-3">
        <h4 className="font-semibold">نوع بلاک را انتخاب کنید</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {BLOCK_TYPES.map(({ type, label, description, icon: Icon }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto flex flex-col items-center gap-1 py-2"
              onClick={() => onSelect(type)}
              disabled={isLoading}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </Button>
          ))}
        </div>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isLoading} className="w-full">
            انصراف
          </Button>
        )}
      </div>
    </Card>
  );
}
