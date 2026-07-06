import { FiMapPin, FiFlag, FiHash } from "react-icons/fi";
import { REGIONS } from "../../../constants";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";

const DeliveryDetails = ({ register, errors }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiMapPin className="text-orange-500" />
        Delivery details
      </h2>
      
      <div className="space-y-4">
        {/* Region */}
        <FormSelect
          label="Region"
          id="region"
          error={errors.region?.message}
          {...register("region")}
        >
          <option value="">Select region</option>
          {REGIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </FormSelect>

        {/* City */}
        <FormInput
          label="City"
          id="city"
          placeholder="Enter city"
          icon={FiFlag}
          error={errors.city?.message}
          {...register("city")}
        />

        {/* Address */}
        <FormInput
          label="Address"
          id="address"
          placeholder="Enter your address"
          icon={FiMapPin}
          error={errors.address?.message}
          {...register("address")}
        />

        {/* Zip/Postal Code */}
        <FormInput
          label="Zip / Postal code"
          id="zipCode"
          placeholder="Enter zip code"
          icon={FiHash}
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />
      </div>
    </div>
  );
};

export default DeliveryDetails;
