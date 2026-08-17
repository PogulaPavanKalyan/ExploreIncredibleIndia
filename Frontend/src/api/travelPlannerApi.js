import apiClient from './apiClient';

export const generateAITravelPlan = async (plannerParams) => {
  const response = await apiClient.post('/travel-planner/generate/', plannerParams);
  return response.data;
};
