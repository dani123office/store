import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ScrollToTop } from "../components";

const HomeLayout = () => {
  return (
    <>
      <ScrollToTop />
      <div className="announcement-bar">
        Free Shipping Nationwide — For Queries: +923-111-111-975
      </div>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default HomeLayout;
