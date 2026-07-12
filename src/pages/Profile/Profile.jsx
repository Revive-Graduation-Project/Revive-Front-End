import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProfileHeader from "./components/ProfileHeader";
import InfoGrid from "./components/InfoGrid";
import HealthForm from "./components/HealthForm";
import { useProfileStore } from "../../store";
import { toast } from "sonner";
import { LuCamera, LuTrash2, LuUpload } from "react-icons/lu";

export default function Profile() {
  const navigate = useNavigate();
  const user = useProfileStore((s) => s.user);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const updateHealth = useProfileStore((s) => s.updateHealth);
  const uploadProfilePicture = useProfileStore((s) => s.uploadProfilePicture);
  const deleteProfilePicture = useProfileStore((s) => s.deleteProfilePicture);
  const deleteAccount = useProfileStore((s) => s.deleteAccount);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Picture upload/delete state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [showDeletePicModal, setShowDeletePicModal] = useState(false);
  const [deletingPic, setDeletingPic] = useState(false);

  // Account deletion modal state
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const rawJoinDate =
    user?.createdAt ||
    user?.createdDate ||
    user?.joinDate ||
    user?.registrationDate ||
    new Date();

  const formattedJoinDate = new Date(rawJoinDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;
    setUploadingPic(true);
    try {
      await uploadProfilePicture(selectedFile);
      toast.success("Profile picture updated successfully.");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error(err?.message || "Failed to upload profile picture.");
    } finally {
      setUploadingPic(false);
    }
  };

  const handleDeletePicture = async () => {
    setDeletingPic(true);
    try {
      await deleteProfilePicture();
      toast.success("Profile picture removed successfully.");
      setShowDeletePicModal(false);
    } catch (err) {
      toast.error(err?.message || "Failed to remove profile picture.");
    } finally {
      setDeletingPic(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully.");
      setShowDeleteAccountModal(false);
      navigate("/auth/login");
    } catch (err) {
      toast.error(err?.message || "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div>
      <ProfileHeader
        joinDate={formattedJoinDate}
        onEdit={() => setEditing(true)}
      />

      <hr className="my-6" />

      {/* Picture Management Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : user?.profilePictureUrl || user?.avatar ? (
              <img
                src={user.profilePictureUrl || user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/avatar-placeholder.jpeg";
                }}
              />
            ) : (
              <LuCamera className="text-gray-400" size={20} />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Profile Photo</h4>
            <p className="text-xs text-gray-500">Update or remove your account photo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <LuCamera size={14} />
            <span>Choose file</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <button
              onClick={handleUploadPicture}
              disabled={uploadingPic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-xl cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <LuUpload size={14} />
              <span>{uploadingPic ? "Uploading..." : "Upload"}</span>
            </button>
          )}

          {(user?.profilePictureUrl || user?.avatar) && (
            <button
              onClick={() => setShowDeletePicModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
            >
              <LuTrash2 size={14} />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        <div>
          <InfoGrid user={user} profile={user} />
        </div>
      ) : (
        <HealthForm
          initial={user}
          onCancel={() => setEditing(false)}
          onSave={async (form) => {
            setSaving(true);
            try {
              const updated = await updateHealth(form);
              if (!updated)
                throw new Error("Failed to update profile. Please try again.");
              toast.success("Profile updated successfully.");
              setEditing(false);
            } catch (err) {
              toast.error(
                err?.message || "Failed to update profile. Please try again.",
              );
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}

      <hr className="my-8" />

      {/* Account Deletion Section */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-red-100 bg-red-50/50">
        <div>
          <h4 className="text-sm font-semibold text-red-800">Delete Account</h4>
          <p className="text-xs text-red-600">
            Permanently delete your account and all associated profile data.
          </p>
        </div>
        <button
          onClick={() => setShowDeleteAccountModal(true)}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 rounded-xl cursor-pointer hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>

      {/* Modal: Delete Profile Picture */}
      {showDeletePicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">Remove Photo</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to remove your profile picture? It will revert to the default avatar.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeletePicModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePicture}
                disabled={deletingPic}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingPic ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Account */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-700 mt-2">
              Are you sure you want to permanently delete your account? This action cannot be undone. All your profile data, order history, and rewards will be deleted.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingAccount ? "Deleting Account..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
