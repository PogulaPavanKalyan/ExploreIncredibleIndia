import apiClient from '../api/apiClient';

let cachedRegions = null;

export const getRegions = async (forceRefresh = false) => {
  if (cachedRegions && !forceRefresh) {
    return cachedRegions;
  }
  try {
    const response = await apiClient.get('/regions/');
    cachedRegions = response.data;
    return cachedRegions;
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

export default {
  getRegions,
  getRegionBySlug,
};
