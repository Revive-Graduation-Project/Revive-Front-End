// src/pages/Home/Sections/SpecialOffer.jsx
const SpecialOffer = () => {
  return (
    <section className="py-6 md:py-8 lg:py-15 bg-[#84CF29]  relative rounded-2xl ">
      <div className="container  px-4 md:px-6 lg:px-8 relative z-0">
        <div className="max-w-5xl">
          <p className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-5">
            FOR THE HEALTH OF EMPLOYEES / Companies
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 md:mb-10">
            Special Offer for Groups/Companies
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white max-w-3xl  mb-4 md:mb-4 leading-relaxed">
            For companies; we offer a specially designed meal plan for office
            workers. Full spectrum of vitamins and minerals, micro-minerals,
            high calorie content and natural ingredients.
          </p>
          <div className=" px-8 py-1 mb-8 md:mb-10">
            <p className="text-2xl md:text-5xl lg:text-6xl  text-red-500">
              99 EGP <span className="text-white text-4xl">/ Per person</span>
            </p>
          </div>

          <button
            className="
              inline-flex items-center justify-center
              bg-white text-gray-900 hover:bg-gray-100
              font-bold text-lg md:text-xl
              px-10  md:px-14 py-2 md:py-3
              rounded-full shadow-xl hover:shadow-2xl
              transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
            "
          >
            Order Now
          </button>
        </div>
      </div>

      {/* (floating ingredients) */}
      <div className="absolute inset-0 pointer-events-none ">
        <div className="absolute bottom-60 left w-14 h-14 md:w-50 md:h-50 animate-float-slow">
          <img
            src="/images/Design3.png"
            alt="herbs"
            className="w-full h-full object-contain "
          />
        </div>

        <div className="absolute -bottom-18 -right-10 animate-float-fast">
          <img
            src="/public/images/bowl.png"
            alt="bowl"
            className="w-50 h-50 lg:w-full lg:h-full object-contain z-0 "
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
