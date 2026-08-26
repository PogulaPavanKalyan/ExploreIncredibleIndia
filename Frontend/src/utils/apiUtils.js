/**
 * Safely extracts an Array from any API response structure
 * (handles DRF paginated { count, results }, wrapped { data: [...] }, or raw arrays [...]).
 */
export const normalizeArrayResponse = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.results)) return res.results;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.results)) return res.data.results;
  if (Array.isArray(res.destinations)) return res.destinations;
  if (Array.isArray(res.stories)) return res.stories;
  if (Array.isArray(res.cities)) return res.cities;
  if (Array.isArray(res.states)) return res.states;
  return [];
};

/**
 * Safely extracts total item count from API response.
 */
export const normalizeCount = (res) => {
  if (!res) return 0;
  if (typeof res.count === 'number') return res.count;
  if (typeof res.pagination?.total === 'number') return res.pagination.total;
  if (typeof res.total_destinations === 'number') return res.total_destinations;
  const arr = normalizeArrayResponse(res);
  return arr.length;
};
