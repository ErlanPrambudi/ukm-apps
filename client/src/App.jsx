import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import DashSidebar from "./components/DashSidebar";
import CreateOrganization from "./pages/CreateOrganization";
import UpdateOrganization from "./pages/UpdateOrganization";
import UpdateUserOrganization from "./pages/UpdateUserOrganization";
import OrganizationPage from "./pages/OrganizationPage";
import Organization from "./pages/Organization";
import CreateUser from "./pages/CreateUser";
import UpdateUser from "./pages/UpdateUser";
import React from "react";

const Layout = ({ children }) => (
  <div className="flex">
    <DashSidebar />
    <div className="flex-1">{children}</div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="organization" element={<Organization />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route
              path="create-post"
              element={
                <Layout>
                  <CreatePost />
                </Layout>
              }
            />
            <Route
              path="update-post/:postId"
              element={
                <Layout>
                  <UpdatePost />
                </Layout>
              }
            />
            <React.Fragment>
              <Route
                path="update-user/:userId"
                element={
                  <Layout>
                    <UpdateUser />
                  </Layout>
                }
              />
              <Route
                path="create-organization"
                element={
                  <Layout>
                    <CreateOrganization />
                  </Layout>
                }
              />
              <Route
                path="create-user"
                element={
                  <Layout>
                    <CreateUser />
                  </Layout>
                }
              />
              <Route
                path="update-organization/:organizationId"
                element={
                  <Layout>
                    <UpdateOrganization />
                  </Layout>
                }
              />
              <Route
                path="edit-organization/"
                element={
                  <Layout>
                    <UpdateUserOrganization />
                  </Layout>
                }
              />
            </React.Fragment>
          </Route>
        </Route>

        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/organization/:organizationSlug" element={<OrganizationPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
