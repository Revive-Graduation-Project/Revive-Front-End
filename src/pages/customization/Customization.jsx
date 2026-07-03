// pages/Customize.jsx

import CustomizeHero from "./Sections/CustomizeHero";
import BaseSelector from "./Sections/BaseSelector";
import IngredientsSection from "./Sections/IngredientsSection";
import CommentBox from "./Sections/CommentBox";
const customizeData = [];
import SummaryBox from "./Sections/SummaryBox";

const Customize = () => {
  return (
    <div className="bg-white min-h-screen px-20">
      {/* HERO */}
      <div className="container mx-auto  pt-32">
        <CustomizeHero />
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 grid lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">🍳 Let's Start Cooking..</h2>

          <BaseSelector meals={customizeData} />
          <IngredientsSection />
          <CommentBox />
        </div>

        {/* RIGHT SIDE */}
        <div>
          <SummaryBox />
        </div>
      </div>
    </div>
  );
};

export default Customize;
