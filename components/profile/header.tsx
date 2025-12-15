interface ProfileHeaderProps {
  children: React.ReactNode;
}

const ProfileHeader = ({ children }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-5 py-4 md:py-6 border-b border-[#f5f5f5] gap-3 sm:gap-0">
      {children}
    </div>
  );
};

export default ProfileHeader;
