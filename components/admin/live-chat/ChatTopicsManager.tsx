"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { ChatTopicRow } from "@/lib/site/chat-topics";

async function apiJson(path: string, init?: RequestInit) {
  const { api } = await import("@/lib/api-client");
  const method = (init?.method || "GET").toUpperCase();
  const payload = init?.body ? JSON.parse(init.body as string) : undefined;
  if (method === "GET") {
    const { data } = await api.get(path);
    return data.data;
  }
  if (method === "POST") {
    const { data } = await api.post(path, payload);
    return data.data;
  }
  if (method === "PATCH") {
    const { data } = await api.patch(path, payload);
    return data.data;
  }
  const { data } = await api.delete(path);
  return data.data;
}

function SortableRow({
  topic,
  isAdmin,
  onToggle,
  onRename,
  onDelete,
  pending,
}: {
  topic: ChatTopicRow;
  isAdmin: boolean;
  onToggle: (topic: ChatTopicRow, published: boolean) => void;
  onRename: (topic: ChatTopicRow, title: string) => void;
  onDelete: (topic: ChatTopicRow) => void;
  pending: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(topic.title);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id, disabled: !isAdmin || editing });

  useEffect(() => {
    setDraft(topic.title);
  }, [topic.title]);

  const commit = () => {
    const title = draft.trim();
    if (!title || title === topic.title) {
      setEditing(false);
      setDraft(topic.title);
      return;
    }
    onRename(topic, title);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-xl border bg-background px-2.5 py-2",
        isDragging ? "border-primary shadow-lg" : "border-border/70",
        !topic.published && "opacity-60"
      )}
    >
      {isAdmin ? (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="جابه‌جایی ترتیب"
        >
          <GripVertical className="size-4" />
        </button>
      ) : null}

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <Input
              value={draft}
              autoFocus
              maxLength={60}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setEditing(false);
                  setDraft(topic.title);
                }
              }}
              className="h-8 text-sm"
            />
            <Button type="button" size="icon" className="h-8 w-8 shrink-0" onClick={commit} disabled={pending}>
              <Check className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={() => {
                setEditing(false);
                setDraft(topic.title);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <p className="truncate text-sm font-medium">{topic.title}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {topic.published ? (
          <Eye className="size-3.5 text-success" />
        ) : (
          <EyeOff className="size-3.5 text-muted-foreground" />
        )}
        <Switch
          checked={topic.published}
          disabled={!isAdmin || pending}
          onCheckedChange={(checked) => onToggle(topic, checked)}
          aria-label={topic.published ? "مخفی کردن موضوع" : "نمایش موضوع"}
        />
        {isAdmin && !editing && (
          <>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              aria-label="ویرایش عنوان"
              disabled={pending}
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              aria-label="حذف موضوع"
              disabled={pending}
              onClick={() => onDelete(topic)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ChatTopicsManager() {
  const { user } = useAdminAuth();
  const isAdmin = user?.role === "ADMIN";
  const [topics, setTopics] = useState<ChatTopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = useMemo(() => topics.map((t) => t.id), [topics]);

  const reload = async () => {
    try {
      const data = (await apiJson("/api/admin/chat-topics")) as ChatTopicRow[];
      setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در بارگذاری موضوعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const create = async () => {
    const title = newTitle.trim();
    if (!title) {
      toast.error("عنوان موضوع را وارد کنید");
      return;
    }
    setPending(true);
    try {
      const created = (await apiJson("/api/admin/chat-topics", {
        method: "POST",
        body: JSON.stringify({ title }),
      })) as ChatTopicRow;
      setTopics((prev) => [...prev, created]);
      setNewTitle("");
      toast.success("موضوع جدید اضافه شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ایجاد موضوع");
    } finally {
      setPending(false);
    }
  };

  const toggle = async (topic: ChatTopicRow, published: boolean) => {
    setPending(true);
    try {
      const updated = (await apiJson(`/api/admin/chat-topics/${topic.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published }),
      })) as ChatTopicRow;
      setTopics((prev) => prev.map((t) => (t.id === topic.id ? updated : t)));
      toast.success(published ? "موضوع در ویجت نمایش داده می‌شود" : "موضوع از ویجت مخفی شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در به‌روزرسانی");
    } finally {
      setPending(false);
    }
  };

  const rename = async (topic: ChatTopicRow, title: string) => {
    setPending(true);
    try {
      const updated = (await apiJson(`/api/admin/chat-topics/${topic.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      })) as ChatTopicRow;
      setTopics((prev) => prev.map((t) => (t.id === topic.id ? updated : t)));
      toast.success("عنوان موضوع ویرایش شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ویرایش عنوان");
    } finally {
      setPending(false);
    }
  };

  const remove = async (topic: ChatTopicRow) => {
    if (!window.confirm(`موضوع «${topic.title}» حذف شود؟ گفتگوهای قبلی حفظ می‌شوند.`)) return;
    setPending(true);
    try {
      await apiJson(`/api/admin/chat-topics/${topic.id}`, { method: "DELETE" });
      setTopics((prev) => prev.filter((t) => t.id !== topic.id));
      toast.success("موضوع حذف شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در حذف موضوع");
    } finally {
      setPending(false);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(topics, oldIndex, newIndex);
    setTopics(next);
    try {
      const saved = (await apiJson("/api/admin/chat-topics/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: next.map((t) => t.id) }),
      })) as ChatTopicRow[];
      if (Array.isArray(saved) && saved.length) setTopics(saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره ترتیب");
      void reload();
    }
  };

  return (
    <Card className="mb-4 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">موضوعات گفتگو (دکمه‌های ویجت چت)</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            {isAdmin
              ? "افزودن، ویرایش، حذف، مخفی/نمایش و جابه‌جایی ترتیب با درگ — تغییر بلافاصله در ویجت سایت اعمال می‌شود."
              : "نمایش/مخفی‌سازی موضوعات برای شما آزاد است؛ افزودن، ویرایش، حذف و ترتیب فقط با نقش ادمین."}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
          {topics.filter((t) => t.published).length} فعال از {topics.length}
        </span>
      </div>

      {isAdmin && (
        <div className="mb-3 flex gap-2">
          <Input
            value={newTitle}
            maxLength={60}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void create();
            }}
            placeholder="عنوان موضوع جدید، مثلاً مشاوره کسب‌وکار"
            disabled={pending}
          />
          <Button type="button" onClick={() => void create()} disabled={pending || !newTitle.trim()} className="shrink-0 gap-1.5">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            افزودن
          </Button>
        </div>
      )}

      {loading ? (
        <p className="py-4 text-center text-xs text-muted-foreground">در حال بارگذاری موضوعات...</p>
      ) : topics.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
          موضوعی ثبت نشده — با «افزودن» اولین موضوع را بسازید.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => void onDragEnd(e)}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="grid gap-2 md:grid-cols-2">
              {topics.map((topic) => (
                <SortableRow
                  key={topic.id}
                  topic={topic}
                  isAdmin={isAdmin}
                  pending={pending}
                  onToggle={(t, v) => void toggle(t, v)}
                  onRename={(t, v) => void rename(t, v)}
                  onDelete={(t) => void remove(t)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </Card>
  );
}
