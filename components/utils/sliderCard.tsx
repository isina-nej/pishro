import Image from "next/image";
import Link from "next/link";

interface SliderCardProps {
  item: {
    name: string;
    logo: string;
    changes: string;
    link: string;
  };
}

const SliderCard = ({ item }: SliderCardProps) => {
  return (
    <div
      className={`
        h-[200px] px-6 py-12 rounded-[8px] transition-all duration-500
      bg-[#212121] text-white
      `}
    >
      <div className="flex justify-between items-center ltr">
        <div className="flex items-center gap-5">
          <div className="size-[40px] rounded-[50%] overflow-hidden flex justify-center items-center">
            <Image src={item.logo} alt={item.name} width={40} height={40} />
          </div>
          <div>
            <h4>{item.name}</h4>
            <p className="text-[8px] font-semibold opacity-40">FINANCE</p>
          </div>
        </div>
        <p>{item.changes}</p>
      </div>
      <div>
        <Link
          href={item.link}
          className="h-10 w-full rounded-[3px] bg-[#0f0f0f] text-white flex items-center justify-center mt-5 text-sm font-semibold"
        >
          Watch Market
        </Link>
      </div>
    </div>
  );
};

export default SliderCard;
