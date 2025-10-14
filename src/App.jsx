import LandingPage from "./LandingPage.jsx";
import { Route, Routes } from "react-router-dom";
import RegisterandLoginPage from "./RegisterandLoginPage.jsx";
import ShopPage from "./ShopPage.jsx";

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
      <Routes>
        {/* This route ensures that the path "/" loads the LandingPage component */}
        <Route path="/" element={<LandingPage />} />
        
        {/* This route loads the Registration component when visiting "/register" */}
        <Route path="/register" element={<RegisterandLoginPage />} />
        
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </>
  );
}

export default App;
