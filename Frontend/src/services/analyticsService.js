const STORAGE_KEY = 'app_analytics_data';

const DEFAULT_ANALYTICS = {
  totalPageViews: 1420,
  activeSessions: 38,
  itinerariesGenerated: 145,
  topDestinations: [
    { name: 'Araku Valley', count: 340, state: 'Andhra Pradesh' },
    { name: 'Taj Mahal', count: 290, state: 'Uttar Pradesh' },
    { name: 'Alleppey Backwaters', count: 210, state: 'Kerala' },
    { name: 'Jaipur City Palace', count: 180, state: 'Rajasthan' },
    { name: 'Varanasi Ghats', count: 150, state: 'Uttar Pradesh' }
  ],
  popularSearches: ['Hill Stations', 'Kerala Houseboats', 'Vistadome Train', 'Heritage Forts']
};

export function getAnalyticsData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ANALYTICS;
  } catch {
    return DEFAULT_ANALYTICS;
  }
}

function saveAnalyticsData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Could not save analytics data:", err);
  }
}

export function trackPageView(pathname) {
  const data = getAnalyticsData();
  data.totalPageViews = (data.totalPageViews || 0) + 1;
  saveAnalyticsData(data);
  console.info(`[Analytics] Tracked page view: ${pathname} (Total: ${data.totalPageViews})`);
}

export function trackDestinationView(destinationName, stateName) {
  const data = getAnalyticsData();
  const existing = data.topDestinations.find(d => d.name === destinationName);
  if (existing) {
    existing.count += 1;
  } else {
    data.topDestinations.push({ name: destinationName, count: 1, state: stateName || 'India' });
  }
  data.topDestinations.sort((a, b) => b.count - a.count);
  saveAnalyticsData(data);
}

export function trackItineraryGenerated() {
  const data = getAnalyticsData();
  data.itinerariesGenerated = (data.itinerariesGenerated || 0) + 1;
  saveAnalyticsData(data);
}
