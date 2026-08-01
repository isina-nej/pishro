import ProfileHeader from "./header";
import EmptyState from "./emptyState";

const FavoritesList = () => {
  return (
    <div className="bg-card rounded-md">
      <ProfileHeader>
        <h4 className="font-medium text-sm text-foreground">
          لیست‌های محبوب شما
        </h4>
      </ProfileHeader>
      <div className="p-8">
        <EmptyState
          title="این بخش به‌زودی فعال می‌شود"
          description="امکان ذخیره و مدیریت دوره‌های مورد علاقه‌ات به‌زودی به پنل اضافه می‌شود."
          href="/courses"
          action="مشاهده دوره‌ها"
        />
      </div>
    </div>
  );
};

export default FavoritesList;
