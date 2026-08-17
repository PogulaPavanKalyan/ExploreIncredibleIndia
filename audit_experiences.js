const http = require('http');
const https = require('https');

// Step 1: Get API response
http.get('http://localhost:8000/api/experiences/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const json = JSON.parse(data);
    const items = json.data || json;
    console.log(`API returned ${items.length} experiences:\n`);

    // Map slugs to expected subjects
    const EXPECTED = {
      'mountains':    'mountain/himalayan peaks',
      'beaches':      'beach/coastal shoreline',
      'temples':      'Indian temple architecture',
      'heritage':     'fort/palace/historical monument',
      'nature':       'forest/valley/landscape',
      'wildlife':     'tiger/elephant/wildlife',
      'waterfalls':   'actual waterfall',
      'adventure':    'trekking/outdoor adventure',
      'food-culture': 'food/spices/culture',
      'spiritual':    'ghats/pilgrimage/varanasi',
    };

    const DUPLICATES = {};
    const results = [];

    items.forEach(item => {
      const photoId = item.cover_image_url ? item.cover_image_url.match(/photo-([a-z0-9]+)/i)?.[1] || 'n/a' : 'NULL';
      if (photoId !== 'n/a' && photoId !== 'NULL') {
        if (DUPLICATES[photoId]) {
          console.warn(`DUPLICATE! ${item.name} reuses photo from ${DUPLICATES[photoId]}`);
        }
        DUPLICATES[photoId] = item.name;
      }
      results.push({
        order: item.display_order,
        name: item.name,
        slug: item.slug,
        url: item.cover_image_url,
        photoId,
        expected: EXPECTED[item.slug] || '?'
      });
    });

    // Sort by display_order
    results.sort((a, b) => a.order - b.order);
    results.forEach(r => {
      console.log(`[${r.order}] ${r.name.padEnd(14)} slug=${r.slug.padEnd(12)} photoId=${r.photoId.padEnd(20)} expected=${r.expected}`);
    });

    // Step 2: Verify all image URLs return 200
    console.log('\n--- Verifying image URLs ---');
    const valid = results.filter(r => r.url);
    let checked = 0;

    valid.forEach(r => {
      if (!r.url) { console.log(`NULL URL: ${r.name}`); return; }
      https.get(r.url, (res2) => {
        const status = res2.statusCode;
        const ok = status === 200;
        console.log(`${ok ? 'OK ' : 'FAIL'} [${status}] ${r.name.padEnd(14)} ${r.url.substring(0, 65)}`);
        res2.resume();
        checked++;
        if (checked === valid.length) {
          console.log('\nAll checks done.');
        }
      }).on('error', (e) => {
        console.log(`ERR ${r.name}: ${e.message}`);
        checked++;
      });
    });
  });
}).on('error', e => console.error('API error:', e.message));
