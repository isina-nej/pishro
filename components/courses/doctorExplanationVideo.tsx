"use client";

import { useState } from "react";
import { IoPlayCircle } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DoctorExplanationVideoProps {
  videoUrl?: string;
  posterUrl?: string;
}

export default function DoctorExplanationVideo({
  videoUrl = "/videos/doctor-explanation.mp4", // Default video URL
  posterUrl,
}: DoctorExplanationVideoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-6 py-3 border-2 border-myPrimary text-myPrimary hover:bg-myPrimary hover:text-white transition-all duration-300 rounded-full font-bold"
        >
          <IoPlayCircle size={20} />
          توضیحات خانم دکتر
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            توضیحات خانم دکتر
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            ویدیو توضیحات تکمیلی دوره
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            src={videoUrl}
            poster={posterUrl}
            controls
            controlsList="nodownload"
            className="w-full h-full object-contain"
            preload="metadata"
          >
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
