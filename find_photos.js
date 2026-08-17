const https = require('https');

function fetchPhotos(query) {
  https.get(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`\nResults for "${query}":`);
        json.results.forEach((item, index) => {
            console.log(`[${index + 1}] ID: ${item.id} | Desc: ${item.description || item.alt_description} | URL: ${item.urls.raw}`);
        });
      } catch (e) {
        console.error("Error parsing JSON:", e.message);
      }
    });
  }).on('error', e => console.error(e));
}

fetchPhotos('hindu temple india');
fetchPhotos('varanasi ghats');
