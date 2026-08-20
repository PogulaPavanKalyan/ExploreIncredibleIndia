import React from 'react';
import { Landmark, ShieldCheck, Clock, Layers, Sparkles, BookOpen } from 'lucide-react';
import './DestinationHistorySection.css';

export default function DestinationHistorySection({ destination }) {
  const history = destination.history;

  const shortHistory = history?.short_history || destination.short_description || destination.description;
  const detailedHistory = history?.detailed_history || destination.description;
  const architecture = history?.architecture || destination.temple_architecture;
  const cultural = history?.cultural_significance;
  const religious = history?.religious_significance || destination.spiritual_tradition;

  if (!history && !shortHistory && !detailedHistory) {
    return (
      <section className="dest-history-section" id="history-heritage">
        <div className="dest-history-header">
          <div className="dest-history-title-wrap">
            <div className="dest-history-icon-box">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="dest-history-title">History & Heritage</h2>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                Chronicles, Architecture & Spiritual Significance
              </span>
            </div>
          </div>
        </div>
        <div className="dest-history-short-lead" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
          History information is being prepared.
        </div>
      </section>
    );
  }

  const timelineEvents = history?.important_dates && history.important_dates.length > 0
    ? history.important_dates
    : [
        { era: "Origins", title: "Early History", description: `Ancient origin and establishment in ${destination.state_name || destination.state?.name || 'India'}.` },
        { era: "Medieval Era", title: "Royal Dynasties", description: "Expanded by royal patrons and regional architects." },
        { era: "Modern Era", title: "Preserved Heritage", description: "Preserved and documented as a cultural landmark." }
      ];

  const sourceName = history?.source_name || destination.source_name || "Archaeological Survey of India / Official State Tourism";

  return (
    <section className="dest-history-section" id="history-heritage">
      <div className="dest-history-header">
        <div className="dest-history-title-wrap">
          <div className="dest-history-icon-box">
            <Landmark size={24} />
          </div>
          <div>
            <h2 className="dest-history-title">History & Heritage</h2>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
              Chronicles, Architecture & Spiritual Significance
            </span>
          </div>
        </div>

        <div className="dest-history-source-badge">
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Source: {sourceName}
        </div>
      </div>

      {/* Narrative Lead */}
      {shortHistory && (
        <div className="dest-history-short-lead">
          {shortHistory}
        </div>
      )}

      {detailedHistory && detailedHistory !== shortHistory && (
        <p className="dest-history-detailed-text">
          {detailedHistory}
        </p>
      )}

      {/* Facets: Architecture, Culture, Religion */}
      <div className="dest-history-facets-grid">
        {architecture && (
          <div className="dest-history-facet-card">
            <div className="dest-facet-label">
              <Layers size={14} /> Architecture & Style
            </div>
            <p className="dest-facet-body">{architecture}</p>
          </div>
        )}

        {cultural && (
          <div className="dest-history-facet-card">
            <div className="dest-facet-label">
              <Sparkles size={14} /> Cultural Heritage
            </div>
            <p className="dest-facet-body">{cultural}</p>
          </div>
        )}

        {religious && (
          <div className="dest-history-facet-card">
            <div className="dest-facet-label">
              <BookOpen size={14} /> Spiritual Significance
            </div>
            <p className="dest-facet-body">{religious}</p>
          </div>
        )}
      </div>

      {/* Interactive Era Timeline */}
      {timelineEvents && timelineEvents.length > 0 && (
        <div className="dest-timeline-block">
          <div className="dest-timeline-header">
            <Clock size={20} color="#FF6B1A" />
            <span>Historical Chronology & Timeline</span>
          </div>

          <div className="dest-timeline-track">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="dest-timeline-item">
                <span className="dest-timeline-era-badge">{item.era || item.year || `Era ${idx + 1}`}</span>
                <h4 className="dest-timeline-item-title">{item.title}</h4>
                <p className="dest-timeline-item-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
