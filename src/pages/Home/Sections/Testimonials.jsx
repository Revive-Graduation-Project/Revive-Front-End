// src/pages/Home/Sections/Testimonials.jsx

import { useState } from "react";

const testimonials = [
  {
    name: "John Doe",
    role: "Fitness Enthusiast",
    review:
      "These meals are a game-changer! Fresh, tasty, and perfectly portioned for my daily routine. Highly recommended!",
    image: "/images/John Doe.png",
  },
  {
    name: "Ahmed Khaled",
    role: "Busy Professional",
    review:
      "I love how convenient it is to have healthy meals delivered to my office. The quality and taste never disappoint.",
    image: "/images/Ahmed.jpg",
  },
  {
    name: "Lina Hassan",
    role: "Nutritionist",
    review:
      "The meal plans are thoughtfully designed with balanced nutrition. My clients love the variety and flavors. i will recommend it to all my clients",
    image: "/images/lina.jpg",
  },
  {
    name: "Mark Peterson",
    role: "Gym Trainer",
    review:
      "Excellent service and amazing taste! These meals make it easy to stick to my fitness goals without compromising on flavor.",
    image: "/images/mark.jpg",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1,
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const current = testimonials[currentIndex];

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
                {current.review}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-lg md:text-xl">
                    {current.name}
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    {current.role}
                  </p>
                </div>
              </div>
            </div>
            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 cursor-pointer"
            >
              ←
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
