import apiClient from '../api/apiClient';

export const estimateTripBudget = async (params) => {
  try {
    const response = await apiClient.post('/search/budget-estimate/', params);
    return response.data;
  } catch (error) {
    console.error("Error estimating trip budget:", error);
    return { success: false };
  }
};
