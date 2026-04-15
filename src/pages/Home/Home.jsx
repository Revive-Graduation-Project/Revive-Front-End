import AboutUs from "./Sections/AboutUs";
import FAQSection from "./Sections/FAQSection";
import Hero from "./Sections/Hero";
import PopularMenus from "./Sections/PopularMenus";
import RegularFood from "./Sections/RegularFood";
import SpecialOffer from "./Sections/SpecialOffer";
import Testimonials from "./Sections/Testimonials";

export default function Home() {
  return (
    <div
      className="
        home-page 
        bg-white 
        min-h-screen
        px-4 md:px-10 lg:px-20
        overflow-hidden
      "
    >
      <div className="py-12 md:py-16 lg:py-20 space-y-16 md:space-y-20 lg:space-y-24">
        <Hero />
        <PopularMenus />
        <RegularFood />
        <SpecialOffer />
        <AboutUs />
        <FAQSection />
        <Testimonials />
      </div>
    </div>
  );
}
