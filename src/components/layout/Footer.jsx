// src/components/layout/Footer.jsx

import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="container flex-col mx-auto max-w-6xl px-4 items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 text-center  ">
          <div className="hidden md:block">
            <img src="/Revive.svg" alt="logo" />
            <p className="text-white my-3 text-left ">
              The best food technology is now a reality. Special cooking fresh
              and healthy food. Experienced chefs and professional couriers
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">LOCATION</h4>
            <p
              className="text-white
             my-3"
            >
              Moonshine st.14/15 Light City 3450.Neverland
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">CONTACT</h4>
            <div className="my-3">
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <FiPhone className="text-orange-500" />
                <span>011240402055</span>
              </div>
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <FiPhone className="text-orange-500" />
                <span>055311152</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">DELIVARY AREA</h4>
            <p
              className="text-white
             my-3"
            >
              Cairo Govarnimate <br />
              Giza Govarnimate
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-5">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer">
            <FaFacebookF className="text-black text-sm" />
          </div>

          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer">
            <FaTwitter className="text-black text-sm" />
          </div>

          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer">
            <FaInstagram className="text-black text-sm" />
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
