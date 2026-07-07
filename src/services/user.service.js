import { api } from "./api";

// Get current logged-in client's profile (all profiles - admin)
export const getProfile = () => {
  return api.get("/api/clients/profile");
};

// Get specific client profile by ID
export const getProfileById = (id) => {
  return api.get(`/api/clients/profile/${id}`);
};

// Update client profile by ID
export const updateProfile = (id, data) => {
  return api.put(`/api/clients/profile/${id}`, data);
};

// Delete client profile by ID
export const deleteProfile = (id) => {
  return api.delete(`/api/clients/profile/${id}`);
};

// Upload profile picture
export const uploadProfilePicture = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.patch(`/api/clients/profile/${id}/picture`, formData);
};

// Delete profile picture
export const deleteProfilePicture = (id) => {
  return api.delete(`/api/clients/profile/${id}/picture`);
};
