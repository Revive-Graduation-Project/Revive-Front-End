import { useAuthStore } from "../../store";
import AboutUs from "./Sections/AboutUs";
import FAQSection from "./Sections/FAQSection";
import Hero from "./Sections/Hero";
import PopularMenus from "./Sections/PopularMenus";
import SpecialOffer from "./Sections/SpecialOffer";
import SuggestedMeals from "./Sections/SuggestedMeals";
import Testimonials from "./Sections/Testimonials";
import SmartMealBanners from "./Sections/SmartMealBanners";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

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
        {/* Smart Meal & Customization Banners */}
        <SmartMealBanners />
        {/* Popular Meals — always visible */}
        <PopularMenus />
        {/* Suggested Meals — only shown to authenticated users */}
        {isAuthenticated && <SuggestedMeals />}
        <SpecialOffer />
        <AboutUs />
        <FAQSection />
        <Testimonials />
      </div>
    </div>
  );
}
