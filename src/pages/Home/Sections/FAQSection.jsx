// src/pages/Home/Sections/FAQSection.jsx
import { useState } from "react";

const faqItems = [
  {
    question: "Are these meals suitable for dieting or bodybuilding?",
    answer:
      "Yes, our meals are carefully designed to support both weight loss and muscle gain. Each meal includes balanced macronutrients with clear calorie information.",
  },
  {
    question: "Are there any additives or preservatives?",
    answer:
      "No, we use only natural ingredients. Our meals are prepared fresh daily without artificial additives or preservatives.",
  },
  {
    question: "Are the meals fresh or frozen?",
    answer:
      "The meals are prepared daily using fresh, high-quality ingredients and packed in airtight containers to preserve taste and nutritional value.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes between 30 to 45 minutes depending on your location.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      className=" relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/Frame 258 (2).png')",
      }}
    >
      <div className="absolute inset-0 " />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="  rounded-2xl  p-6 md:p-8 lg:p-10 ">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Frequently asked questions?
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-green-600 font-medium text-lg underline">
                General
              </span>
              <span>Setting up question</span>
            </div>

            <div className="space-y-4">
              {filteredFaqs.length === 0 && (
                <p className="text-gray-600 mt-4">No results found.</p>
              )}
              {filteredFaqs.map((item, index) => (
                <div
                  key={index}
                  className={` pb-4 last:border-b-0 ${
                    activeIndex === index ? " rounded-lg" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left flex justify-between items-center cursor-pointer"
                  >
                    <span
                      className={`font-medium text-lg ${
                        activeIndex === index
                          ? "text-green-700"
                          : "text-gray-800"
                      }`}
                    >
                      {item.question}
                    </span>
                    <span className="text-2xl text-gray-900">
                      {activeIndex === index ? "▲" : "▼"}
                    </span>
                  </button>

                  {activeIndex === index && item.answer && (
                    <p className="mt-3 text-gray-900 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                  <hr />
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Looking for something?"
                  className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 
                  focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200
                text-gray-700 placeholder-gray-500 bg-white/80 backdrop-blur-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex justify-center lg:justify-end">
            <div className=" w-full max-w-lg">
              <img
                src="/images/image 24.png"
                alt="Woman eating healthy salad"
                className="
                  w-full h-full object-cover
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
