import { createBrowserRouter } from "react-router-dom";

import LandingPage from "./LandingPage";
import RegisterandLoginPage from "./RegisterandLoginPage";
import AdminLayout from "./pages/AdminLayout";
import AdminLoginPage from "./pages/AdminLoginPage";

import ShopPage from "./ShopPage";
import ShopNow from "./ShopNow";
import BookGasPage from "./BookGasPage";
import TrackOrderPage from "./TrackOrderPage";

import AboutUs from "./AboutUs";
import Contact from "./Contact";

import Navbar from "./Navbar";
import Footer from "./Footer";
import HowItWorks from "./HowItWorks";

function PublicShopPage() {
  return (
    <>
      <Navbar />
      <main>
        <ShopNow />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}

const route = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/services",
    element: <PublicShopPage />,
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/register",
    element: <RegisterandLoginPage />,
  },
  {
    path: "/book-gas",
    element: <BookGasPage />,
  },
  {
    path: "/track-order",
    element: <TrackOrderPage />,
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
  },
]);

export default route;
