export const RANKS = [
  { level: 1, title: 'Rookie Explorer', minPts: 0, maxPts: 200, icon: '🥉', badgeColor: '#94A3B8' },
  { level: 2, title: 'State Traveler', minPts: 200, maxPts: 500, icon: '🥈', badgeColor: '#0284C7' },
  { level: 3, title: 'Heritage Master', minPts: 500, maxPts: 1000, icon: '🥇', badgeColor: '#D97706' },
  { level: 4, title: 'Incredible India Legend', minPts: 1000, maxPts: 99999, icon: '💎', badgeColor: '#8B5CF6' }
];

export const BADGES = [
  { id: 'fort_explorer', name: 'Fort Explorer', description: 'Explored 3+ Heritage Forts & Monuments', icon: '🏰', unlocked: true },
  { id: 'spiritual_seeker', name: 'Spiritual Seeker', description: 'Visited 3+ Sacred Temples & Sanctuaries', icon: '🛕', unlocked: true },
  { id: 'coffee_connoisseur', name: 'Coffee Connoisseur', description: 'Explored Araku Valley Coffee Farms', icon: '☕', unlocked: true },
  { id: 'coastal_explorer', name: 'Coastal Explorer', description: 'Discovered Pristine Beaches of Goa & Kerala', icon: '🌴', unlocked: false },
  { id: 'top_reviewer', name: 'Top Reviewer', description: 'Wrote 3+ Detailed Traveler Reviews', icon: '📝', unlocked: false }
];

export function calculateGamification(favoritesCount = 0, reviewsCount = 0, itinerariesCount = 0) {
  const points = (favoritesCount * 50) + (reviewsCount * 100) + (itinerariesCount * 150) + 250; // 250 welcome bonus

  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (points >= RANKS[i].minPts) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || RANKS[i];
    }
  }

  const range = nextRank.minPts - currentRank.minPts;
  const currentProgress = points - currentRank.minPts;
  const progressPercent = currentRank.level === 4 ? 100 : Math.min(100, Math.round((currentProgress / (range || 1)) * 100));

  return {
    points,
    rank: currentRank,
    nextRank,
    progressPercent,
    badges: BADGES
  };
}
