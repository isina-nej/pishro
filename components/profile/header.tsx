interface ProfileHeaderProps {
  children: React.ReactNode;
}

const ProfileHeader = ({ children }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 dark:border-borderColor sm:flex-row sm:items-center sm:justify-between md:px-5">
      {children}
    </div>
  );
};

export default ProfileHeader;
