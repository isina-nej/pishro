interface ProfileHeaderProps {
  children: React.ReactNode;
}

const ProfileHeader = ({ children }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
      {children}
    </div>
  );
};

export default ProfileHeader;
