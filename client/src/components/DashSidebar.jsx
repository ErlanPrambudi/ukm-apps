import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { IoIosCreate } from "react-icons/io";
import { IoMdCreate } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

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
      const res = await fetch(`/api/user/signout/`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
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
            {currentUser.isAdmin && (
              <React.Fragment>
                <Link to="/dashboard?tab=create-organization">
                  <Sidebar.Item active={tab === "create-organization"} icon={IoIosCreate} as="div">
                    Create organization
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div">
                    Pengurus
                  </Sidebar.Item>
                </Link>
              </React.Fragment>
            )}
            {currentUser.role === "pengurus" && (
              <Link to="/dashboard?tab=edit-organization">
                <Sidebar.Item active={tab === "edit-organization"} icon={HiDocumentText} as="div">
                  Edit Organization
                </Sidebar.Item>
              </Link>
            )}
            {(currentUser.role === "admin" || currentUser.role === "pengurus") && (
              <React.Fragment>
                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item active={tab === "comments"} icon={HiAnnotation} as="div">
                    Comments
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=posts">
                  <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">
                    All Posts
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=create-post">
                  <Sidebar.Item active={tab === "create-post"} icon={IoMdCreate} as="div">
                    Create a post
                  </Sidebar.Item>
                </Link>
              </React.Fragment>
            )}
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
