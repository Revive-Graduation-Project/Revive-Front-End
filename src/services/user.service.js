import { api } from './api';

const BASE_URL = '/api/clients/profile';

// Get all profiles (ADMIN only — requires X-User-Role header set to ADMIN)
export const getAllProfiles = () => {
  return api.get(BASE_URL);
};

// Get a specific user's profile
export const getProfile = (userId) => {
  return api.get(`${BASE_URL}/${userId}`);
};

// Update a specific user's profile
export const updateProfile = (userId, data) => {
  return api.put(`${BASE_URL}/${userId}`, data);
};

// Delete a specific user's profile
export const deleteProfile = (userId) => {
  return api.delete(`${BASE_URL}/${userId}`);
};

// Upload/update profile picture (multipart/form-data)
export const uploadProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.patch(`${BASE_URL}/${userId}/picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Delete profile picture
export const deleteProfilePicture = (userId) => {
  return api.delete(`${BASE_URL}/${userId}/picture`);
};