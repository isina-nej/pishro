"use client";

import { Hash } from "lucide-react"; // آیکن هشتگ از lucide-react
import clsx from "clsx";

interface TagsListProps {
  tags: string[];
  className?: string;
}

const TagsList: React.FC<TagsListProps> = ({ tags, className }) => {
  return (
    <div className={clsx("flex flex-wrap gap-3 container", className)}>
      {tags.map((tag, index) => (
        <button
          key={index}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm font-medium transition-transform duration-200 hover:scale-105"
          style={{ borderColor: "#214554", color: "#214554" }}
        >
          <Hash className="w-4 h-4" />
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagsList;
