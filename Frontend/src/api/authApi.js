import apiClient from './apiClient';

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login/', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register/', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get('/auth/me/');
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await apiClient.put('/auth/me/', data);
  return response.data;
};
