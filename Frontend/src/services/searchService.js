import apiClient from '../api/apiClient';

export const globalSearch = async (query) => {
  try {
    const response = await apiClient.get('/search/', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error("Global search API error:", error);
    return { success: false, data: { destinations: [], cities: [], states: [], categories: [] } };
  }
};
