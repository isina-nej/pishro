"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fakeQuestions } from "@/public/data";
import toast from "react-hot-toast"; // ✅ ایمپورت hot toast

const QAModal = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);

    // ✅ نمایش Toast به جای Alert
    toast.success("پاسخ‌ها با موفقیت ثبت شدند ", {
      duration: 3000,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#214254] hover:bg-green-900 text-white text-lg px-12 py-8 rounded-lg shadow-lg">
          مشاوره سرمایه گذاری
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="rtl text-xl font-bold text-gray-800">
            فرم ثبت‌نام سایت سرمایه‌گذاری
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {fakeQuestions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="text-gray-700 font-medium">{q.question}</p>

              {q.type === "text" && (
                <Input
                  placeholder="پاسخ خود را وارد کنید"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="bg-gray-50"
                />
              )}

              {q.type === "textarea" && (
                <Textarea
                  placeholder="پاسخ خود را وارد کنید"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="bg-gray-50"
                />
              )}

              {q.type === "select" && q.options && (
                <Select onValueChange={(val) => handleChange(q.id, val)}>
                  <SelectTrigger className="bg-gray-50 rtl">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {q.options.map((opt, idx) => (
                      <SelectItem key={idx} value={opt} className="rtl">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#214254] hover:bg-green-900 text-white font-semibold"
          >
            ثبت اطلاعات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QAModal;
