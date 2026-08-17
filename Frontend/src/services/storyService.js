import apiClient from '../api/apiClient';

export const getStories = async (params = {}) => {
  try {
    const response = await apiClient.get('/travel-guides/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching travel stories:", error);
    return { success: false, data: [] };
  }
};

export const getStoryBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/travel-guides/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${slug}:`, error);
    return { success: false, data: null };
  }
};
