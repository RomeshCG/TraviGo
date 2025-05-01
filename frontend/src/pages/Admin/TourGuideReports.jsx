import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const TourGuideReports = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Tour Guide Reports</h2>
            <p>This is a placeholder for future tour guide reports and analytics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideReports;
