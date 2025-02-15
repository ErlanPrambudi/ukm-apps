import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OTPVerification from "./pages/OTPVerification";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import DashSidebar from "./components/DashSidebar";
import OrganizationPage from "./pages/OrganizationPage";
import UpdateUser from "./pages/UpdateUser";
import UpdateBook from "./pages/UpdateBook";
import React from "react";
import UpdateCategory from "./pages/UpdateCategory";
import UpdateLoanStatus from "./pages/UpdateLoanStatus";

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
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="otp" element={<OTPVerification />} />
        <Route path="search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/update-book/:bookId" element={<UpdateBook />} />
          <Route path="/update-category/:categoryId" element={<UpdateCategory />} />
          <Route path="/update-user/:userId" element={<UpdateUser />} />
          <Route path="/update-loan-status/:statusId" element={<UpdateLoanStatus />} />
        </Route>

        <Route path="/organization/:organizationSlug" element={<OrganizationPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
