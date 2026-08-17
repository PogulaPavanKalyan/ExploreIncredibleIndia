import apiClient from './apiClient';

export const getReviews = async (params = {}) => {
  const response = await apiClient.get('/reviews/', { params });
  return response.data;
};

export const submitReview = async (reviewData) => {
  const response = await apiClient.post('/reviews/', reviewData);
  return response.data;
};
