import React from 'react';
import { Landmark, Sparkles, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DestinationTimeline({ historyText, destinationName }) {
  if (!historyText) return null;

  // Split history into readable paragraphs or timeline milestones
  const paragraphs = historyText.split(/\.\s+/).filter(p => p.trim().length > 10);

  return (
    <section className="details-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Landmark size={22} style={{ color: '#B45309' }} />
        <h2 style={{ margin: 0 }}>History & Cultural Legacy</h2>
      </div>

      <div className="history-timeline">
        {paragraphs.map((para, idx) => (
          <motion.div
            key={idx}
            className="timeline-node"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="node-dot" />
            <div className="node-content">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                Milestone #{idx + 1}
              </span>
              <p style={{ marginTop: '0.35rem', color: '#334155', lineHeight: 1.5, fontSize: '0.92rem' }}>
                {para.endsWith('.') ? para : `${para}.`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
