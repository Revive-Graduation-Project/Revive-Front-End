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
    <section className="features py-20">
      <h2 className="text-center text-5xl font-bold mb-10">How It Works</h2>
      <div className="container mx-auto flex flex-wrap justify-center gap-16">
        {features.map((feature, i) => (
          <div
            key={i}
            className="text-center w-[350px] transition-transform duration-300 hover:scale-105"
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="mx-auto mb-4 w-[120px] h-[120px] object-contain"
            />
            <h3 className=" text-xl underline mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[300px] mx-auto">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
