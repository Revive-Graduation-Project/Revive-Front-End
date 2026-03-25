// src/pages/Home/Sections/AboutUs.jsx
const AboutUs = () => {
  return (
    <section className="mt-10 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-(--color-green) mb-15 md:mb-30">
          About Us
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative flex justify-center lg:justify-start order-1">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img
                src="/images/fryingpan.png"
                alt="Cooking pan with flying ingredients"
                className="
                  w-full h-auto 
                  object-cover 
                  transform hover:scale-105 transition-transform duration-500
                  animate-float-medium
                "
              />
            </div>
          </div>

          <div className="text-center lg:text-left order-2">
            <p className="text-xl md:text-2xl font-semibold text-gray-800 ">
              Delicious-Healthy Food
            </p>

            <img
              src="/images/Design3Green.png"
              alt="herbs"
              className=" object-contain "
            />

            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Our company is engaged in the delivery of healthy and tasty food
              around the city. Special cooking and delivery technologies allow
              you to buy fresh and healthy food.
            </p>

            <p className="mt-6 text-base md:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Experienced chefs and professional couriers will provide you with
              a nutritious meal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
