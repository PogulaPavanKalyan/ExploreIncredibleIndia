import apiClient from '../api/apiClient';

let cachedCategories = null;

export const getCategories = async (params = {}, forceRefresh = false) => {
  if (cachedCategories && !forceRefresh && Object.keys(params).length === 0) {
    return cachedCategories;
  }
  const response = await apiClient.get('/categories/', { params });
  if (Object.keys(params).length === 0) {
    cachedCategories = response.data;
  }
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await apiClient.get(`/categories/${slug}/`);
  return response.data;
};

export const getActivities = async (params = {}) => {
  const response = await apiClient.get('/categories/activities/', { params });
  return response.data;
};

export const getTags = async (params = {}) => {
  const response = await apiClient.get('/categories/tags/', { params });
  return response.data;
};

export default {
  getCategories,
  getCategoryBySlug,
  getActivities,
  getTags,
};
