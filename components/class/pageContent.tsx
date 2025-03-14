"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdVideoLibrary } from "react-icons/md"; // یا می‌توان از BiVideo هم استفاده کرد
import VideoPlayer from "./videoPlayer";
import { videoList } from "@/public/data";

interface Video {
  id: string;
  label: string;
  date: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
}

interface ClassPageContentProps {
  classData?: Video;
}

const ClassPageContent: React.FC<ClassPageContentProps> = ({ classData }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    classData || videoList[0] || null
  );

  useEffect(() => {
    if (classData) {
      setSelectedVideo(classData);
    }
  }, [classData]);

  return (
    <div className="container-xl">
      <div className="flex gap-6">
        {/* ویدیو پلیر */}
        <div className="flex-1 w-full min-w-4xl">
          {selectedVideo ? (
            <VideoPlayer
              label={selectedVideo.label}
              videoUrl={selectedVideo.videoUrl}
            />
          ) : (
            <p className="text-center text-gray-500">
              ویدیویی برای نمایش وجود ندارد
            </p>
          )}
        </div>

        {/* سایدبار لیست ویدیوها */}
        <div className="w-96 p-4 rounded-lg mt-8">
          <h3 className="text-sm font-semibold pb-3 border-b mb-4 flex items-center gap-3">
            <MdVideoLibrary className="text-gray-600 dark:text-gray-300 text-lg" />
            ویدیو سایر جلسات
          </h3>
          <ul className="space-y-4 max-h-[500px] overflow-y-auto">
            {videoList.map((video) => (
              <li
                key={video.id}
                className={`cursor-pointer rounded-md transition-all duration-200 ${
                  video.id === selectedVideo?.id && "bg-gray-100"
                } ${"hover:bg-gray-200 dark:hover:bg-gray-800"}`}
                onClick={() => setSelectedVideo(video)}
              >
                <Link
                  href={`/class/${video.id}`}
                  className="flex items-center gap-3 p-3 w-full"
                >
                  {/* تصویر بندانگشتی */}
                  <div className="relative w-20 h-16 rounded-full">
                    <Image
                      src={video.thumbnail}
                      alt={video.label}
                      fill
                      className=" rounded-full object-cover"
                    />
                  </div>

                  {/* اطلاعات ویدیو */}
                  <div className="flex flex-col">
                    <span className="text-xs text-[#666]">{video.date}</span>
                    <span className="font-semibold text-[#495157] text-xs">
                      {video.label}
                    </span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassPageContent;
