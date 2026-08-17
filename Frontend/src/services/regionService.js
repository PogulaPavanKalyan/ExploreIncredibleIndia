import apiClient from '../api/apiClient';

export const getRegions = async () => {
  try {
    const response = await apiClient.get('/regions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getRegionBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/regions/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching region ${slug}:`, error);
    throw error;
  }
};
