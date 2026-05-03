interface DateProps {
  date: string; // تاریخ به صورت 1403/12/02
}

const Date = ({ date }: DateProps) => {
  // جدا کردن روز و ماه از تاریخ
  const [_year, month, day] = date.split("/");

  return (
    <div className="flex flex-col items-center bg-white px-1 py-1.5">
      {/* نمایش روز */}
      <div className="text-sm font-medium text-[#1a1a1a]">{day}</div>

      {/* خط مشکی بین روز و ماه */}
      <div className="w-9 h-[1px] bg-[#B7BDC1]"></div>

      {/* نمایش ماه */}
      <div className="text-sm font-medium text-[#1a1a1a] mt-1">{month}</div>
    </div>
  );
};

export default Date;
