import { FiMail, FiUser, FiPhone } from "react-icons/fi";
import FormInput from "../../ui/FormInput";

const CustomerDetails = ({ register, errors }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiUser className="text-orange-500" />
        Customer details
      </h2>
      
      <div className="space-y-4">
        {/* Email */}
        <FormInput
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          icon={FiMail}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* First and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First name"
            id="firstName"
            placeholder="First name"
            icon={FiUser}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          
          <FormInput
            label="Last name"
            id="lastName"
            placeholder="Last name"
            icon={FiUser}
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        {/* Phone */}
        <FormInput
          label="Phone"
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          icon={FiPhone}
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
    </div>
  );
};

export default CustomerDetails;
