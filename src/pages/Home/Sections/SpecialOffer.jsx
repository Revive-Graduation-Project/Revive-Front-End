import { useNavigate } from "react-router";

// src/pages/Home/Sections/SpecialOffer.jsx
const SpecialOffer = () => {
  const navigate = useNavigate();
  return (
    <section className="py-6 md:py-8 lg:py-15 bg-[#84CF29]  relative rounded-2xl ">
      <div className="container  px-4 md:px-6 lg:px-8 relative z-0">
        <div className="max-w-5xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 md:mb-10">
            Special Favorite Meals, All In One Place 
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white max-w-3xl  mb-4 md:mb-4 leading-relaxed">
            From protein-packed bowls to fresh salads <br /> and wholesome dishes, enjoy the meals with love<br />
            Good food that keeps you coming back.
          </p>
          <div className="flex items-center gap-2.5 mb-8 md:mb-10 text-[#A24D0A] font-bold text-lg md:text-xl lg:text-2xl">
            <span>Balanced • Fresh • Delicious</span>
            <div className="relative inline-flex items-center shrink-0 w-8 h-7">
              {/* Main Heart */}
              <svg className="w-6 h-6 transform -rotate-3 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {/* Smaller Heart */}
              <svg className="w-4 h-4 absolute -top-1 -right-1 transform rotate-12 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>

          <button onClick={
            () => navigate("/favorites")
          }  
            className="
              inline-flex items-center justify-center
              bg-white text-green-700 hover:bg-gray-100
              font-bold text-lg md:text-xl
              px-10  md:px-14 py-2 md:py-3
              rounded-full shadow-xl hover:shadow-2xl
              transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
            "
          >
            Order From Your Favorites Now
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
