import { FiStar } from "react-icons/fi";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={10}
          fill={i <= rating ? "#EAB308" : "none"}
          stroke={i <= rating ? "#EAB308" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

function CustomerReviews({ data }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-3.5">Customer Reviews</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-3xl p-5 shadow-sm flex justify-between gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            {/* Left side: Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="text-[13px] font-bold text-[#1a1a1a] m-0 mb-1.5">Customer Reviews</h4>
                <p className="text-[11px] text-gray-500 m-0 leading-relaxed line-clamp-3">
                  this pasta is my favourite dish i have ever never eat . Highly recommended for pasta levels !
                </p>
              </div>

              {/* Reviewer Footer */}
              <div className="flex items-end justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-[26px] h-[26px] rounded-full overflow-hidden shrink-0">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${review.name.replace(' ', '+')}&background=F97316&color=fff`} 
                      alt="avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#1a1a1a] m-0 leading-tight">{review.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StarRating rating={review.rating} />
                      <span className="text-[9px] font-bold text-[#1a1a1a]">{review.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-[9px] text-gray-400 text-right whitespace-nowrap">
                  <div>Oct 12 / 2026</div>
                  <div>4:25</div>
                </div>
              </div>
            </div>

            {/* Right side: Food image */}
            <div className="w-[100px] h-full rounded-[18px] overflow-hidden bg-orange-50 shrink-0 shadow-sm border border-orange-100/50">
              <img
                src={review.image}
                alt="dish"
                className="w-full h-[110px] object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReviews;
