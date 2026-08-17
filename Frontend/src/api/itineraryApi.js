import apiClient from './apiClient';

export const getItineraries = async (params = {}) => {
  const response = await apiClient.get('/itineraries/', { params });
  return response.data;
};

export const getItineraryBySlug = async (slug) => {
  const response = await apiClient.get(`/itineraries/${slug}/`);
  return response.data;
};

export const createItinerary = async (itineraryData) => {
  const response = await apiClient.post('/itineraries/', itineraryData);
  return response.data;
};
