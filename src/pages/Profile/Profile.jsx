import React, { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import InfoGrid from "./components/InfoGrid";
import HealthForm from "./components/HealthForm";
import { useProfileStore } from "../../store";
import { toast } from "sonner";

export default function Profile() {
  const user = useProfileStore((s) => s.user);
  const updateUserProfile = useProfileStore((s) => s.updateUserProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";

  return (
    <div>
      <ProfileHeader joinDate={joinDate} onEdit={() => setEditing(true)} />

      <hr className="my-6" />

      {!editing ? (
        <div>
          {/* Passing user as both since the Swagger shows a flat object */}
          <InfoGrid user={user} profile={user || {}} />
        </div>
      ) : (
        <HealthForm
          initial={{ ...(user || {}) }}
          onCancel={() => setEditing(false)}
          onSave={async (form) => {
            if (!user?.id) {
              toast.error("User ID is missing from profile.");
              return;
            }

            setSaving(true);
            try {
              // Using user.id directly from the profile store
              const updated = await updateUserProfile(user.id, form);
              
              if (!updated) throw new Error("Failed to update profile. Please try again.");
              
              toast.success("Profile updated successfully.");
              setEditing(false);
            } catch (err) {
              toast.error(err?.message || "Failed to update user profile. Please try again.");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
    </div>
  );
}