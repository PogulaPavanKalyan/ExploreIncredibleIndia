import apiClient from './apiClient';

export const getFavorites = async (params = {}) => {
  const response = await apiClient.get('/favorites/', { params });
  return response.data;
};

export const addFavorite = async (destinationId) => {
  const response = await apiClient.post('/favorites/', { destination: destinationId });
  return response.data;
};

export const removeFavorite = async (favoriteId) => {
  const response = await apiClient.delete(`/favorites/${favoriteId}/`);
  return response.data;
};
