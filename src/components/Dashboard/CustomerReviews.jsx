import { FiStar } from "react-icons/fi";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={12}
          fill={i <= rating ? "#F97316" : "none"}
          stroke={i <= rating ? "#F97316" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

function CustomerReviews({ data }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-3.5">Customer Reviews</h3>
      <div className="grid grid-cols-3 gap-3.5">
        {data.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-[14px] p-4 shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex flex-col gap-2.5 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] transition-shadow duration-200"
          >
            {/* Food image */}
            <div className="w-full h-[90px] rounded-[10px] overflow-hidden bg-orange-200">
              <img
                src={review.image}
                alt="dish"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>

            {/* Review text */}
            <p className="text-xs text-gray-500 m-0 leading-relaxed">{review.text}</p>

            {/* Reviewer */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a] m-0">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <span className="text-[10px] text-gray-400">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReviews;
