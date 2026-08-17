import apiClient from './apiClient';

export const getStates = async (params = {}) => {
  const response = await apiClient.get('/states/', { params });
  return response.data;
};

export const getStateBySlug = async (slug) => {
  const response = await apiClient.get(`/states/${slug}/`);
  return response.data;
};
