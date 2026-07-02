import { motion } from "framer-motion";

const CustomizeHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[280px] md:h-[350px] w-full overflow-hidden  mt-10"
    >
      {/* Background Image */}
      <img
        src="/public/images/customize/customize-hero.png"
        alt="Customize Meal"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 " />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Customize your Meal
        </h1>

        <p className="text-sm md:text-lg text-gray-200">
          Build your own meal with Revive Experience
        </p>
      </div>
    </motion.div>
  );
};

export default CustomizeHero;
