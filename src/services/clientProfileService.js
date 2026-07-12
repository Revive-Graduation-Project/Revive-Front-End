import { api } from "./api";

/**
 * ============================================================
 * Client Profile Service (Production Ready)
 * ============================================================
 * Exposes API integration for client profile management:
 * - GET    /api/clients/profile/{id}
 * - PUT    /api/clients/profile/{id}
 * - PATCH  /api/clients/profile/{id}/picture
 * - DELETE /api/clients/profile/{id}/picture
 * - DELETE /api/clients/profile/{id}
 */

export const getProfile = (id) => {
  return api.get(`/api/clients/profile/${id}`);
};

export const updateProfile = (id, data) => {
  const payload = {
    age: data.age != null && data.age !== "" ? Number(data.age) : null,
    gender: data.gender || null,
    exercisesRegularly: Boolean(data.exercisesRegularly),
    height: data.height != null && data.height !== "" ? Number(data.height) : null,
    heightUnit: data.heightUnit || "cm",
    weight: data.weight != null && data.weight !== "" ? Number(data.weight) : null,
    weightUnit: data.weightUnit || "kg",
    goal: data.goal || null,
    healthConditions: Array.isArray(data.healthConditions) ? data.healthConditions : [],
    phoneNumber: data.phoneNumber || null,
  };
  return api.put(`/api/clients/profile/${id}`, payload);
};

export const uploadProfilePicture = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.patch(`/api/clients/profile/${id}/picture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProfilePicture = (id) => {
  return api.delete(`/api/clients/profile/${id}/picture`);
};

export const deleteProfile = (id) => {
  return api.delete(`/api/clients/profile/${id}`);
};
