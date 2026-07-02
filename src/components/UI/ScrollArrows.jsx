const ScrollArrows = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft = true,
  canScrollRight = true,
}) => {
  return (
    <>
      <button
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="
          hidden md:block
          cursor-pointer
          absolute -left-8 lg:-left-12 top-1/2 -translate-y-1/2 z-10
          text-green-700 text-5xl font-bold
          hover:scale-110 transition
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
        "
      >
        ‹
      </button>

      <button
        onClick={onScrollRight}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="
          hidden md:block
          cursor-pointer
          absolute -right-8 lg:-right-12 top-1/2 -translate-y-1/2 z-10
          text-green-700 text-5xl font-bold
          hover:scale-110 transition
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
        "
      >
        ›
      </button>
    </>
  );
};

export default ScrollArrows;
