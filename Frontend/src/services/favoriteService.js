import apiClient from '../api/apiClient';

export const getFavorites = async () => {
  try {
    const response = await apiClient.get('/favorites/');
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return { success: false, data: [] };
  }
};

export const addFavorite = async (destinationId) => {
  try {
    const response = await apiClient.post('/favorites/', { destination: destinationId });
    return response.data;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return { success: false };
  }
};

export const deleteFavorite = async (id) => {
  try {
    const response = await apiClient.delete(`/favorites/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return { success: false };
  }
};
