"use client";

import { Hash } from "lucide-react"; // آیکن هشتگ از lucide-react
import clsx from "clsx";

interface TagsListProps {
  title?: string;
  tags: string[];
  className?: string;
}

const TagsList: React.FC<TagsListProps> = ({
  tags,
  title = "عنوان بخش برچسب‌ها",
  className,
}) => {
  return (
    <section className="w-full">
      <h3 className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4">
        {title}
      </h3>
      <div
        className={clsx(
          "flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 container-xl px-4 sm:px-6 md:px-8",
          className
        )}
      >
        {tags.map((tag, index) => (
          <button
            key={index}
            className="flex items-center gap-1 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-2xl sm:rounded-3xl border text-xs sm:text-sm md:text-base font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ borderColor: "#214554", color: "#214554" }}
            aria-label={`برچسب ${tag}`}
          >
            <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TagsList;
