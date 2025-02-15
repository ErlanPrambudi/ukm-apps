import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComment from "../components/DashComment";
import DashboardComp from "../components/DashboardComp";
import CreateUser from "./CreateUser";
import AddBook from "./AddBook";
import DashBook from "../components/DashBook";
import AddAccess from "./AddAccess";
import { AddLoan } from "./AddLoan";
import AddLoanStatus from "./AddLoanStatus";
import DashLoanStatus from "../components/DashLoanStatus";
// import AddLoanStatus from "./AddLoanStatus";
// import DashLoanStatus from "../components/DashLoanStatus";

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
      {tab === "comments" && <DashComment />}
      {/* ini yang perpus */}
      {tab === "add-book" && <AddBook />}
      {tab === "dash-book" && <DashBook />}
      {tab === "add-access" && <AddAccess />}
      {tab === "add-user" && <CreateUser />}
      {tab === "dash-users" && <DashUsers />}
      {tab === "add-loan-status" && <AddLoanStatus />}
      {tab === "dash-loan-status" && <DashLoanStatus />}

      {/* {tab === "add-loan" && <AddLoan />} */}
    </div>
  );
};

export default Dashboard;
