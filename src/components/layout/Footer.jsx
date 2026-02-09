// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 md:py-16 px-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div>
            <img src="/public/Revive.svg" alt="logo" />
            <p
              className="text-white
             my-6"
            >
              The best food technology is now a reality. Special cooking fresh
              and healthy food. Experienced chefs and professional couriers
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">LOCATION</h4>
            <p
              className="text-white
             my-6"
            >
              Moonshine st.14/15 Light City 3450.Neverland
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">CONTACT</h4>
            <p
              className="text-white
             my-6"
            >
              011240402055 <br />
              055311152
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">DELIVARY AREA</h4>
            <p
              className="text-white
             my-6"
            >
              Cairo Govarnimate <br />
              Giza Govarnimate
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Balali.All right reserved . theme by
          skimis
        </div>
      </div>
    </footer>
  );
};

export default Footer;
