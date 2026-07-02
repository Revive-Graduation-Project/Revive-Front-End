export default function LandingSection() {
  return (
    <section
      className="relative bg-cover bg-center flex items-center"
      style={{
        backgroundImage: "url('/main_image.jpg')",
      }}
    >
      <div className="relative max-w-4xl px-6 md:px-16 py-32 md:py-48 mt-14 md:mt-16">
        <h1
          className="
            font-bold leading-tight tracking-tight 
            text-white lg:text-black     
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
          "
        >
          <span className="text-orange block">
            Healthy Food
            <br />
            Comes From
          </span>
          <span className="text-green block mt-4">
            Healthy <br />
            Ingredients
          </span>
        </h1>
      </div>
    </section>
  );
}
