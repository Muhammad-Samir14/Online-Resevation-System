import Footer from "./Footer";
import Hero from "./Hero";
import HeroCarousal from "./HeroCarousal";
import HowItWorks from "./howItworks";
import Navbar from "./Navbar";
import RegisterandLoginPage from "./RegisterandLoginPage";

function LandingPage ()
{
    return (<>

    <RegisterandLoginPage />
    <Navbar />
    <HeroCarousal />    
    <Hero />
    <HowItWorks />
    <Footer />
    </>
    );

}
export default LandingPage;