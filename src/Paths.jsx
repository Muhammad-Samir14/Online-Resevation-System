import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./LandingPage";
import RegisterandLoginPage from "./RegisterandLoginPage";
import AdminLayout from "./pages/AdminLayout"; 
import ShopNow from "./ShopPage";
import CustomersManagement from "./pages/CustomersManagement";

const route = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <RegisterandLoginPage /> },
  { path: "/shop", element: <ShopNow /> },
  { path: "/admin", element: <AdminLayout /> },
  {path:"/manage-customers", element:<CustomersManagement /> }
]);

export default route;
