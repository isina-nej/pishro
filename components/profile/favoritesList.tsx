import { LuSquareChevronLeft } from "react-icons/lu";
import ProfileHeader from "./header";

const FavoritesList = () => {
  return (
    <div className="bg-white rounded-md">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-[#131834]">
          لیست های محبوب شما
        </h4>
        <button>
          <LuSquareChevronLeft className="size-5" />
        </button>
      </ProfileHeader>
      <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {[0, 1, 2].map((item, idx) => (
          <div key={idx} className="bg-[#f5f5f5] rounded h-48 md:h-56"></div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
