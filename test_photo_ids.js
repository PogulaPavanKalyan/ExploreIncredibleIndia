const https = require('https');

// Candidates to test: we know the slugs from search results
// These are Unsplash photo IDs extracted from the URL slugs above
const candidates = {
  waterfall_athirappilly: [
    "https://images.unsplash.com/photo-1625123720757-f6_ztggqa?w=1200",
    // Athirappilly Waterfalls Kerala (various known IDs)
    "https://images.unsplash.com/photo-1625123720757?w=1200",
    // Known real waterfall IDs from India:
    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200",  // Tropical waterfall
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200",  // Waterfall in forest
    "https://images.unsplash.com/photo-1488866022504-f2584929ca5f?w=1200",  // Falls
    "https://images.unsplash.com/photo-1504883801023-1f9e05b31e5c?w=1200",  // Waterfall
    "https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?w=1200",  // Cascading falls
    "https://images.unsplash.com/photo-1606787619248-f8e8adf8c41d?w=1200",  // Indian waterfall
    "https://images.unsplash.com/photo-1567517007050-f95abf3c73a6?w=1200",  // Athirappilly style
    "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200",  // Dark forest waterfall
  ],
  spiritual_varanasi: [
    // Varanasi / ghat spiritual IDs
    "https://images.unsplash.com/photo-1545989253-02cc26577f88?w=1200",
    "https://images.unsplash.com/photo-1611002153015-91e77c7e1e90?w=1200",
    "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200",
    "https://images.unsplash.com/photo-1552553958-26d4a6afac48?w=1200",
    "https://images.unsplash.com/photo-1565705515645-4b26b2fd5027?w=1200",
    "https://images.unsplash.com/photo-1609940119700-8f9a5b0e78cb?w=1200",
    "https://images.unsplash.com/photo-1622485390923-3e47c94ea93e?w=1200",
  ],
  temples_india: [
    // Real Indian temple photos
    "https://images.unsplash.com/photo-1604693975757-2bca6e9f81f5?w=1200",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200",
    "https://images.unsplash.com/photo-1524781289445-ddf8d5695e71?w=1200",
    "https://images.unsplash.com/photo-1603466182843-75ceab0f2818?w=1200",
  ],
  wildlife_tiger: [
    // Tiger wildlife real photos
    "https://images.unsplash.com/photo-1634179415773-1eb5e75b2b85?w=1200",
    "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=1200",
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200",  // Current one - let's test
    "https://images.unsplash.com/photo-1567345297988-85bde0cd53f2?w=1200",
    "https://images.unsplash.com/photo-1550268101-df48abc8f5c1?w=1200",
  ]
};

async function testGroup(groupName, urls) {
  console.log(`\n=== ${groupName} ===`);
  for (const url of urls) {
    await new Promise(res => {
      https.get(url, (r) => {
        console.log(`[${r.statusCode}] ${url}`);
        r.resume();
        res();
      }).on('error', e => {
        console.log(`[ERR] ${url}`);
        res();
      });
    });
  }
}

async function run() {
  for (const [key, urls] of Object.entries(candidates)) {
    await testGroup(key, urls);
  }
}

run();
