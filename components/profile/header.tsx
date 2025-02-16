interface ProfileHeaderProps {
  children: React.ReactNode;
}

const ProfileHeader = ({ children }: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center px-5 py-6 border-b border-[#f5f5f5]">
      {children}
    </div>
  );
};

export default ProfileHeader;
