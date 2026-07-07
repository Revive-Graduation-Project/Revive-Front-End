import React, { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import InfoGrid from "./components/InfoGrid";
import HealthForm from "./components/HealthForm";
import { useProfileStore } from "../../store";
import { toast } from "sonner";

export default function Profile() {
  const user = useProfileStore((s) => s.user);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const updateHealth = useProfileStore((s) => s.updateHealth);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <ProfileHeader onEdit={() => setEditing(true)} />

      <hr className="my-6" />

      {!editing ? (
        <div>
          <InfoGrid user={user} />
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
    </div>
  );
}
