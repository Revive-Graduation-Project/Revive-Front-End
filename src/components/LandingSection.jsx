
export default function LandingSection() {
  return (
    <section
      className="relative bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url('/main_image.jpg')`,
        width: "100%",
        height: "826px",
      }}
    >
      <div className="absolute top-[350px] left-[116px] max-w-[740px] flex flex-col gap-16">
        <h1 className="text-[4.5rem] md:text-[4.5rem] font-bold leading-[1.1] tracking-tight">
          <span className="text-orange">
            Healthy Food
            <br />
            Comes From
          </span>
          <span className="text-green block mt-15">Healthy Ingredients</span>
        </h1>
      </div>
    </section>
  );
}
