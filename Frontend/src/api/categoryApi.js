import apiClient from './apiClient';

export const getCategories = async (params = {}) => {
  const response = await apiClient.get('/categories/', { params });
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await apiClient.get(`/categories/${slug}/`);
  return response.data;
};
