// components/customize/SectionWrapper.jsx

const SectionWrapper = ({ title, children }) => {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default SectionWrapper;
