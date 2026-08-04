"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  content: string;
  createdAt: string;
  adminId: string | null;
  customerId: string | null;
  admin?: { id: string; name: string | null } | null;
};

type TicketDetail = {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  activities: Activity[];
};

const STATUS_FA: Record<string, string> = {
  OPEN: "باز",
  IN_PROGRESS: "در حال بررسی",
  WAITING_ON_CUSTOMER: "منتظر پاسخ شما",
  RESOLVED: "حل‌شده",
  CLOSED: "بسته",
};

export default function ProfileTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/support/tickets/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "تیکت یافت نشد");
      }
      setTicket(json.data as TicketDetail);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const onReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/user/support/tickets/${id}/replies`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply.trim() }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "خطا در ارسال پاسخ");
      }
      setReply("");
      toast.success("پاسخ ارسال شد");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        در حال بارگذاری...
      </Card>
    );
  }

  if (!ticket) {
    return (
      <Card className="space-y-3 p-6">
        <p className="text-sm">تیکت یافت نشد.</p>
        <Button asChild variant="outline">
          <Link href="/profile/support">بازگشت</Link>
        </Button>
      </Card>
    );
  }

  const closed = ticket.status === "CLOSED";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/profile/support"
            className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            بازگشت به لیست
          </Link>
          <h1 className="text-lg font-bold">{ticket.subject}</h1>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {STATUS_FA[ticket.status] || ticket.status} ·{" "}
            {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      </div>

      <Card className="space-y-4 p-4">
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
            پیام اولیه شما
          </p>
          <p className="whitespace-pre-wrap text-sm leading-7">
            {ticket.description}
          </p>
        </div>

        <div className="space-y-3">
          {ticket.activities.map((item) => {
            const fromSupport = Boolean(item.adminId);
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border p-3",
                  fromSupport
                    ? "border-primary/25 bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <span className="font-semibold">
                    {fromSupport
                      ? item.admin?.name || "پشتیبانی"
                      : "شما"}
                  </span>
                  <span>
                    {new Date(item.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7">
                  {item.content}
                </p>
              </div>
            );
          })}
        </div>

        {!closed ? (
          <form onSubmit={onReply} className="space-y-2 border-t border-border pt-3">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="پاسخ خود را بنویسید..."
              rows={4}
              required
            />
            <Button type="submit" disabled={sending} className="gap-2">
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              ارسال پاسخ
            </Button>
          </form>
        ) : (
          <p className="text-xs text-muted-foreground">
            این تیکت بسته شده و امکان ارسال پاسخ وجود ندارد.
          </p>
        )}
      </Card>
    </div>
  );
}
