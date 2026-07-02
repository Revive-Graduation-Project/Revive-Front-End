import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    const section = document.getElementById("popular-meals");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreMore = () => {
    navigate("/menu");
    // After navigation, scroll to the regular-food section
    setTimeout(() => {
      const section = document.getElementById("regular-food");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };
  return (
    <section className="relative overflow-hidden">
      <div
        className="
          container mx-auto
          pt-40 md:pt-20 lg:pt-20 pb-6
          grid grid-cols-1 lg:grid-cols-2
          items-center
          gap-1 lg:gap-12
          relative 
        "
      >
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <img
            src="/images/Spones.png"
            alt="Shape"
            className="mx-auto lg:mx-0 mb-6  hidden lg:block"
          />

          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-(--color-orange)">
                Healthy life Comes From
              </span>
              <br />
              <span className="text-(--color-green)">Healthy food</span>
            </h1>

            <p className="text-gray-500 max-w-md mx-auto lg:mx-0">
              Here we will find all the best Quality, and pure food. your
              healthy is the first Priority for us
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleExploreMore}
                className="bg-(--color-orange) text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition cursor-pointer"
              >
                Order now
              </button>

              <button
                onClick={handleOrderNow}
                className="border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mt-16 lg:mt-0">
          <img
            src="/images/Design1.png"
            alt="Design1"
            className="absolute top-0 lg:-top-30 right-0 scale-75 lg:scale-100 hidden lg:block"
          />
          <img
            src="/images/Design2.png"
            alt="Design2"
            className="absolute -top-20 lg:-top-30 right-0 scale-75 lg:scale-100 hidden lg:block"
          />

          <img
            src="/images/Herodish.png"
            alt="Healthy Food"
            className="
      rounded-full shadow-lg z-0 relative
      w-64 sm:w-72 md:w-70 lg:w-auto
      left-0 lg:left-60
      top-0 lg:top-15
      hidden lg:block
    "
          />

          {/* Small dishes */}
          <img
            src="/images/dish.png"
            alt="dish"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-10 lg:left-150 w-12 lg:w-14 rounded-full shadow-md hidden lg:block"
          />
          <img
            src="/images/dish.png"
            alt="dish"
            className="absolute -bottom-10 left-1/3 lg:-bottom-20 lg:left-132 w-12 lg:w-14 rounded-full shadow-md hidden lg:block"
          />
          <img
            src="/images/dish.png"
            alt="dish"
            className="absolute -bottom-20 right-1/3 lg:-bottom-35 lg:left-95 w-12 lg:w-14 rounded-full shadow-md hidden lg:block"
          />
          <img
            src="/images/dish.png"
            alt="dish"
            className="absolute -bottom-10 right-1/4 lg:-bottom-20 lg:left-55 w-12 lg:w-14 rounded-full shadow-md hidden lg:block"
          />
          <img
            src="/images/dish.png"
            alt="dish"
            className="absolute bottom-6 right-1/2 translate-x-1/2 lg:bottom-10 lg:left-35 w-12 lg:w-14 rounded-full shadow-md hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
