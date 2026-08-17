import apiClient from '../api/apiClient';

export const getRestaurants = async (params = {}) => {
  try {
    const response = await apiClient.get('/restaurants/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return { success: false, data: [] };
  }
};
