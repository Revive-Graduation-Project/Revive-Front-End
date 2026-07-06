import FormInput from "../../ui/FormInput";

const CardInputs = ({ register, errors, setValue, onFormatCardNumber, onFormatExpiry }) => {
  return (
    <div className="space-y-4">
      <FormInput
        label="Card number"
        id="cardNumber"
        placeholder="0000 0000 0000 0000"
        maxLength={19}
        className="rounded-lg"
        error={errors.cardNumber?.message}
        {...register("cardNumber", {
          onChange: (e) => {
            const formatted = onFormatCardNumber(e.target.value);
            setValue("cardNumber", formatted);
          }
        })}
      />

      <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Expiry date"
            id="expiryDate"
            placeholder="MM/YY"
            maxLength={5}
            error={errors.expiryDate?.message}
            {...register("expiryDate", {
              onChange: (e) => {
                const formatted = onFormatExpiry(e.target.value);
                setValue("expiryDate", formatted);
              }
            })}
          />
          <FormInput
            label="CVV"
            id="cvv"
            placeholder="123"
            type="text" 
            inputMode="numeric"
            maxLength={3}
            error={errors.cvv?.message}
            {...register("cvv", {
              onChange: (e) => {
                // Strictly numeric
                const clean = e.target.value.replace(/\D/g, "").slice(0, 4);
                setValue("cvv", clean);
              }
            })}
          />
      </div>

      <FormInput
        label="Card name (Option)"
        id="cardName"
        placeholder="Enter card name"
        error={errors.cardName?.message}
        {...register("cardName")}
      />
    </div>
  );
};

export default CardInputs;
