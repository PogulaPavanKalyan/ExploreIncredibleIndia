import api from './api';

export const planTrip = async (plannerParams) => {
  try {
    const res = await api.post('/travel-planner/plan/', plannerParams);
    return res.data;
  } catch (error) {
    console.error('Error planning trip with AI engine:', error);
    throw error;
  }
};
