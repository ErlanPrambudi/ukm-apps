import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComment from "../components/DashComment";
import DashboardComp from "../components/DashboardComp";
import CreatePost from "./CreatePost";
import CreateOrganization from "./CreateOrganization";
import CreateUser from "./CreateUser";
import UpdateUserOrganization from "./UpdateUserOrganization";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex  flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* posts */}
      {tab === "posts" && <DashPosts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* coment */}
      {tab === "comments" && <DashComment />}
      {/* dashboard component */}
      {tab === "dash" && <DashboardComp />}
      {/* Update Organization  */}
      {tab === "edit-organization" && <UpdateUserOrganization />}
      {/* create post */}
      {tab === "create-post" && (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="scale-100">
            <CreatePost />
          </div>
        </div>
      )}
      {/* create organization */}
      {tab === "create-organization" && (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="scale-100">
            <CreateOrganization />
          </div>
        </div>
      )}
      {/* create user */}
      {tab === "create-user" && (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="scale-100">
            <CreateUser />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
