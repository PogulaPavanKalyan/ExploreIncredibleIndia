import React, { useEffect } from 'react';

export default function SEOHead({
  title = "Dekho Bharat | Explore Incredible India - Destinations, Itineraries & Culture",
  description = "Discover India's thousands of attractions, historical forts, spiritual temples, natural wonders, authentic local food, and hidden gems with Dekho Bharat.",
  image = "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200",
  url = window.location.href,
  schema = null
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to update meta tag by name or property
    const updateMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.split('property="')[1].split('"')[0]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.split('name="')[1].split('"')[0]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Standard Meta Tags
    updateMetaTag('meta[name="description"]', 'content', description);

    // 3. OpenGraph Social Sharing Tags
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:image"]', 'content', image);
    updateMetaTag('meta[property="og:url"]', 'content', url);
    updateMetaTag('meta[property="og:type"]', 'content', 'website');

    // 4. Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', image);

    // 5. Schema.org JSON-LD Injection
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById('json-ld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, image, url, schema]);

  return null;
}
