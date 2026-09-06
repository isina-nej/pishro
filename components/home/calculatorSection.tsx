"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import CountUp from "react-countup";
import { Wallet, Clock, BarChart3, PhoneCall, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { contactInfo } from "@/lib/constants/contact";
import { useInvestmentFunds, type InvestmentFund } from "@/lib/hooks/useInvestmentFunds";

// 📊 مقادیر پیشنهادی اسلایدر مبلغ — عددهای گرد برای تجربه‌ی بهتر، فارغ از نرخ گام دقیق صندوق
const CURATED_AMOUNT_STEPS = [
  1_000_000, 10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000,
  60_000_000, 70_000_000, 80_000_000, 90_000_000, 100_000_000, 200_000_000,
  300_000_000, 500_000_000, 1_000_000_000, 2_000_000_000, 3_000_000_000,
  5_000_000_000,
];

function getDurationSteps(fund: InvestmentFund | null): number[] {
  if (!fund) return [1];
  const steps: number[] = [];
  for (let v = fund.minDuration; v <= fund.maxDuration; v += fund.durationStep) {
    steps.push(v);
  }
  return steps.length > 0 ? steps : [fund.minDuration];
}

function getAmountSteps(fund: InvestmentFund | null): number[] {
  if (!fund) return CURATED_AMOUNT_STEPS;
  const filtered = CURATED_AMOUNT_STEPS.filter(
    (v) => v >= fund.minAmount && v <= fund.maxAmount
  );
  return filtered.length > 0 ? filtered : [fund.minAmount, fund.maxAmount];
}

const getClosestValue = (val: number, arr: number[]) =>
  arr.reduce((prev, curr) => (Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev));

const getNext = (current: number, arr: number[]) =>
  arr[arr.indexOf(current) + 1] ?? current;
const getPrev = (current: number, arr: number[]) =>
  arr[arr.indexOf(current) - 1] ?? current;

const formatNumber = (num: number) => new Intl.NumberFormat("fa-IR").format(Math.round(num));

type CalculatorSectionProps = {
  phone?: string;
  phoneTel?: string;
};

const CalculatorSection = ({
  phone = contactInfo.phone,
  phoneTel = contactInfo.phoneTel,
}: CalculatorSectionProps) => {
  const { data: funds, isLoading: fundsLoading } = useInvestmentFunds();

  const [selectedFundKey, setSelectedFundKey] = useState<string | null>(null);
  const [amount, setAmount] = useState(10_000_000);
  const [duration, setDuration] = useState(1);
  const [result, setResult] = useState(0);
  const prevResultRef = useRef(result);

  const selectedFund = useMemo(
    () => funds?.find((f) => f.key === selectedFundKey) ?? funds?.[0] ?? null,
    [funds, selectedFundKey]
  );

  // وقتی صندوق‌ها بارگذاری شدن، صندوق اول را انتخاب و مدت/مبلغ را با محدوده‌اش هم‌راستا کن
  useEffect(() => {
    if (!funds || funds.length === 0) return;
    const fund = funds.find((f) => f.key === selectedFundKey) ?? funds[0];
    if (!selectedFundKey) setSelectedFundKey(fund.key);
    setDuration((prev) => getClosestValue(prev, getDurationSteps(fund)));
    setAmount((prev) => getClosestValue(prev, getAmountSteps(fund)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds]);

  const durationSteps = useMemo(() => getDurationSteps(selectedFund), [selectedFund]);
  const amountSteps = useMemo(() => getAmountSteps(selectedFund), [selectedFund]);

  function handleSelectFund(fund: InvestmentFund) {
    setSelectedFundKey(fund.key);
    setDuration((prev) => getClosestValue(prev, getDurationSteps(fund)));
    setAmount((prev) => getClosestValue(prev, getAmountSteps(fund)));
  }

  // 🧮 محاسبه سود مرکب بر اساس صندوق انتخاب‌شده
  useEffect(() => {
    if (!selectedFund) return;
    const newResult = amount * Math.pow(1 + selectedFund.monthlyRate, duration);
    prevResultRef.current = result;
    setResult(newResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, duration, selectedFund]);

  return (
    <section className="relative mt-8 min-h-[600px] w-full overflow-hidden py-8 home-on-dark md:mt-20 md:min-h-screen">
      <div
        className="absolute inset-x-4 inset-y-8 rounded-[2.5rem] shadow-2xl md:inset-x-8"
        style={{
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--home-deep) 95%, transparent) 0%, color-mix(in srgb, var(--home-glow) 88%, var(--home-deep)) 48%, color-mix(in srgb, var(--home-bg) 70%, #000) 100%)",
          boxShadow: "0 25px 60px color-mix(in srgb, var(--home-deep) 28%, transparent)",
        }}
      />
      <div className="absolute inset-x-4 inset-y-8 rounded-[2.5rem] border border-white/10 bg-[url('/images/utiles/pattern1.svg')] opacity-[0.08] md:inset-x-8" />

      <div className="container-xl relative z-10 flex flex-col justify-center py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10 px-2">
          <h4 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-4 mt-10 md:mt-0">
            ماشین حساب
          </h4>
          <p className="text-base md:text-lg lg:text-xl leading-relaxed home-on-dark-muted max-w-2xl mx-auto">
            با انتخاب نوع صندوق سرمایه‌ گذاری، مبلغ و مدت، میزان بازده خود را
            مشاهده کنید.
          </p>
        </div>

        {fundsLoading || !selectedFund ? (
          <div className="flex items-center justify-center py-20 text-lg home-on-dark-muted">
            در حال بارگذاری صندوق‌های سرمایه‌گذاری...
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="flex flex-col gap-6 md:gap-10 lg:flex-row items-center justify-center">
              {/* Controls */}
              <div className="flex flex-col w-full lg:w-7/12 gap-4 px-1 md:px-0">
                {/* نوع صندوق سرمایه‌ گذاری */}
                <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 shadow-xl backdrop-blur-xl sm:px-6">
                  <p className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                    <BarChart3 size={22} className="home-on-dark" />
                    نوع صندوق سرمایه‌ گذاری
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {(funds ?? []).map((fund) => {
                      const active = selectedFund.key === fund.key;
                      return (
                        <button
                          key={fund.key}
                          onClick={() => handleSelectFund(fund)}
                          className={`rounded-full border px-5 py-2 font-medium transition-all ${
                            active
                              ? "border-[#E8F0EB] bg-[#F7F5F0] text-[#0B3D2E] shadow-md"
                              : "border-white/25 bg-white/10 text-[#E8F0EB] hover:bg-white/20"
                          }`}
                        >
                          {fund.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* مبلغ سرمایه‌ گذاری */}
                <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 shadow-xl backdrop-blur-xl sm:px-6">
                  <p className="text-center text-lg font-bold mb-8 flex items-center justify-center gap-2">
                    <Wallet size={24} className="home-on-dark" />
                    مبلغ سرمایه‌ گذاری
                  </p>

                  <div className="flex items-start justify-between gap-4">
                    <button
                      onClick={() => setAmount((prev) => getNext(prev, amountSteps))}
                      className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold home-on-dark transition hover:bg-white/20 active:scale-95 md:size-10"
                    >
                      <span className="mt-1">+</span>
                    </button>

                    <div className="flex-1 mx-2">
                      <Slider
                        min={selectedFund.minAmount}
                        max={selectedFund.maxAmount}
                        step={1_000_000}
                        value={amount}
                        onChange={(val) =>
                          setAmount(getClosestValue(Number(val), amountSteps))
                        }
                        trackStyle={{
                          background:
                            "linear-gradient(90deg, var(--home-gold) 0%, var(--home-glow) 100%)",
                          height: 6,
                        }}
                        railStyle={{ backgroundColor: "rgba(232,240,235,0.25)", height: 6 }}
                        handleStyle={{
                          borderColor: "var(--home-gold)",
                          backgroundColor: "var(--home-bg)",
                          width: 24,
                          height: 24,
                          marginTop: -9,
                        }}
                      />
                      {/* ⬇️ Label range below slider */}
                      <div className="md:mx-2 mt-3 flex flex-row-reverse justify-between text-sm home-on-dark-muted">
                        <p>{formatNumber(selectedFund.minAmount)} تومان</p>
                        <p>{formatNumber(selectedFund.maxAmount)} تومان</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setAmount((prev) => getPrev(prev, amountSteps))}
                      className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold home-on-dark transition hover:bg-white/20 active:scale-95 md:size-10"
                    >
                      <span className="mt-1">−</span>
                    </button>
                  </div>

                  <p className="mt-6 text-center font-bold home-on-dark">
                    {formatNumber(amount)}
                    <span className="font-normal">تومان</span>
                  </p>
                </div>

                {/* مدت سرمایه‌ گذاری */}
                <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 shadow-xl backdrop-blur-xl sm:px-6">
                  <div className="mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
                    <Clock size={24} className="home-on-dark" />
                    <p className="text-lg font-bold">مدت سرمایه‌ گذاری</p>
                    <span className="text-sm home-on-dark-muted">
                      (سودها به صورت مرکب حساب می‌شود)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => setDuration((prev) => getNext(prev, durationSteps))}
                      className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold home-on-dark transition hover:bg-white/20 active:scale-95 md:size-10"
                    >
                      <span className="mt-1">+</span>
                    </button>

                    <div className="flex-1 mx-2">
                      <Slider
                        min={selectedFund.minDuration}
                        max={selectedFund.maxDuration}
                        step={selectedFund.durationStep}
                        value={duration}
                        onChange={(val) =>
                          setDuration(getClosestValue(Number(val), durationSteps))
                        }
                        trackStyle={{
                          background:
                            "linear-gradient(90deg, var(--home-gold) 0%, var(--home-glow) 100%)",
                          height: 6,
                        }}
                        railStyle={{ backgroundColor: "rgba(232,240,235,0.25)", height: 6 }}
                        handleStyle={{
                          borderColor: "var(--home-gold)",
                          backgroundColor: "var(--home-bg)",
                          width: 24,
                          height: 24,
                          marginTop: -9,
                        }}
                      />
                      {/* ⬇️ Label range below slider */}
                      <div className="sm:mx-2 mt-3 flex flex-row-reverse justify-between text-sm home-on-dark-muted">
                        <p>{selectedFund.minDuration} ماه</p>
                        <p>{selectedFund.maxDuration} ماه</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setDuration((prev) => getPrev(prev, durationSteps))}
                      className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold home-on-dark transition hover:bg-white/20 active:scale-95 md:size-10"
                    >
                      <span className="mt-1">−</span>
                    </button>
                  </div>

                  <p className="mt-6 text-center font-bold home-on-dark">{duration} ماهه</p>
                </div>
              </div>

              {/* Result */}
              <div className="flex h-[-webkit-fill-available] w-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/20 p-4 shadow-2xl backdrop-blur-xl md:mb-0 md:mt-0 md:p-10 lg:w-5/12">
                <p className="text-center text-2xl font-bold mb-8">
                  نتیجه سرمایه‌ گذاریت
                  <span className="mr-2 text-base font-medium home-on-dark-muted">
                    (اصل سرمایه + سود)
                  </span>
                </p>

                {/* Result box */}
                <div className="relative flex flex-col items-center justify-center rounded-3xl border border-[#0B3D2E]/15 bg-[#F7F5F0] px-4 pb-4 pt-8 text-3xl font-medium text-[#0B3D2E] shadow-2xl backdrop-blur-xl">
                  {/* قیمت و درصد سود */}
                  <div className="flex items-center justify-between w-full gap-4 mb-4">
                    {/* مبلغ کل - سمت راست */}
                    <div className="flex flex-1 justify-center">
                      <CountUp
                        start={prevResultRef.current}
                        end={result}
                        duration={0.8}
                        separator=","
                        formattingFn={(n) => formatNumber(n)}
                      />
                      <span className="mr-2 mt-1 text-lg font-bold text-[#0B3D2E]/70">
                        تومان
                      </span>
                    </div>
                    {/* نرخ صندوق - سمت چپ */}
                    <div className="flex max-w-40 flex-col items-center rounded-xl border border-premium/40 bg-premium/15 px-4 py-3 text-center shadow-sm">
                      {selectedFund.key === "hold" ? (
                        <p className="text-sm font-bold leading-6 text-premium">
                          حداقل سود تضمین‌شده دوره سه‌ماهه
                        </p>
                      ) : (
                        <>
                          <p className="mb-1 text-xs font-medium text-premium">
                            سود ماهیانه
                          </p>
                          <p className="text-2xl font-bold text-premium">
                            {(selectedFund.monthlyRate * 100).toFixed(0)}٪
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 🛡 پیام تضمین سرمایه */}
                  {selectedFund.description && selectedFund.key !== "hold" && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#0B3D2E]/25 bg-[#0B3D2E]/10 px-4 py-3 text-sm font-medium text-[#0B3D2E] shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-0.5 h-5 w-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <p className="leading-relaxed">{selectedFund.description}</p>
                    </div>
                  )}
                </div>

                <a
                  href={`tel:${phoneTel}`}
                  className="mt-10 w-full rounded-full border border-[#E8F0EB] bg-[#F7F5F0] px-16 py-4 text-center font-bold text-[#0B3D2E] transition-colors hover:bg-white sm:w-fit"
                >
                  سرمایه‌ گذاری
                </a>
              </div>
            </div>
          </>
        )}

        {/* تماس برای رزرو مشاوره حضوری */}
        <div className="flex w-full items-center justify-center px-4 mb-2 mt-16">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-card px-10 py-4 font-medium text-foreground shadow-lg shadow-green-950/5 transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:w-auto">
                <PhoneCall className="h-5 w-5 text-primary transition-transform group-hover:scale-110 group-hover:text-primary-foreground" />
                رزرو مشاوره حضوری
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-t-2xl border-t bg-card dark:bg-cardBg shadow-2xl">
              <DrawerHeader className="text-center">
                <div className="flex justify-center">
                  <PhoneCall className="text-primary h-10 w-10" />
                </div>
                <DrawerTitle className="text-2xl font-bold text-foreground mt-2">
                  مشاوره حضوری
                </DrawerTitle>
                <DrawerDescription className="text-center text-muted-foreground mt-1">
                  برای رزرو مشاوره حضوری با ما تماس بگیرید:
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-center mt-4 space-y-3">
                <p className="text-xl font-semibold text-primary tracking-tight">
                  {phone}
                </p>
                <a
                  href={`tel:${phoneTel}`}
                  className="inline-block px-6 py-2 bg-primary hover:bg-[var(--home-glow)] text-primary-foreground rounded-md font-medium transition"
                >
                  تماس بگیرید
                </a>
              </div>
              <DrawerFooter>
                <DrawerClose className="block mt-6 text-sm text-muted-foreground hover:text-foreground underline text-center">
                  <XIcon className="inline-block" />
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
