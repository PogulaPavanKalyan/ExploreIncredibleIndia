import apiClient from '../api/apiClient';

/**
 * Fetch destinations with multi-criteria filtering, search, and pagination.
 */
export const getDestinations = async (params = {}) => {
  const response = await apiClient.get('/destinations/', { params });
  return response.data;
};

/**
 * Fetch top featured destinations for homepage and highlights.
 */
export const getFeaturedDestinations = async (limit = 12) => {
  const response = await apiClient.get('/destinations/featured/', { params: { limit } });
  return response.data;
};

/**
 * Fetch single destination complete profile by unique slug.
 */
export const getDestinationBySlug = async (slug) => {
  const response = await apiClient.get(`/destinations/${slug}/`);
  return response.data;
};

/**
 * Fetch verified videos for a destination.
 */
export const getDestinationVideos = async (slug) => {
  const response = await apiClient.get(`/destinations/${slug}/videos/`);
  return response.data;
};

/**
 * Fetch verified history and architecture details for a destination.
 */
export const getDestinationHistory = async (slug) => {
  const response = await apiClient.get(`/destinations/${slug}/history/`);
  return response.data;
};

/**
 * Fetch destinations within radius (km) using Haversine calculation.
 */
export const getNearbyDestinations = async (params = {}) => {
  const response = await apiClient.get('/destinations/nearby/', { params });
  return response.data;
};

/**
 * Fetch destinations by macro-region slug.
 */
export const getDestinationsByRegion = async (regionSlug, params = {}) => {
  const response = await apiClient.get(`/destinations/by-region/${regionSlug}/`, { params });
  return response.data;
};

/**
 * Fetch destinations by state slug.
 */
export const getDestinationsByState = async (stateSlug, params = {}) => {
  const response = await apiClient.get(`/destinations/by-state/${stateSlug}/`, { params });
  return response.data;
};

/**
 * Fetch destinations by category slug.
 */
export const getDestinationsByCategory = async (categorySlug, params = {}) => {
  const response = await apiClient.get(`/destinations/by-category/${categorySlug}/`, { params });
  return response.data;
};

/**
 * Fetch destinations by activity slug.
 */
export const getDestinationsByActivity = async (activitySlug, params = {}) => {
  const response = await apiClient.get(`/destinations/by-activity/${activitySlug}/`, { params });
  return response.data;
};

/**
 * Fetch thematic and pilgrimage collections (Jyotirlingas, Char Dham, etc.).
 */
export const getDestinationCollections = async (collectionType = '') => {
  const params = collectionType ? { type: collectionType } : {};
  const response = await apiClient.get('/destinations/collections/', { params });
  return response.data;
};

/**
 * Fetch platform-wide statistics.
 */
export const getPlatformStats = async () => {
  const response = await apiClient.get('/destinations/stats/');
  return response.data;
};

/**
 * Fetch unique list of districts for a state.
 */
export const getDistricts = async (stateSlug = '') => {
  const params = stateSlug && stateSlug !== 'all' ? { state: stateSlug } : {};
  const response = await apiClient.get('/destinations/districts/', { params });
  return response.data;
};

/**
 * Natural language intent-based destination search.
 */
export const searchDestinations = async (query, userCoords = null, extraFilters = {}) => {
  const params = { q: query, ...extraFilters };
  if (userCoords && userCoords.lat && userCoords.lng) {
    params.lat = userCoords.lat;
    params.lng = userCoords.lng;
  }
  const response = await apiClient.get('/search/', { params });
  return response.data;
};

/**
 * Live search query autocomplete suggestions.
 */
export const getSearchAutocomplete = async (query) => {
  const response = await apiClient.get('/search/autocomplete/', { params: { q: query } });
  return response.data;
};

/**
 * AI intent travel recommendations.
 */
export const getAISearchRecommendations = async (prompt, userCoords = null) => {
  const payload = { prompt };
  if (userCoords) {
    payload.lat = userCoords.lat;
    payload.lng = userCoords.lng;
  }
  const response = await apiClient.post('/search/ai-intent/', payload);
  return response.data;
};

/**
 * ADMIN API WRITE OPERATIONS (Direct Backend Database Persistence)
 */

export const createDestination = async (destinationData) => {
  const response = await apiClient.post('/destinations/', destinationData);
  return response.data;
};

export const updateDestination = async (slug, destinationData) => {
  const response = await apiClient.put(`/destinations/${slug}/`, destinationData);
  return response.data;
};

export const deleteDestination = async (slug) => {
  const response = await apiClient.delete(`/destinations/${slug}/`);
  return response.data;
};

export const createCollection = async (collectionData) => {
  const response = await apiClient.post('/collections/', collectionData);
  return response.data;
};

export const updateCollection = async (slug, collectionData) => {
  const response = await apiClient.put(`/collections/${slug}/`, collectionData);
  return response.data;
};

export const createFestival = async (festivalData) => {
  const response = await apiClient.post('/festivals/', festivalData);
  return response.data;
};

export const createStory = async (storyData) => {
  const response = await apiClient.post('/stories/', storyData);
  return response.data;
};

export default {
  getDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
  getDestinationVideos,
  getDestinationHistory,
  getNearbyDestinations,
  getDestinationsByRegion,
  getDestinationsByState,
  getDestinationsByCategory,
  getDestinationsByActivity,
  getDestinationCollections,
  getPlatformStats,
  getDistricts,
  searchDestinations,
  getSearchAutocomplete,
  getAISearchRecommendations,
  createDestination,
  updateDestination,
  deleteDestination,
  createCollection,
  updateCollection,
  createFestival,
  createStory,
};
