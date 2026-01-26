export default function FeaturesSection() {
  const features = [
    {
      img: "/Features_one.png",
      title: "Choose Your Favorite",
      text: "Choose your favorite meals and order online or by phone. It's easy to customize your order.",
    },
    {
      img: "/Features_two.png",
      title: "We Deliver Your Meals",
      text: "We prepared and delivered meals arrive at your door. ",
    },
    {
      img: "/Features_three.png",
      title: "Eat And Enjoy",
      text: "No shooping, no cooking, no counting and no cleaning. Enjoy your healthy meals with your family",
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-center text-3xl lg:text-5xl font-bold mb-10">
        How It Works
      </h2>
      <div className="max-w-6xl mx-auto items-center gap-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="text-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="mx-auto mb-4 w-24 h-24 sm:w-30 sm:h-30 object-contain"
            />
            <h3 className=" text-lg md:text-xl underline mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
