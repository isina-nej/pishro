"use client";

import { Hash } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

interface Tag {
  id: string;
  title: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
  usageCount?: number;
}

interface TagsListDynamicProps {
  title?: string;
  tags: Tag[];
  className?: string;
  linkable?: boolean; // آیا تگ‌ها لینک باشند یا خیر
}

const TagsListDynamic: React.FC<TagsListDynamicProps> = ({
  tags,
  title = "عنوان بخش برچسب‌ها",
  className,
  linkable = false,
}) => {
  const TagButton = ({ tag }: { tag: Tag }) => {
    const content = (
      <>
        {tag.icon ? (
          <span className="text-base sm:text-lg">{tag.icon}</span>
        ) : (
          <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
        {tag.title}
      </>
    );

    const baseClasses =
      "flex items-center gap-1 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-2xl sm:rounded-3xl border text-xs sm:text-sm md:text-base font-medium transition-transform duration-200 hover:scale-105 active:scale-95";

    const style = {
      borderColor: tag.color || "#214554",
      color: tag.color || "#214554",
    };

    if (linkable) {
      return (
        <Link
          href={`/tags/${tag.slug}`}
          className={baseClasses}
          style={style}
          aria-label={`برچسب ${tag.title}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        className={baseClasses}
        style={style}
        aria-label={`برچسب ${tag.title}`}
      >
        {content}
      </button>
    );
  };

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
        {tags.map((tag) => (
          <TagButton key={tag.id} tag={tag} />
        ))}
      </div>
    </section>
  );
};

export default TagsListDynamic;
