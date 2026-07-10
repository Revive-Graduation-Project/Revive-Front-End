import React, { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore, useProfileStore } from "../../../store";

export default function Sidebar({ links = [] }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user: authUser } = useAuthStore();
  const {
    user: profileUser,
    uploadPicture,
    deletePicture,
    fetchProfile,
  } = useProfileStore();

  const userId = authUser?.id;

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, profileUser, fetchProfile]);

  // Clean up preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ClientProfileDto has no name fields at all — identity (name) comes
  // from authUser (auth-service), not profileUser (client-service).
  const displayName =
    authUser?.name ||
    authUser?.fullName ||
    (authUser?.firstName && authUser?.lastName
      ? `${authUser.firstName} ${authUser.lastName}`
      : null) ||
    "Your Name";

  // profilePictureUrl is the real backend field name — matches
  // ClientProfileDto exactly, no renaming.
  const hasRealPicture = Boolean(profileUser?.profilePictureUrl);

  const profilePicture =
    previewUrl ||
    profileUser?.profilePictureUrl ||
    "/images/avatar-placeholder.jpeg";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const acceptedTypes = ["image/jpeg", "image/png", "image/webp" , "image/jpg"];
    if (!acceptedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only JPEG, PNG, WebP, and JPG images are allowed.",
      );
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    // Clean up any existing preview URL before creating a new one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setIsUploading(true);
    try {
      await uploadPicture(userId, file);
      toast.success("Profile picture uploaded successfully!");
      // Keep the previewUrl active so the user sees their change instantly!
      // Removed the lines that set it to null and revoked it here
    } catch (err) {
      toast.error(err?.message || "Failed to upload profile picture.");
      URL.revokeObjectURL(newPreviewUrl);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePicture = async () => {
    setIsDeleting(true);
    try {
      await deletePicture(userId);
      toast.success("Profile picture removed successfully!");
      // Clean up any preview URL before resetting state
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to remove profile picture.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <aside className="md:col-span-4">
      <div
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{ backgroundColor: "#ff9b00" }}
      >
        <div className="text-center text-white relative">
          <div className="relative  w-28 h-28 mx-auto mt-10">
            <div className="w-28 h-28 rounded-full mx-auto mt-10 overflow-hidden border-4 border-white bg-white">
              <img
                src={profilePicture}
                alt="avatar"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.src = "/images/avatar-placeholder.jpeg";
                }}
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`absolute bottom-2 right-0 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors shadow-md ${
                isUploading || isDeleting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-700 cursor-pointer"
              }`}
              title="Change picture"
              disabled={isUploading || isDeleting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            {hasRealPicture && (
              <button
                onClick={handleDeletePicture}
                className={`absolute top-2 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white transition-colors shadow-md ${
                  isDeleting || isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600 cursor-pointer"
                }`}
                title="Remove picture"
                disabled={isDeleting || isUploading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading || isDeleting}
            />
          </div>

          <h3 className="mt-6 font-semibold text-lg text-black">
            {displayName}
          </h3>

          {(isUploading || isDeleting) && (
            <p className="text-xs text-white/80 mt-1">
              {isUploading ? "Uploading..." : "Removing..."}
            </p>
          )}
        </div>

        <div className="p-6 bg-transparent text-black">
          <ul className="space-y-4">
            {links.map((item, idx) => {
              const isLogout =
                item.to === "/auth/logout" ||
                item.label?.toLowerCase?.() === "log out";
              return (
                <li key={item.to || idx} className={`flex items-center gap-3`}>
                  {item.icon ? <span>{item.icon}</span> : null}
                  {isLogout ? (
                    <LogoutButton label={item.label} />
                  ) : item.to ? (
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        ` ${isActive ? "font-semibold text-green-700" : "text-black hover:text-gray-700 transition-colors"}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <span className="text-black">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function LogoutButton({ label = "Log out" }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-black cursor-pointer hover:text-gray-700 transition-colors"
    >
      {label}
    </button>
  );
}
