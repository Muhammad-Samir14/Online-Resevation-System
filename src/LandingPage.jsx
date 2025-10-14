import Navbar from "./Navbar.jsx"; // Fixed import
import HeroCarousal from "./HeroCarousal.jsx"; // Fixed import
import Hero from "./Hero.jsx"; // Fixed import
import ShopNow from "./ShopNow.jsx"; // Fixed import
import HowItWorks from "./HowItWorks.jsx"; // Fixed import
import Footer from "./Footer.jsx"; // Fixed import
import { Link } from "react-router-dom";

function LandingPage ()
{
    return (
        <>
            <Navbar />
            <HeroCarousal />    
            <Hero />
            <ShopNow />
            <HowItWorks />
            {/* The first Footer component */}
            <Footer /> 

            {/* This div was corrected for className syntax and path */}
            <div className="text-center my-4">
                <Link to="/register">
                    <button className="btn btn-primary btn-lg fw-bold shadow-sm">
                        Register
                    </button>
                </Link>
            </div>
            
            {/* The original second Footer call was removed as it was redundant. */}
        </>
    );
}

export default LandingPage;
