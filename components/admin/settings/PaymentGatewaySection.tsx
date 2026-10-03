"use client";

import { useState } from "react";
import {
  CreditCard,
  Check,
  Copy,
  Save,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SUPPORTED_GATEWAYS, SupportedGatewayId } from "@/lib/payment";

interface PaymentGatewaySectionProps {
  activeGateway: string;
  apiKey: string;
  sandbox: boolean;
  onSave: (data: {
    activePaymentGateway: string;
    paymentGatewayApiKey: string;
    paymentGatewaySandbox: boolean;
  }) => Promise<void>;
  saving: boolean;
}

export default function PaymentGatewaySection({
  activeGateway,
  apiKey,
  sandbox,
  onSave,
  saving,
}: PaymentGatewaySectionProps) {
  const [selectedGateway, setSelectedGateway] = useState<string>(activeGateway || "zarinpal");
  const [keyInput, setKeyInput] = useState<string>(apiKey || "");
  const [isSandbox, setIsSandbox] = useState<boolean>(Boolean(sandbox));
  const [copied, setCopied] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "https://www.pishrosarmaye.com";
  const callbackUrl = `${baseUrl}/api/payment/verify`;

  const copyCallbackUrl = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    toast.success("آدرس کال‌بک در کلیپ‌بورد کپی شد");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      activePaymentGateway: selectedGateway,
      paymentGatewayApiKey: keyInput.trim(),
      paymentGatewaySandbox: isSandbox,
    });
  };

  const isDirty =
    selectedGateway !== activeGateway ||
    keyInput !== apiKey ||
    isSandbox !== sandbox;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Box 1: Callback URL Banner */}
      <Card className="p-5 border-primary/20 bg-primary/5 space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold">
          <HelpCircle className="h-5 w-5" />
          <span>آدرس بازگشت (Callback URL) جهت ثبت در درگاه</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          هنگام درخواست درگاه در سایت ارائه‌دهنده (زرین‌پال، زیبال، نکست‌پی و ...)، این آدرس را دقیقاً در فیلد Callback URL یا آدرس بازگشت ثبت کنید:
        </p>
        <div className="flex items-center gap-2 bg-background border rounded-xl p-2 dir-ltr">
          <code className="text-xs font-mono text-foreground flex-1 break-all select-all px-2">
            {callbackUrl}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyCallbackUrl}
            className="gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>کپی آدرس</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Box 2: Select Gateway */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold">انتخاب درگاه پرداخت فعال</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          درگاه مورد نظر خود را انتخاب کرده و کلید دسترسی (مرچنت آیدی یا توکن API) آن را وارد کنید:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {SUPPORTED_GATEWAYS.map((gw) => {
            const isSelected = selectedGateway === gw.id;
            return (
              <button
                key={gw.id}
                type="button"
                onClick={() => setSelectedGateway(gw.id)}
                className={cn(
                  "flex flex-col text-right p-4 rounded-xl border transition-all relative",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-sm text-foreground">{gw.titleFa}</span>
                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{gw.descFa}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Box 3: Gateway Credentials */}
      <Card className="p-5 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="font-semibold text-sm">
            {selectedGateway === "saman"
              ? "شماره ترمینال سامان (TerminalId)"
              : selectedGateway === "zarinpal"
              ? "مرچنت آیدی زرین‌پال (Merchant ID)"
              : selectedGateway === "zibal"
              ? "مرچنت کد زیبال (برای تست کلمه zibal مجاز است)"
              : selectedGateway === "nextpay"
              ? "کلید API نکست‌پی (API Key)"
              : "شناسه دسترسی درگاه (اختیاری برای تست)"}
          </Label>
          <Input
            id="apiKey"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={
              selectedGateway === "saman"
                ? "مثلاً 12345678"
                : selectedGateway === "zarinpal"
                ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                : selectedGateway === "zibal"
                ? "zibal یا کد اختصاصی شما"
                : "کلید API دریافت شده از پنل درگاه"
            }
            className="dir-ltr font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {selectedGateway === "saman"
              ? "شماره ترمینال اختصاص‌یافته از سامان. آی‌پی سرور باید نزد سامان ثبت باشد؛ آدرس بازگشت بالا را در پنل سامان ثبت کنید."
              : selectedGateway === "test"
              ? "درگاه آزمایشی نیازی به وارد کردن مرچنت ندارد و تراکنش را به‌صورت محلی شبیه‌سازی می‌کند."
              : "این کلید در دیتابیس امن نگهداری می‌شود و پرداخت‌های کاربران با آن پردازش می‌گردد."}
          </p>
        </div>

        {/* Sandbox Switch */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {isSandbox ? (
                <ShieldAlert className="size-4 text-amber-500" />
              ) : (
                <ShieldCheck className="size-4 text-emerald-500" />
              )}
              <span className="text-sm font-semibold">حالت تستی (Sandbox)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isSandbox
                ? "پرداخت‌ها در محیط سندباکس/تستی انجام می‌شود و مبلغی از کارت واقعی کسر نمی‌شود."
                : "پرداخت‌ها در محیط واقعی شاپرک و با حساب اصلی انجام می‌شوند."}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSandbox}
              onChange={(e) => setIsSandbox(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={!isDirty || saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>ذخیره تنظیمات درگاه</span>
        </Button>
      </div>
    </form>
  );
}
