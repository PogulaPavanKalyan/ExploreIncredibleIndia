import os

file_path = r"d:\Endeavor\frontend\src\Home\Homepage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize line endings to LF to avoid issues with platform-specific CRLF/LF variations
content = content.replace("\r\n", "\n")

# Find the start of the Homepage component
homepage_start = content.find("const Homepage = () => {")
if homepage_start == -1:
    print("Could not find const Homepage = () => {")
    exit(1)

# Locate the return block of the Homepage component
start_marker = "  return (\n"
start_idx = content.find(start_marker, homepage_start)
if start_idx == -1:
    print("Could not find start marker")
    exit(1)

# Locate the end marker of the Homepage return statement
end_marker = "  );\n};"
end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    print("Could not find end marker")
    exit(1)

pre_content = content[:start_idx]
post_content = content[end_idx:]

new_return = """  return (
    <div className="homepage-redesign-wrapper">
      {/* 1. NAVBAR (UNTOUCHED) */}
      <Header />

      {/* 2. HERO SECTION REDESIGN */}
      {heroLoading ? <HeroSkeleton /> : (
        <section className="hero-section hero-premium-light">
          {/* Subtle Ambient Background Glow Bubbles */}
          <div className="hero-light-glow blue-glow" />
          <div className="hero-light-glow pink-glow" />

          <div className="hero-inner container">
            {/* Left Column: Text Content */}
            <div className="hero-left animate-fade-in-left">
              <div className="hero-content-wrapper">
                {/* Top Badge */}
                <span className="hero-badge-redesign">
                  🌐 Global Scientific Conferences 2026
                </span>

                {/* Headline */}
                <h1 className="hero-title">
                  {heroData?.title || "Advancing Global Research Through Innovation"}
                </h1>
                
                {/* Description */}
                <p className="hero-desc">
                  {heroData?.description || "Join researchers, scientists, and industry leaders from 50+ countries to share knowledge, publish innovations and build global partnerships."}
                </p>

                {/* Action Buttons */}
                <div className="hero-cta-buttons">
                  <Link
                    to="/submit-abstract"
                    className="btn-premium-primary"
                  >
                    Submit Abstract
                  </Link>
                  <button
                    className="btn-premium-secondary"
                    onClick={() => navigate("/conferences")}
                  >
                    Explore Conferences
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Column: 3-Image Collage */}
            <div className="hero-right animate-fade-in-right">
              <div className="hero-collage-wrap">
                <div className="collage-container">
                  {/* Main image */}
                  <div className="collage-card card-main">
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
                      alt="International Scientific Congress"
                      fallbackType="conference"
                    />
                    <div className="collage-card-overlay" />
                  </div>

                  {/* Second image - top right */}
                  <div className="collage-card card-sub-top">
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80"
                      alt="Scientific Presentation"
                      fallbackType="conference"
                    />
                    <div className="collage-card-overlay" />
                  </div>

                  {/* Third image - bottom left */}
                  <div className="collage-card card-sub-bottom">
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                      alt="Research Collaboration"
                      fallbackType="research"
                    />
                    <div className="collage-card-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. UPCOMING CONFERENCES (REDESIGNED & DYNAMIC) */}
      <section className="section upcoming-conferences-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Conferences</span>
            <h2 className="section-title">Upcoming Global Congresses 2026</h2>
            <p className="section-desc">
              Participate as a presenter or delegate at our upcoming summits.
            </p>
          </div>
          <div className="upcoming-strip-wrap" ref={confRef}>
            {conferences.map((item) => (
              <div className="upcoming-conf-card card-premium" key={item.id}>
                <div className="card-media">
                  <span className="status-badge-active">Open Registration</span>
                  <OptimizedImage src={item.image} alt={item.title} fallbackType="conference" />
                </div>
                <div className="card-details">
                  <h3>{item.title}</h3>
                  <p className="conf-meta">📅 {item.date}</p>
                  <p className="conf-meta">📍 {item.venue}</p>
                  <a href={getSubdomainUrl(item.subdomain || item.dbId)} className="btn-view-conf">View Program &rarr;</a>
                </div>
              </div>
            ))}
            {conferences.length === 0 && (
              <p className="empty-state">No upcoming conferences listed. Please verify later.</p>
            )}
          </div>
        </div>
      </section>

      {/* 6. PAST CONFERENCES (REDESIGNED & DYNAMIC) */}
      <section className="section past-conferences-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Success Footprint</span>
            <h2 className="section-title">Past Congress Editions</h2>
            <p className="section-desc">
              Review our global academic reach and previously held symposium volumes.
            </p>
          </div>
          <div className="past-conferences-grid">
            {pastConferences.map((item) => (
              <div className="past-conf-card card-premium" key={item.id}>
                <div className="past-card-media">
                  <span className="past-year-badge">2025</span>
                  <OptimizedImage src={item.image} alt={item.title} fallbackType="conference" />
                </div>
                <div className="past-card-body">
                  <h3>{item.title}</h3>
                  <div className="past-metadata">
                    <span>📍 {item.venue}</span>
                    <span>👥 {item.attendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. WEBINAR SECTION (REDESIGNED & DYNAMIC) */}
      <section className="section webinars-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">E-Learning</span>
            <h2 className="section-title">Virtual Lectures & Webinars</h2>
            <p className="section-desc">
              Join online expert-led research discussions and live scientific assemblies.
            </p>
          </div>
          <div className="webinar-filter-bar">
            {["all", "live", "upcoming"].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${webinarFilter === cat ? "active" : ""}`}
                onClick={() => setWebinarFilter(cat)}
              >
                {cat.toUpperCase()} WEBINARS
              </button>
            ))}
          </div>
          <div className="webinars-grid-redesign">
            {filteredWebinars.map((web) => (
              <div className={`webinar-card-redesign card-premium ${web.status}`} key={web.id}>
                <div className="w-media">
                  <OptimizedImage src={web.image} alt={web.title} fallbackType="conference" />
                  <span className={`w-status-pill ${web.status}`}>{web.status.toUpperCase()}</span>
                </div>
                <div className="w-body">
                  <h3>{web.title}</h3>
                  <p className="w-speaker">🎙️ Speaker: {web.speaker}</p>
                  <p className="w-desc">{web.desc}</p>
                  <div className="w-footer-meta">
                    <span>📅 {web.date}</span>
                    <span>⏰ {web.time}</span>
                  </div>
                  <div className="w-actions">
                    {web.status === "live" ? (
                      <button className="btn-join-broadcast" onClick={() => navigate("/webinars")}>Join Broadcast</button>
                    ) : (
                      <button className="btn-reserve-seat" onClick={() => navigate("/webinars")}>Reserve Seat</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT ORGANIZATION — PREMIUM 2026 REDESIGN */}
      <section className="section about-org-redesign">
        <div className="container">

          {/* ── Top Row: Two-column layout ── */}
          <div className="about-two-col">

            {/* Left Column: Content */}
            <div className="about-left-col">
              <span className="section-tag">{aboutData?.tag || "About Organization"}</span>
              <h2 className="about-main-heading">
                {aboutData?.title || "Empowering Global Scientific Discovery"}
              </h2>
              <p className="about-lead-para">
                {aboutData?.description || "Research Endeavor acts as a pivotal axis connecting international experts, ideas, and publication pathways across 50+ countries."}
              </p>

              {/* 4 Service Highlight Cards – 2×2 grid */}
              <div className="about-service-grid">
                {(aboutData?.pillars || FALLBACK_ABOUT.pillars).slice(0, 4).map((pillar, i) => (
                  <div className="about-svc-card" key={i}>
                    <span className="about-svc-icon">{pillar.icon}</span>
                    <div className="about-svc-body">
                      <h4>{pillar.title}</h4>
                      <p>{pillar.desc}</p>
                    </div>
                  </div>
                ))}
                {/* Extra static cards if API only returns 3 */}
                {(aboutData?.pillars || FALLBACK_ABOUT.pillars).length < 4 && (
                  <div className="about-svc-card">
                    <span className="about-svc-icon">📖</span>
                    <div className="about-svc-body">
                      <h4>Publication Support</h4>
                      <p>Fast-track proceedings published in Scopus, Web of Science indexed journals.</p>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/about" className="btn-about-learn">
                Discover Our Mission →
              </Link>
            </div>

            {/* Right Column: Large premium photo + floating glass badge */}
            <div className="about-right-col">
              <div className="about-photo-frame">
                <div className="about-photo-main">
                  <OptimizedImage
                    src={
                      (aboutData?.tabs?.about?.images?.[0]) ||
                      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                    }
                    alt="International Research Conference"
                    fallbackType="conference"
                  />
                </div>
                <div className="about-photo-secondary">
                  <OptimizedImage
                    src={
                      (aboutData?.tabs?.about?.images?.[1]) ||
                      "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=600&q=80"
                    }
                    alt="Workshop & Networking"
                    fallbackType="conference"
                  />
                </div>

                {/* Floating glassmorphism badge */}
                <div className="about-float-badge">
                  <span className="float-badge-icon">🏆</span>
                  <div className="float-badge-body">
                    <strong>Est. 2015</strong>
                    <span>10+ Years of Excellence</span>
                  </div>
                </div>

                {/* Floating stat card */}
                <div className="about-float-stat">
                  <span className="float-stat-num">50+</span>
                  <span className="float-stat-lbl">Countries</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CONFERENCE CATEGORIES (REDESIGNED & DYNAMIC) */}
      <section className="section categories-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Fields of Study</span>
            <h2 className="section-title">Diverse Academic Frontiers</h2>
            <p className="section-desc">
              Explore scientific calls and programs across all major disciplines and technical directories.
            </p>
          </div>
          <div className="categories-grid-redesign">
            {categories.map((cat, i) => (
              <div className="category-card-redesign card-premium" key={i}>
                <div className="cat-image-wrap">
                  <OptimizedImage src={cat.image} alt={cat.label} className="cat-img" fallbackType="research" />
                  <div className="cat-img-overlay" />
                  <span className="cat-icon-badge">{cat.icon}</span>
                </div>
                <div className="cat-content">
                  <h3>{cat.label}</h3>
                  <p>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL FOR PAPERS (REDESIGNED & DYNAMIC) */}
      <section className="section call-for-papers-redesign">
        <div className="container">
          <div className="cfp-card-wrap glass-panel">
            <div className="cfp-text-side">
              <span className="cfp-badge">{callForAbstracts?.badge || "Call For Abstracts 2026"}</span>
              <h2>{callForAbstracts?.title || "Share Your Innovations Internationally"}</h2>
              <p>
                {callForAbstracts?.description || "Submitting your proposal to Endeavor Conferences is streamlined. Authors must register, upload a short draft abstract (word/pdf format), and select their target research category."}
              </p>
              <div className="cfp-milestones">
                <div className="milestone">
                  <strong>Milestone A</strong>
                  <span>Topic Selection</span>
                </div>
                <div className="milestone">
                  <strong>Milestone B</strong>
                  <span>Document Upload</span>
                </div>
                <div className="milestone">
                  <strong>Milestone C</strong>
                  <span>Portal Submission</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link to="/submit-abstract" className="btn-cfp-action">Submit Abstract proposal &rarr;</Link>
                <Link to="/conferences" className="btn-cfp-secondary">Abstract Guidelines</Link>
              </div>
            </div>
            <div className="cfp-image-side">
              <OptimizedImage src={callForAbstracts?.image} alt="Academic publishing review process" className="cfp-hero-img shadow-premium" fallbackType="research" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. SPEAKERS (REDESIGNED) */}
      {speakersList.length > 0 && (
        <section className="section speakers-redesign">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Keynotes</span>
              <h2 className="section-title">Featured Plenary Presenters</h2>
              <p className="section-desc">
                Learn from world-renowned scientists and industry-leading specialists.
              </p>
            </div>
            <div className="speakers-grid-redesign">
              {speakersList.slice(0, 4).map((s, i) => {
                const headshot = s.photo?.filePath && s.photo.filePath.startsWith("http")
                  ? s.photo.filePath
                  : (s.photo?.fileName ? `${BASE_URL}/uploads/speakers/${s.photo.fileName}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=FFF1F5&color=E91E63&size=200`);
                return (
                  <div className="speaker-card-redesign card-premium" key={i}>
                    <div className="speaker-avatar-wrap">
                      <OptimizedImage src={headshot} alt={s.name} fallbackType="avatar" />
                    </div>
                    <div className="speaker-meta-info">
                      <h3>{s.name}</h3>
                      <p className="speaker-role">{s.designation}</p>
                      <p className="speaker-aff">{s.affiliation}</p>
                      {s.country && <span className="speaker-country-chip">🌍 {s.country}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 10. COMMITTEE MEMBERS (REDESIGNED & DYNAMIC) */}
      <section className="section committee-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Advisory Board</span>
            <h2 className="section-title">Global Steering Committee Section</h2>
            <p className="section-desc">
              Distinguished scholars directing research scopes, peer assessments, and track sessions.
            </p>
          </div>
          <div className="committee-grid-redesign">
            {committeeMembers.map((member, i) => (
              <div className="committee-card-redesign card-premium" key={i}>
                <div className="committee-img">
                  <OptimizedImage src={member.photo} alt={member.name} fallbackType="avatar" />
                </div>
                <div className="committee-body">
                  <h3>{member.name}</h3>
                  <p className="c-role">{member.role}</p>
                  <p className="c-inst">{member.institution}</p>
                  <span className="c-country">📍 {member.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. SPONSORS & PARTNERS (REDESIGNED & DYNAMIC LOGOS) */}
      <section className="section sponsors-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Partnerships</span>
            <h2 className="section-title">Organizers & Corporate Sponsors</h2>
            <p className="section-desc">
              Supported by leading academic groups and research laboratories.
            </p>
          </div>
          <div className="sponsors-ticker-wrapper">
            <div className="sponsors-ticker-content">
              {sponsorsList.map((sp) => (
                <div key={sp.id} className="sponsor-ticker-item">
                  <SponsorLogo name={sp.sponsorName} />
                </div>
              ))}
              {sponsorsList.length === 0 && (
                <>
                  <div className="sponsor-ticker-item"><SponsorLogo name="IEEE" /></div>
                  <div className="sponsor-ticker-item"><SponsorLogo name="Springer Nature" /></div>
                  <div className="sponsor-ticker-item"><SponsorLogo name="Elsevier" /></div>
                  <div className="sponsor-ticker-item"><SponsorLogo name="Google Scholar" /></div>
                  <div className="sponsor-ticker-item"><SponsorLogo name="CrossRef" /></div>
                  <div className="sponsor-ticker-item"><SponsorLogo name="Scopus" /></div>
                  <div className="sponsor-ticker-item"><SponsorLogo name="Web of Science" /></div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 19. GALLERY (REDESIGNED & DYNAMIC) */}
      <section className="section gallery-redesign">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Visual Timeline</span>
            <h2 className="section-title">Large Congress Gallery Section</h2>
            <p className="section-desc">
              Visual records representing collaborative discussions, presentations, and award dinners.
            </p>
          </div>
          <div className="gallery-filter-bar">
            {["all", "auditorium", "networking", "awards"].map((tag) => (
              <button
                key={tag}
                className={`gallery-filter-btn ${galleryActiveTag === tag ? "active" : ""}`}
                onClick={() => setGalleryActiveTag(tag)}
              >
                {tag.toUpperCase()} PHOTOS
              </button>
            ))}
          </div>
          <div className="gallery-slider-wrapper">
            <button className="gallery-nav-btn prev" onClick={() => scrollGallery("left")} aria-label="Previous Image">
              ‹
            </button>
            <div className="gallery-grid-redesign-expanded" ref={galleryRef}>
              {filteredGallery.map((photo, i) => (
                <div className="gallery-img-holder-expanded card-premium" key={i}>
                  <OptimizedImage src={photo.url} alt={`Congress moment ${photo.tag} ${i + 1}`} fallbackType="conference" />
                  <span className="gallery-tag-label">{photo.tag.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <button className="gallery-nav-btn next" onClick={() => scrollGallery("right")} aria-label="Next Image">
              ›
            </button>
          </div>
        </div>
      </section>

      {/* 23. FOOTER (UNTOUCHED) */}
      <Footer />
    </div>"""

new_content = pre_content + new_return + post_content

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Reorder completed successfully")
