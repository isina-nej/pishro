import Link from "next/link";

interface HeadingProps {
  children: string;
  link?: string | React.JSX.Element;
  href?: string;
  className?: string;
}

const Heading = ({ children, link, href, className }: HeadingProps) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-[22px] mb-4">{children}</h2>
        {link && (
          <Link href={href || "#"} className="text-sm text-[#666666]">
            {link}
          </Link>
        )}
      </div>
      <div className="h-[2px] w-full bg-[#e1e1e1] relative rounded-sm">
        <div className="absolute bottom-0 right-0 h-[3px] w-1/4 bg-myPrimary rounded-sm"></div>
      </div>
    </div>
  );
};

export default Heading;
