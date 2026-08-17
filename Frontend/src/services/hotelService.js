import apiClient from '../api/apiClient';

export const getHotels = async (params = {}) => {
  try {
    const response = await apiClient.get('/hotels/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return { success: false, data: [] };
  }
};
