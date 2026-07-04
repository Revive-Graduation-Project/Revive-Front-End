const BRAND_LABELS = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
  unknown: "",
};

/**
 * CardPreview
 *
 * NOTE: Stripe's split Elements (CardNumberElement / CardExpiryElement)
 * run in sandboxed iframes and never expose the actual digits being
 * typed to our JS — that's intentional, it's what keeps this PCI-scope
 * free. So this preview can't mirror the literal number/expiry like a
 * plain-input mock would. Instead it shows what Stripe *does* give us:
 * detected card brand, and a live "focused section" glow — plus the
 * cardholder name, which is a normal (non-Stripe) text input and safe
 * to read directly.
 */
const CardPreview = ({ cardName, brand = "unknown", focusedField, isComplete }) => {
  const brandLabel = BRAND_LABELS[brand] || "";

  const glow = (field) =>
    focusedField === field
      ? "ring-2 ring-orange-400/60 bg-white/5"
      : "";

  return (
    <div className="h-32 bg-gray-900 rounded-xl mb-6 relative overflow-hidden group">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl transition-opacity duration-500 group-hover:opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

      <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
        <div className="flex justify-between items-start">
          <span className="text-xs font-mono uppercase tracking-widest opacity-70">
            Credit Card
          </span>

          <div className="flex items-center gap-2">
            {isComplete && (
              <svg
                className="w-4 h-4 text-orange-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="Card details complete"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {brandLabel ? (
              <span className="text-xs font-semibold tracking-wide opacity-90">
                {brandLabel}
              </span>
            ) : (
              <svg
                className="w-8 h-8 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6M22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6M22 6H2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 10H22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p
            className={`font-mono text-xl tracking-wider rounded px-1 -mx-1 transition-all duration-200 ${glow(
              "cardNumber"
            )}`}
          >
            •••• •••• •••• ••••
          </p>
          <div className="flex justify-between items-end text-xs opacity-80 font-mono">
            <span
              className={`truncate max-w-[60%] rounded px-1 -mx-1 transition-all duration-200 ${glow(
                "cardName"
              )}`}
            >
              {cardName ? cardName.toUpperCase() : "YOUR NAME"}
            </span>
            <span
              className={`rounded px-1 -mx-1 transition-all duration-200 ${glow(
                "cardExpiry"
              )}`}
            >
              MM/YY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;