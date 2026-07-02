const CardPreview = ({ cardNumber, cardName, expiryDate }) => {
  return (
    <div className="h-32 bg-gray-900 rounded-xl mb-6 relative overflow-hidden group">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      
      <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
          <div className="flex justify-between items-start">
              <span className="text-xs font-mono uppercase tracking-widest opacity-70">Credit Card</span>
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6M22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6M22 6H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
          <div className="space-y-1">
              <p className="font-mono text-xl tracking-wider text-shadow-sm">
                  {cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between items-end text-xs opacity-80 font-mono">
                  <span>{cardName || "YOUR NAME"}</span>
                  <span>{expiryDate || "MM/YY"}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default CardPreview;
