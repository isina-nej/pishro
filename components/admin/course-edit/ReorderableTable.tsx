// @/components/admin/course-edit/ReorderableTable.tsx
'use client';

import { useState, useEffect } from 'react';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface ReorderableTableProps<T extends { id: string }> {
  items: T[];
  onReorder: (newOrder: T[]) => Promise<void>;
  columns: Column<T>[];
  actions?: Action<T>[];
}

export default function ReorderableTable<T extends { id: string }>({
  items,
  onReorder,
  columns,
  actions = [],
}: ReorderableTableProps<T>) {
  const [order, setOrder] = useState(items);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    setOrder(items);
  }, [items]);

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrder(newOrder);
    setIsReordering(true);
    try {
      await onReorder(newOrder);
    } finally {
      setIsReordering(false);
    }
  };

  const moveDown = async (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrder(newOrder);
    setIsReordering(true);
    try {
      await onReorder(newOrder);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-borderColor text-right">
            <th className="text-right py-3 px-4 w-12">#</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-right py-3 px-4"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="text-right py-3 px-4 w-32">عملیات</th>
            )}
            <th className="text-center py-3 px-4 w-20">ترتیب</th>
          </tr>
        </thead>
        <tbody>
          {order.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 dark:border-borderColor hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="py-3 px-4">
                  <div className="flex gap-2 flex-row-reverse">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => action.onClick(item)}
                        className={`text-xs px-2 py-1 rounded ${
                          action.variant === 'danger'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
              <td className="py-3 px-4">
                <div className="flex gap-1 justify-center">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0 || isReordering}
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
                    aria-label={`انتقال ردیف ${index + 1} به بالا`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === order.length - 1 || isReordering}
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
                    aria-label={`انتقال ردیف ${index + 1} به پایین`}
                  >
                    ↓
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
