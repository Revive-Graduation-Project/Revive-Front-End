// src/pages/Home/Sections/Testimonials.jsx
const Testimonials = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 ">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say About Us
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
              The Most Popular Customer Say About Our Restaurant And Our Group.
            </p>
          </div>

          <div className="relative max-w-lg lg:max-w-none mx-auto lg:mx-0">
            <div className="bg-[#F2A4A4] rounded-3xl p-8 md:p-10 lg:p-12 shadow-xl border border-pink-100 relative">
              <div className="absolute -top-8 left-6 md:left-10 text-gray-900 text-8xl md:text-9xl font-serif leading-none">
                ”
              </div>

              <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-8 pl-4 md:pl-6">
                Our company is in the delivery of healthy and tasty food the
                city. Special cooking and delivery technologies allow you to buy
                fresh and healthy food. Experienced chefs and will provide you
                with a nutritious meal.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
                  <img
                    src="/public/images/John Doe.png"
                    alt="John Doe"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-lg md:text-xl">
                    John Doe
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    Food Enthusiast
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
