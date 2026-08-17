import apiClient from '../api/apiClient';

export const getExperiences = async (params = {}) => {
  const response = await apiClient.get('/experiences/', { params });
  return response.data;
};

export const getExperienceBySlug = async (slug) => {
  const response = await apiClient.get(`/experiences/${slug}/`);
  return response.data;
};
