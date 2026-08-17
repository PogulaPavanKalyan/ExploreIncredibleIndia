import apiClient from '../api/apiClient';

export const getFestivals = async (params = {}) => {
  try {
    const response = await apiClient.get('/festivals/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching festivals:", error);
    return { success: false, data: [] };
  }
};
