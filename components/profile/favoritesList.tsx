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
      <div className="p-5 grid grid-cols-3 gap-5">
        {[0, 1, 2].map((item, idx) => (
          <div key={idx} className="bg-[#f5f5f5] rounded h-56"></div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
