import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiBookOpen, HiChartPie, HiDocumentText, HiOutlineUser, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { IoIosCreate, IoMdBook, IoMdKey } from "react-icons/io";
import { IoMdCreate } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight, FaPlusCircle, FaRegEdit, FaUserPlus } from "react-icons/fa";

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        console.log("No token found, user already logged out.");
        dispatch(signoutSuccess()); // Pastikan Redux diupdate
        navigate("/sign-in"); // Redirect ke halaman login
        return;
      }

      const res = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Kirim token ke backend untuk dimasukkan ke blacklist
        },
      });

      const data = await res.json();
      if (!res.ok) {
        console.log("Logout failed:", data.message);
      } else {
        console.log("Logout successful:", data.message);
        localStorage.removeItem("token"); // Hapus token dari localStorage
        dispatch(signoutSuccess()); // Update Redux state
        navigate("/sign-in"); // Redirect ke halaman login
      }
    } catch (error) {
      console.log("Error during logout:", error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin ? "" : "User"} labelColor="dark" as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <React.Fragment>
            <React.Fragment>
              <Link to="/dashboard?tab=add-book">
                <Sidebar.Item active={tab === "add-book"} icon={IoMdCreate} as="div">
                  Add books
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=dash-book">
                <Sidebar.Item active={tab === "dash-book"} icon={IoMdBook} as="div">
                  All Books
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=add-user">
                <Sidebar.Item active={tab === "add-user"} icon={HiOutlineUser} as="div">
                  Add User
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=dash-users">
                <Sidebar.Item active={tab === "dash-users"} icon={HiOutlineUserGroup} as="div">
                  All User
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=add-loan">
                <Sidebar.Item active={tab === "add-loan"} icon={FaRegEdit} as="div">
                  Borrowing
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=add-loan-status">
                <Sidebar.Item active={tab === "add-loan-status"} icon={FaPlusCircle} as="div">
                  add loan status
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=dash-loan-status">
                <Sidebar.Item active={tab === "dash-loan-status"} icon={IoMdBook} as="div">
                  All Loan Status
                </Sidebar.Item>
              </Link>
              {/* <Link to="/dashboard?tab=add-access">
                <Sidebar.Item active={tab === "add-access"} icon={IoMdKey} as="div">
                  Add Access
                </Sidebar.Item>
              </Link> */}
            </React.Fragment>
          </React.Fragment>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
