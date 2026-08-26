import apiClient from '../api/apiClient';

/**
 * Fallback static stories to ensure 100% continuous uptime and visual richness
 */
export const FALLBACK_STORIES = [
  {
    id: 1,
    title: 'The Living Roots of Meghalaya',
    slug: 'living-roots-meghalaya',
    category: 'hidden',
    category_label: 'Hidden India',
    location: 'Nongriat, Meghalaya',
    state_name: 'Meghalaya',
    short_description: 'Discover the remarkable bio-engineered living root bridges handcrafted across rushing rainforest rivers by generations of indigenous Khasi tribes.',
    content: 'Deep within the sub-tropical rainforests of Meghalaya lies one of humanity’s most extraordinary collaborations with nature: the Living Root Bridges...',
    cover_image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200',
    author: 'Dr. Aranya Sen',
    author_role: 'Ethno-Botanist & Explorer',
    read_time: '6 min read',
    is_featured: true,
    likes_count: 842,
    views_count: 3410
  },
  {
    id: 2,
    title: 'Echoes of Royalty in Jaisalmer’s Golden Fortress',
    slug: 'royalty-jaisalmer-golden-fortress',
    category: 'heritage',
    category_label: 'Royal India',
    location: 'Jaisalmer, Rajasthan',
    state_name: 'Rajasthan',
    short_description: 'Stepping inside the world’s only living desert fort, where Rajput chivalry and golden sandstone havelis rise from the Thar Desert dunes.',
    content: 'As the desert sun dips beneath the horizon of the Great Thar Desert, Sonar Qila (The Golden Fort) of Jaisalmer glows like a mirage made of molten gold...',
    cover_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200',
    author: 'Mahaveer Rathore',
    author_role: 'Cultural Historian',
    read_time: '5 min read',
    is_featured: false,
    likes_count: 612,
    views_count: 2180
  },
  {
    id: 3,
    title: 'Dev Deepawali: When the Gods Descend Upon Varanasi Ghats',
    slug: 'dev-deepawali-varanasi-ghats',
    category: 'spiritual',
    category_label: 'Sacred India',
    location: 'Varanasi, Uttar Pradesh',
    state_name: 'Uttar Pradesh',
    short_description: 'Witnessing one million earthen oil lamps transform the eternal Ganga ghats into a glittering celestial amphitheater.',
    content: 'On the full moon night of Kartik Purnima, exactly fifteen days after Diwali, the sacred city of Varanasi undergoes a divine transformation...',
    cover_image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200',
    author: 'Kalyani Bhattacharya',
    author_role: 'Spiritual Chronicler',
    read_time: '5 min read',
    is_featured: false,
    likes_count: 789,
    views_count: 2940
  },
  {
    id: 4,
    title: 'In the Shadow of the Royal Bengal Tiger in Ranthambore',
    slug: 'shadow-royal-bengal-tiger-ranthambore',
    category: 'wildlife',
    category_label: 'Wild India',
    location: 'Ranthambore, Rajasthan',
    state_name: 'Rajasthan',
    short_description: 'Tracking the majestic apex predator through ancient ruins, banyan forests, and crocodile-filled lakes in Rajasthan’s wild frontier.',
    content: 'The early morning mist rises off Padam Talao lake in Ranthambore National Park...',
    cover_image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200',
    author: 'Kabir Mathur',
    author_role: 'Wildlife Biologist & Tracker',
    read_time: '4 min read',
    is_featured: false,
    likes_count: 930,
    views_count: 3120
  },
  {
    id: 5,
    title: 'Monasteries and Moonscapes: Across the High Passes of Ladakh',
    slug: 'monasteries-moonscapes-high-passes-ladakh',
    category: 'mountain',
    category_label: 'Mountain India',
    location: 'Leh & Nubra Valley, Ladakh',
    state_name: 'Ladakh',
    short_description: 'Traversing snow-dusted Himalayan switchbacks to discover thousand-year-old Buddhist gompas perched on dramatic cliffs.',
    content: 'Ladakh — the Land of High Passes — sits elevated above 3,500 meters between the Karakoram and Great Himalayan ranges...',
    cover_image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200',
    author: 'Tenzin Norbu',
    author_role: 'Himalayan Mountaineer',
    read_time: '6 min read',
    is_featured: false,
    likes_count: 654,
    views_count: 2490
  },
  {
    id: 6,
    title: 'A Spice Trail Through Chettinad Mansions and Araku Coffee Valleys',
    slug: 'spice-trail-chettinad-araku-coffee',
    category: 'food',
    category_label: 'Food Stories',
    location: 'Chettinad & Araku, South India',
    state_name: 'Tamil Nadu',
    short_description: 'Savoring freshly ground star anise, black pepper, and stone-ground curries served on banana leaves alongside tribal wood-roasted coffee.',
    content: 'Indian cuisine is a symphony of geography, history, and micro-climates...',
    cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    author: 'Chef Ananya Raman',
    author_role: 'Culinary Anthropologist',
    read_time: '5 min read',
    is_featured: false,
    likes_count: 520,
    views_count: 1860
  },
  {
    id: 7,
    title: 'Drifting Through the Emerald Canals of Alleppey on a Kettuvallam',
    slug: 'drifting-emerald-canals-alleppey-kettuvallam',
    category: 'coastal',
    category_label: 'Coastal India',
    location: 'Alleppey, Kerala',
    state_name: 'Kerala',
    short_description: 'Gliding silently through palm-fringed lagoons where kingfishers dart across paddy fields and life moves to the slow rhythm of the tide.',
    content: 'In Kerala’s backwater capital of Alleppey (Alappuzha), time slows down to the rhythmic dip of wooden oars in glass-calm waters...',
    cover_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200',
    author: 'Mathew Varghese',
    author_role: 'Coastal Guide & Naturalist',
    read_time: '4 min read',
    is_featured: false,
    likes_count: 710,
    views_count: 2730
  },
  {
    id: 8,
    title: 'Conquering the Roaring Rapids of the Holy Ganges in Rishikesh',
    slug: 'roaring-rapids-ganges-rishikesh',
    category: 'adventure',
    category_label: 'Adventure India',
    location: 'Rishikesh, Uttarakhand',
    state_name: 'Uttarakhand',
    short_description: 'Paddling through exhilarating Grade IV rapids as the emerald Ganges cuts through dramatic Himalayan foothills.',
    content: 'Rishikesh is the Yoga Capital of the World, but it is also India’s supreme adventure hub...',
    cover_image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200',
    author: 'Rohan Deshmukh',
    author_role: 'Whitewater Rafting Master',
    read_time: '5 min read',
    is_featured: false,
    likes_count: 480,
    views_count: 1950
  },
  {
    id: 9,
    title: 'The Silent Rhythm of Kathakali and the Living Temples of Hampi',
    slug: 'silent-rhythm-kathakali-temples-hampi',
    category: 'culture',
    category_label: 'Culture & Traditions',
    location: 'Hampi & Kerala',
    state_name: 'Karnataka',
    short_description: 'Exploring centuries-old temple architecture, classical mudras, and the vibrant theatrical traditions of Southern India.',
    content: 'Among the monumental granite boulder ruins of Hampi — the 14th-century capital of the Vijayanagara Empire...',
    cover_image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
    author: 'Dr. Meera Nambiar',
    author_role: 'Classical Arts Scholar',
    read_time: '6 min read',
    is_featured: false,
    likes_count: 595,
    views_count: 2240
  }
];

