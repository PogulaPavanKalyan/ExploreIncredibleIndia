import apiClient from '../api/apiClient';

export const getStates = async (params = {}) => {
  const response = await apiClient.get('/states/', { params });
  return response.data;
};

export const getStateBySlug = async (slug) => {
  const response = await apiClient.get(`/states/${slug}/`);
  return response.data;
};

export const getDistrictsByState = async (stateSlug) => {
  const response = await apiClient.get(`/states/${stateSlug}/districts/`);
  return response.data;
};

export const getCitiesByState = async (stateSlug) => {
  const response = await apiClient.get(`/states/${stateSlug}/cities/`);
  return response.data;
};

export default {
  getStates,
  getStateBySlug,
  getDistrictsByState,
  getCitiesByState,
};
