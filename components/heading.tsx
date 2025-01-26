interface HeadingProps {
  children: string;
}

const Heading = ({ children }: HeadingProps) => {
  return (
    <div>
      <h2 className="font-bold text-[22px] mb-4">{children}</h2>
      <div className="h-[2px] w-full bg-[#e1e1e1] relative rounded-sm">
        <div className="absolute bottom-0 right-0 h-[3px] w-1/4 bg-myPrimary rounded-sm"></div>
      </div>
    </div>
  );
};

export default Heading;
