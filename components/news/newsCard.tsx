import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  data: {
    title: string;
    description: string;
    image: string;
    date: string;
    type: string;
    category: string;
    link: string;
  };
}

const NewsCard = ({ data }: NewsCardProps) => {
  return (
    <Link
      href={data.link}
      className="h-[200px] flex justify-between border-[#e1e1e1] border rounded-[5px] overflow-hidden"
    >
      <div className="relative flex-shrink-0 w-[230px] h-[200px]">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="px-6 py-5 flex-1">
        <h5 className="font-bold text-sm text-[#131b22] mb-5 line-clamp-2 leading-7">
          {data.title}
        </h5>
        <p className="font-medium text-xs text-[#495157] line-clamp-3 leading-6">
          {data.description}
        </p>
      </div>
    </Link>
  );
};

export default NewsCard;
