import api from './api';

export const getCollections = async (params = {}) => {
  try {
    const res = await api.get('/collections/', { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

export const getCollectionBySlug = async (slug) => {
  try {
    const res = await api.get(`/collections/${slug}/`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching collection '${slug}':`, error);
    throw error;
  }
};
