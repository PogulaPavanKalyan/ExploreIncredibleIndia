import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, ArrowLeft, Share2, MapPin, Heart, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getStoryBySlug } from '../services/storyService';

const SAMPLE_DETAIL_STORIES = {
  'vistadome-express-araku-valley': {
    title: 'Riding the Glass-Roofed Vistadome Express through Araku Coffee Valleys',
    author: 'Priya Sharma',
    author_bio: 'Avid Indian Railway enthusiast and travel photographer who has explored over 25 states.',
    read_time: '6 min read',
    published_at: 'August 10, 2026',
    state_name: 'Andhra Pradesh',
    featured_image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200',
    content: `
The journey aboard the Visakhapatnam to Araku Vistadome train (Train #18551) is easily one of the most magnificent scenic rail routes in South India. Departing early morning from Visakhapatnam Junction, the train gradually leaves behind coastal palm fringes and begins climbing into the Eastern Ghats.

What makes the Vistadome coach extraordinary is its 360-degree rotating plush leather seats and transparent glass roof. As the train cuts through 58 tunnels and traverses over 84 bridges, sunlight streams into the glass dome, illuminating mist-covered valleys and dense coffee plantations.

### Highlights of the Vistadome Route:
- **Shimiliguda Railway Station**: Situated at 996 meters above sea level, it was historically the highest broad-gauge railway station in India.
- **Borra Caves Viewpoint**: Passing near Gottivalasa bridge offering dizzying views down into deep ravines.
- **Coffee Aroma in the Air**: As the train reaches Araku Station, the fresh aroma of organic Arabica coffee beans welcomes travelers.

### Travel Tips for Visitors:
1. **Book Early**: Vistadome tickets (EC Class) open 120 days in advance on IRCTC and sell out rapidly.
2. **Best Seat Position**: Request seats 1 to 12 in Coach EV1 for unobstructed panoramic views from the rear observation lounge.
3. **Local Tasting**: Don't miss sampling freshly fried Bamboo Chicken and filter coffee right outside Araku Station!
    `
  }
};

export default function StoryDetailPage() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStoryBySlug(slug)
      .then(res => {
        if (res && res.data) {
          setStory(res.data);
        } else if (SAMPLE_DETAIL_STORIES[slug]) {
          setStory(SAMPLE_DETAIL_STORIES[slug]);
        } else {
          setStory({
            title: slug.replace(/-/g, ' ').toUpperCase(),
            author: 'Dekho Bharat Editorial',
            read_time: '5 min read',
            published_at: 'August 2026',
            state_name: 'India',
            featured_image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200',
            content: `Exploring the magical wonders of India offers unforgettable memories. From historic monuments to scenic hill retreats, every corner holds a rich story waiting to be discovered.`
          });
        }
      })
      .catch(() => {
        setStory(SAMPLE_DETAIL_STORIES[slug] || SAMPLE_DETAIL_STORIES['vistadome-express-araku-valley']);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>Loading travel story...</div>;
  }

  return (
    <PageTransition>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1.5rem 1rem 4rem 1rem' }}>
        {/* Back Link */}
        <Link to="/stories" style={{ color: '#FF6B35', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Travel Stories
        </Link>

        {/* Cover Image Header */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '380px', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <img src={story.featured_image || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200'} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)' }} />
          
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', color: '#ffffff' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF6B35', background: 'rgba(255,107,53,0.15)', backdropFilter: 'blur(6px)', border: '1px solid #FF6B35', padding: '0.25rem 0.65rem', borderRadius: '20px', textTransform: 'uppercase' }}>
              📍 {story.state_name || 'India'}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0.6rem 0', lineHeight: 1.3 }}>
              {story.title}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', opacity: 0.9, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} color="#FF6B35" /> {story.author}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} color="#FF6B35" /> {story.read_time || '5 min read'}</span>
            </div>
          </div>
        </div>

        {/* Story Body Content */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: 'var(--shadow-sm)', fontSize: '1.02rem', lineHeight: 1.8, color: '#334155' }}>
          {story.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{paragraph.replace('### ', '')}</h3>;
            }
            return <p key={index} style={{ marginBottom: '1.25rem' }}>{paragraph}</p>;
          })}

          {/* Social Share Footer */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Share2 size={16} color="#FF6B35" /> Share this Travelogue
            </span>
            <button
              onClick={() => navigator.clipboard ? navigator.clipboard.writeText(window.location.href) : null}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', background: '#F1F5F9', border: 'none', fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', cursor: 'pointer' }}
            >
              Copy Story Link
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