export const getStories = async (params = {}) => {
  try {
    const response = await apiClient.get('/stories/', { params });
    if (response.data) {
      return response.data;
    }
    return { success: true, data: FALLBACK_STORIES };
  } catch (error) {
    console.warn("API /stories/ unavailable, utilizing fallback storytelling dataset:", error);
    let filtered = [...FALLBACK_STORIES];
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(s => s.category === params.category || s.category_label?.toLowerCase().includes(params.category.toLowerCase()));
    }
    return { success: true, data: filtered, count: filtered.length };
  }
};

export const getFeaturedStory = async () => {
  try {
    const response = await apiClient.get('/stories/featured/');
    if (response.data) {
      return response.data.data || response.data;
    }
    return FALLBACK_STORIES[0];
  } catch (error) {
    console.warn("API /stories/featured/ fallback used:", error);
    return FALLBACK_STORIES[0];
  }
};

export const getStoryBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/stories/${slug}/`);
    if (response.data) {
      return response.data;
    }
    const match = FALLBACK_STORIES.find(s => s.slug === slug);
    return { success: true, data: match || FALLBACK_STORIES[0] };
  } catch (error) {
    console.warn(`API /stories/${slug}/ fallback used:`, error);
    const match = FALLBACK_STORIES.find(s => s.slug === slug);
    return { success: true, data: match || FALLBACK_STORIES[0] };
  }
};


export default {
  getStories,
  getFeaturedStory,
  getStoryBySlug,
  FALLBACK_STORIES
};
