import OrdersTable from "./ordersTable";
import EnrolledCourses from "./enrolledCourses";

const ProfileMainContent = () => {
  return (
    <div>
      <EnrolledCourses />
      <OrdersTable />
    </div>
  );
};

export default ProfileMainContent;
