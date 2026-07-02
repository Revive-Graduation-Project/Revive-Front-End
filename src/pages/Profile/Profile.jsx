import React, { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import InfoGrid from "./components/InfoGrid";
import HealthForm from "./components/HealthForm";
import { useProfileStore } from "../../store";
import { toast } from "sonner";

export default function Profile() {
  const user = useProfileStore((s) => s.user);
  const updateHealth = useProfileStore((s) => s.updateHealth);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";
  const profile = user?.profile || {};

  return (
    <div>
      <ProfileHeader joinDate={joinDate} onEdit={() => setEditing(true)} />

      <hr className="my-6" />

      {!editing ? (
        <div>
          <InfoGrid user={user} profile={profile} />
        </div>
      ) : (
        <HealthForm
          initial={{ ...profile }}
          onCancel={() => setEditing(false)}
          onSave={async (form) => {
            setSaving(true);
            try {
              const updated = await updateHealth(form);
              if (!updated) throw new Error("Failed to update user profile. Please try again.");
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
