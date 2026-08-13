"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquarePlus, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TicketRow = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  _count?: { activities: number };
};

const STATUS_FA: Record<string, string> = {
  OPEN: "باز",
  IN_PROGRESS: "در حال بررسی",
  WAITING_ON_CUSTOMER: "منتظر پاسخ شما",
  RESOLVED: "حل‌شده",
  CLOSED: "بسته",
};

export default function ProfileSupportPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/support/tickets", {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "خطا در دریافت تیکت‌ها");
      }
      const payload = json.data as { items?: TicketRow[] } | TicketRow[];
      const items = Array.isArray(payload)
        ? payload
        : payload?.items || [];
      setTickets(items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در دریافت");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/user/support/tickets", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "خطا در ثبت تیکت");
      }
      toast.success("تیکت ثبت شد");
      setSubject("");
      setDescription("");
      setShowForm(false);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ثبت");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">پشتیبانی و تیکت‌ها</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            سوال یا مشکل خود را به‌صورت تیکت ثبت کنید و پاسخ پشتیبانی را ببینید.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="gap-2"
          variant={showForm ? "outline" : "default"}
        >
          <MessageSquarePlus className="h-4 w-4" />
          {showForm ? "بستن فرم" : "تیکت جدید"}
        </Button>
      </div>

      {showForm && (
        <Card className="space-y-3 p-4">
          <form onSubmit={onCreate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="ticket-subject">موضوع</Label>
              <Input
                id="ticket-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثلاً مشکل در دسترسی به دوره"
                required
                minLength={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ticket-body">توضیحات</Label>
              <Textarea
                id="ticket-body"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="شرح کامل مشکل یا درخواست..."
                rows={5}
                required
                minLength={5}
              />
            </div>
            <Button type="submit" disabled={creating} className="gap-2">
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              ثبت تیکت
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <Card className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          در حال بارگذاری...
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <Ticket className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">هنوز تیکتی ندارید</p>
          <p className="text-xs text-muted-foreground">
            با دکمه «تیکت جدید» اولین درخواست پشتیبانی را ثبت کنید.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/profile/support/${ticket.id}`}>
              <Card
                className={cn(
                  "flex items-center justify-between gap-3 p-4 transition hover:border-primary/40"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{ticket.subject}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                    {ticket._count?.activities
                      ? ` · ${ticket._count.activities} پیام`
                      : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground">
                  {STATUS_FA[ticket.status] || ticket.status}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
