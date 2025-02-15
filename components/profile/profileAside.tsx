import Image from "next/image";

const user = {
  name: "نام کاربر",
  phone: "09123456789",
  image: "/images/profile/profile-1.png",
};

const ProfileAside = () => {
  return (
    <aside className="rounded-md bg-[#131B22] text-white w-[286px]">
      {/* profile */}
      <div className="w-full flex flex-col justify-center items-center pt-8 pb-16">
        <div className="relative rounded-full overflow-hidden size-[75px] mb-2">
          <Image
            alt="user-profile"
            src={user.image}
            fill
            className="object-cover"
          />
        </div>
        <p className="font-medium text-sm">{user.phone}</p>
        <p className="font-medium text-sm">{user.name}</p>
      </div>
      {/* navigation links */}
      <div></div>
    </aside>
  );
};

export default ProfileAside;
