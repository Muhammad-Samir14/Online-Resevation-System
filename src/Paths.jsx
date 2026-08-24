import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./LandingPage";
import RegisterandLoginPage from "./RegisterandLoginPage";
import AdminLayout from "./pages/AdminLayout";
import ShopPage from "./ShopPage";
import BulkDeliveryPage from "./BulkDeliveryPage";
import AboutPage from "./AboutPage";

const route = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <RegisterandLoginPage /> },
  { path: "/shop", element: <ShopPage /> },
  { path: "/bulk-delivery", element: <BulkDeliveryPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/admin", element: <AdminLayout /> },
]);

export default route;
