import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TeacherSideBar from "../components/TeacherSideBar";

export default function Layout({ children }) {
  return (
    <>
      {/* Header at the top */}
      <Header />

      {/* Flexbox layout to split the sidebar and content */}
      <div className="flex pt-16 bg-[#F0F2F5] min-h-screen"> {/* Apply background color here */}
        {/* Sidebar on the left, hidden on small screens */}
        <div className="hidden md:block w-1/4">
          <TeacherSideBar />
        </div>

        {/* Main content section, takes full width on mobile */}
        <div className="w-full md:w-3/4 p-6">
          {children} {/* Dynamic content from pages */}
        </div>
      </div>
    </>
  );
}
