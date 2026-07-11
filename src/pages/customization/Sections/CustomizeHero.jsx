import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Utensils, Award } from "lucide-react";

const CustomizeHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[260px] sm:h-[320px] md:h-[360px] w-full overflow-hidden rounded-3xl shadow-xl mt-6"
    >
      {/* Background Image */}
      <img
        src="/images/customize/customize-hero.png"
        alt="Customize Meal"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start max-w-2xl text-white px-6 sm:px-12 md:px-16">
        {/* Quality Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/90 text-white backdrop-blur-sm shadow-sm">
            <Sparkles size={12} />
            <span>Chef Crafted</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-gray-100 backdrop-blur-sm border border-white/20">
            <Utensils size={12} />
            <span>Made to Order</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-gray-100 backdrop-blur-sm border border-white/20">
            <Award size={12} />
            <span>Fresh Farm Ingredients</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Customize your Meal
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-2 max-w-xl font-normal">
          Pick your fresh base, vibrant vegetables, handcrafted sauces, and crispy extras tailored exactly to your macro goals.
        </p>
      </div>
    </motion.div>
  );
};

export default CustomizeHero;
