import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  data: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    author: string | null;
    category: string;
    tags: string[];
    published: boolean;
    publishedAt: Date | null;
    views: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

const NewsCard = ({ data }: NewsCardProps) => {
  return (
    <div className="group min-h-[200px] flex justify-between border border-[#e5e7eb] rounded-xl overflow-hidden hover:shadow-xl hover:border-myPrimary/20 transition-all duration-300 bg-white">
      {/* تصویر */}
      <div className="relative flex-shrink-0 w-[200px] xl:w-[230px] min-h-[200px] overflow-hidden">
        <Image
          src={data.coverImage ?? "/images/default-news.jpg"}
          alt={data.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 230px"
          priority={false}
        />
      </div>

      {/* محتوا */}
      <div className="px-5 xl:px-7 py-6 flex flex-col justify-between flex-1">
        <div>
          <h5 className="font-bold text-base text-[#131b22] mb-3 line-clamp-2 leading-7 group-hover:text-myPrimary transition-colors">
            {data.title}
          </h5>
          <p className="font-medium text-sm text-[#495157] line-clamp-3 leading-7 mb-4">
            {data.excerpt}
          </p>

          {data.author && (
            <p className="text-xs text-gray-500 mb-2">
              نویسنده: {data.author}
            </p>
          )}
        </div>

        {/* دکمه ادامه مطلب */}
        <Link
          href={`/news/${data.slug}`}
          className="text-sm font-semibold text-myPrimary hover:text-myPrimary/80 transition-colors self-start inline-flex items-center gap-2 no-underline"
        >
          <span>ادامه مطلب</span>
          <span className="group-hover:translate-x-1 transition-transform">←</span>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
