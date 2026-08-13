import Link from "next/link";
import Image from "next/image";

// Categories data with image sources, labels, and links
export const categoriesData = [
  {
    src: "/images/home/c/crypto.jpg",
    label: "کریپتو",
    link: "/courses/cryptocurrency",
  },
  {
    src: "/images/home/c/stock.jpg",
    label: "بورس",
    link: "/courses/stock-market",
  },
  {
    src: "/images/home/c/metaverse.webp",
    label: "متاورس",
    link: "/courses/metaverse",
  },
  {
    src: "/images/home/c/nft.jpg",
    label: "NFT",
    link: "/courses/nft",
  },
  {
    src: "/images/home/c/airdrop.jpg",
    label: "ایردراپ",
    link: "/courses/airdrop",
  },
];

const Categories = () => {
  return (
    <div className="mt-20 container-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categoriesData.map((item, idx) => (
          // Using Link as a wrapper with group to manage hover effects
          <Link href={item.link} key={idx} className="group block relative">
            {/* Relative container-md for image, overlay, and text */}
            <div className="relative h-36 w-48 rounded-tr-3xl rounded-bl-3xl group-hover:rounded-xl transition-all duration-300 overflow-hidden">
              {/* Background image with transition effects */}
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#0A100E]/55 transition-all duration-300 group-hover:bg-[#0A100E]/40"></div>
              {/* Centered text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-medium text-[#E8F0EB] transition-all duration-300 group-hover:text-xl">
                  {item.label}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
