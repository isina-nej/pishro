"use client";

import { useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { HiOutlineViewList } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { newsTimeRange } from "@/public/data";
import { newsCategory } from "@/public/data";
import { newsDataType } from "@/public/data";

const Filter = () => {
  // State to store selected time range
  const [timeRange, setTimeRange] = useState(newsTimeRange[0]);
  const [category, setCategory] = useState(newsCategory[0]);
  const [dataType, setDataType] = useState(newsDataType[0]);

  return (
    <div className="h-[40px] w-full flex justify-between items-start shadow-md">
      <div className="flex gap-8">
        {/* select time range */}
        <Select
          dir="rtl"
          value={timeRange.value} // Set the selected value
          onValueChange={(value) => {
            // Find the selected object from newsTimeRange
            const selected = newsTimeRange.find((item) => item.value === value);
            if (selected) setTimeRange(selected);
          }}
        >
          <SelectTrigger className="min-w-[145px] w-fit">
            <SelectValue>
              <div className="flex items-center gap-2">
                <LuListFilter className="text-[#495157]" />
                <span className="font-medium text-xs text-[#495157]">
                  بازه زمانی:
                </span>
                <span>{timeRange.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {newsTimeRange.map((item, idx) => (
              <SelectItem key={idx} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* select group */}
        <Select
          dir="rtl"
          value={category.value} // Set the selected value
          onValueChange={(value) => {
            // Find the selected object from newsCategory
            const selected = newsCategory.find((item) => item.value === value);
            if (selected) setCategory(selected);
          }}
        >
          <SelectTrigger className="min-w-[145px] w-fit">
            <SelectValue>
              <div className="flex items-center gap-2">
                <RxDashboard className="text-[#495157]" />
                <span className="font-medium text-xs text-[#495157]">
                  دسته بندی:
                </span>
                <span>{category.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {newsCategory.map((item, idx) => (
              <SelectItem key={idx} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        {/* sorting */}
        <Select
          dir="rtl"
          value={dataType.value} // Set the selected value
          onValueChange={(value) => {
            // Find the selected object from newsCategory
            const selected = newsDataType.find((item) => item.value === value);
            if (selected) setDataType(selected);
          }}
        >
          <SelectTrigger className="min-w-[145px] w-fit">
            <SelectValue>
              <div className="flex items-center gap-2">
                <HiOutlineViewList className="text-[#495157]" />
                <span className="font-medium text-xs text-[#495157]">
                  نوع مطلب:
                </span>
                <span>{dataType.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {newsDataType.map((item, idx) => (
              <SelectItem key={idx} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
