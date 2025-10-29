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
    <section className="mt-20">
      <h3 className="text-center mb-12 font-bold text-5xl">{title}</h3>
      <div
        className={clsx(
          "flex flex-wrap justify-center gap-3 container",
          className
        )}
      >
        {tags.map((tag, index) => (
          <button
            key={index}
            className="flex items-center gap-1 px-3 py-1.5 rounded-3xl border text-sm font-medium transition-transform duration-200 hover:scale-105"
            style={{ borderColor: "#214554", color: "#214554" }}
          >
            <Hash className="w-4 h-4" />
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TagsList;
