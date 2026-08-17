import apiClient from '../api/apiClient';

export const getDestinations = async (params = {}) => {
  const response = await apiClient.get('/places/', { params });
  return response.data;
};

export const getDestinationBySlug = async (slug) => {
  const response = await apiClient.get(`/places/${slug}/`);
  return response.data;
};

export const getDestinationsByState = async (stateSlug, params = {}) => {
  const response = await apiClient.get('/places/', { params: { ...params, state: stateSlug } });
  return response.data;
};

export const getDestinationsByCategory = async (categorySlug, params = {}) => {
  const response = await apiClient.get('/places/', { params: { ...params, category: categorySlug } });
  return response.data;
};

export const searchDestinations = async (query) => {
  const response = await apiClient.get('/search/', { params: { q: query } });
  return response.data;
};
