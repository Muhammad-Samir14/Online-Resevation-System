import Navbar from "./Navbar";
import HeroCarousal from "./HeroCarousal";
import Hero from "./Hero";
import ShopNow from "./ShopNow";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <HeroCarousal />
        <Hero />
        <ShopNow />
        <HowItWorks />
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;