import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { toast } from "../../utils/toastUtils";
import { FiUserPlus, FiLock, FiMail, FiUser, FiBriefcase } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import { isSuperAdmin } from "../../utils/roleUtils";
import { createStaff, createAdmin } from "../../services/auth.service";
import {
  useActiveTickets,
  useUpdateChefStatus,
  useUpdateChefStation,
  useUpdateChefDisplayName,
} from "../../hooks/dashboard/useKitchenOrders";
import { ChefManagement } from "./LiveKitchen/ChefManagement";

function StaffManagementView() {
  const { user } = useAuthStore();
  const isAdmin = isSuperAdmin(user);

  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useActiveTickets();
  const { mutate: mutateChefStatus } = useUpdateChefStatus();
  const { mutate: mutateChefStation } = useUpdateChefStation();
  const { mutate: mutateChefName } = useUpdateChefDisplayName();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CHEF",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        role: isAdmin ? formData.role : "CHEF",
      };
      if (payload.role === "ADMIN") {
        await createAdmin(payload);
      } else {
        await createStaff(payload);
      }
      toast.success("Staff member created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "CHEF",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create staff member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Managers can only create CHEF (Chief). Admins can create ADMIN, MANAGER, CHEF.
  const roleOptions = isAdmin
    ? [
        { value: "CHEF", label: "Chief (Chef)" },
        { value: "MANAGER", label: "Manager" },
        { value: "ADMIN", label: "Admin" },
      ]
    : [{ value: "CHEF", label: "Chief (Chef)" }];

  return (
    <div>
      <DashboardHeader title="Staff Management" />

      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1200px] mx-auto flex flex-col gap-10">
        <div className="max-w-[800px] mx-auto w-full flex flex-col gap-10">
          <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <FiUserPlus size={32} className="text-orange-500" />
          </div>
          <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-2">Create New Staff</h2>
          <p className="text-[13px] text-gray-500 max-w-[500px] leading-relaxed">
            Add new members to your team. Depending on your role, you can assign different privileges.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-8 sm:p-10 shadow-sm border border-[#A8B89E]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#1a1a1a]">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-[14px] transition-all"
                    placeholder="e.g. Gordon"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#1a1a1a]">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-[14px] transition-all"
                    placeholder="e.g. Ramsay"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#1a1a1a]">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-[14px] transition-all"
                  placeholder="gordon@revive.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#1a1a1a]">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-[14px] transition-all"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#1a1a1a]">Role</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-[14px] bg-white appearance-none cursor-pointer transition-all"
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full py-3.5 rounded-2xl bg-[#F97316] text-white border-none font-bold text-[15px] cursor-pointer shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION: Chef Management
        ═══════════════════════════════════════════════════════ */}
        <ChefManagement
          tickets={tickets}
          isLoading={ticketsLoading}
          error={ticketsError}
          onUpdateStatus={mutateChefStatus}
          onUpdateStation={mutateChefStation}
          onUpdateName={mutateChefName}
        />
      </div>
    </div>
  );
}

export default StaffManagementView;
