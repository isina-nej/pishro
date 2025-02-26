import Link from "next/link";
import Image from "next/image";

export const categoriesData = [
  {
    src: "/images/home/crypto.jpg",
    label: "کریپتوکارنسی",
    link: "/cryptocurrency",
  },
  {
    src: "/images/home/stock.png",
    label: "بورس",
    link: "/stock-market",
  },
  {
    src: "/images/home/metaverse.png",
    label: "متاورس",
    link: "/metaverse",
  },
  {
    src: "/images/home/nft.png",
    label: "NFT",
    link: "/nft",
  },
  {
    src: "/images/home/airdrop.png",
    label: "ایردراپ",
    link: "/airdrop",
  },
];
const Categories = () => {
  return (
    <div className="mt-20 container">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categoriesData.map((item, idx) => (
            <div key={idx} className="text-center">
              <Link
                href={item.link}
                className="flex flex-col gap-6 justify-center items-center"
              >
                <div className="relative size-20">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="w-full object-cover mb-8 rounded-full overflow-hidden"
                  />
                </div>
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
