
import { Navbar } from "../components";
import LandingSection from "../components/LandingSection";
import FeaturesSection from "../components/FeaturesSection";

export default function Home() {
  return (
    <div className="home-page bg-[#ffffff]">
      <Navbar />
      <LandingSection />
      <FeaturesSection />
    </div>
  );
}
