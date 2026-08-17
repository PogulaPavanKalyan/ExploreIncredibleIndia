// Category-Based Visual Theme System for Indian Destinations

export const CATEGORY_THEMES = {
  'hill-stations': {
    name: 'Hill Station / Mountains',
    primaryColor: '#059669', // Emerald Green
    secondaryColor: '#0284C7', // Sky Blue
    accentColor: '#10B981',
    gradientBg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-emerald',
    modelType: 'mountain',
    tags: ['Mountains', 'Cool Climate', 'Coffee Plantations', 'Valleys', 'Scenic Viewpoints'],
    seasonMonths: { Oct: 'good', Nov: 'best', Dec: 'best', Jan: 'best', Feb: 'best', Mar: 'good' }
  },
  'beaches': {
    name: 'Beach & Coastal',
    primaryColor: '#0EA5E9', // Ocean Blue
    secondaryColor: '#06B6D4', // Cyan
    accentColor: '#F59E0B', // Sunset Amber
    gradientBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-ocean',
    modelType: 'wave',
    tags: ['Golden Sand', 'Palm Trees', 'Water Sports', 'Sunset Views', 'Coastal Cuisine'],
    seasonMonths: { Nov: 'best', Dec: 'best', Jan: 'best', Feb: 'best', Mar: 'good', Apr: 'fair' }
  },
  'temples': {
    name: 'Temples & Spiritual',
    primaryColor: '#D97706', // Saffron Gold
    secondaryColor: '#B45309',
    accentColor: '#F59E0B',
    gradientBg: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-gold',
    modelType: 'temple',
    tags: ['Sacred Heritage', 'Ancient Architecture', 'Spiritual Peace', 'Rituals'],
    seasonMonths: { Oct: 'best', Nov: 'best', Dec: 'best', Jan: 'best', Feb: 'best', Mar: 'good' }
  },
  'forts': {
    name: 'Forts & Royal Heritage',
    primaryColor: '#B45309', // Terracotta Warm Amber
    secondaryColor: '#78350F',
    accentColor: '#F59E0B',
    gradientBg: 'linear-gradient(135deg, rgba(180, 83, 9, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-amber',
    modelType: 'fort',
    tags: ['Royal Palaces', 'Historical Forts', 'Architecture', 'Courtyards', 'Museums'],
    seasonMonths: { Oct: 'best', Nov: 'best', Dec: 'best', Jan: 'best', Feb: 'best', Mar: 'good' }
  },
  'wildlife': {
    name: 'Wildlife & Nature Reserve',
    primaryColor: '#15803D', // Forest Green
    secondaryColor: '#166534',
    accentColor: '#84CC16',
    gradientBg: 'linear-gradient(135deg, rgba(21, 128, 61, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-forest',
    modelType: 'wildlife',
    tags: ['Jeep Safari', 'Flora & Fauna', 'Dense Forest', 'Bird Watching'],
    seasonMonths: { Nov: 'best', Dec: 'best', Jan: 'best', Feb: 'best', Mar: 'best', Apr: 'good' }
  },
  'waterfalls': {
    name: 'Waterfalls & Springs',
    primaryColor: '#0284C7', // Aqua Teal
    secondaryColor: '#0EA5E9',
    accentColor: '#38BDF8',
    gradientBg: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-aqua',
    modelType: 'waterfall',
    tags: ['Cascading Water', 'Mist', 'Trekking Trails', 'Natural Pools'],
    seasonMonths: { Jul: 'good', Aug: 'best', Sep: 'best', Oct: 'best', Nov: 'good', Dec: 'fair' }
  },
  'default': {
    name: 'Incredible Tourist Spot',
    primaryColor: '#FF6B35', // Primary Saffron
    secondaryColor: '#004E64',
    accentColor: '#FFB703',
    gradientBg: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
    badgeClass: 'badge-primary',
    modelType: 'compass',
    tags: ['Culture', 'Heritage', 'Scenic Views', 'Local Gastronomy'],
    seasonMonths: { Oct: 'good', Nov: 'best', Dec: 'best', Jan: 'best', Feb: 'best', Mar: 'good' }
  }
};

export function getCategoryTheme(categoriesList = []) {
  if (!categoriesList || categoriesList.length === 0) {
    return CATEGORY_THEMES.default;
  }

  // Check categories for matched slug
  for (const cat of categoriesList) {
    const slug = (cat.slug || cat.name || '').toLowerCase();
    if (slug.includes('hill') || slug.includes('mountain') || slug.includes('valley')) {
      return CATEGORY_THEMES['hill-stations'];
    }
    if (slug.includes('beach') || slug.includes('coastal') || slug.includes('sea')) {
      return CATEGORY_THEMES.beaches;
    }
    if (slug.includes('temple') || slug.includes('spiritual') || slug.includes('pilgrim')) {
      return CATEGORY_THEMES.temples;
    }
    if (slug.includes('fort') || slug.includes('palace') || slug.includes('heritage') || slug.includes('history')) {
      return CATEGORY_THEMES.forts;
    }
    if (slug.includes('wildlife') || slug.includes('nature') || slug.includes('safari') || slug.includes('national-park')) {
      return CATEGORY_THEMES.wildlife;
    }
    if (slug.includes('waterfall') || slug.includes('lake') || slug.includes('river')) {
      return CATEGORY_THEMES.waterfalls;
    }
  }

  return CATEGORY_THEMES.default;
}
