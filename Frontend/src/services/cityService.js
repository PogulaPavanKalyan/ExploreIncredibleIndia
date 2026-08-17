import apiClient from '../api/apiClient';

export const getCities = async (params = {}) => {
  const response = await apiClient.get('/cities/', { params });
  return response.data;
};

export const getCityBySlug = async (slug) => {
  const response = await apiClient.get(`/cities/${slug}/`);
  return response.data;
};
