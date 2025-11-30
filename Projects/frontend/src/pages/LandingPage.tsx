import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { getLands, getProjects, getProperties } from '../services/api';
import type { Land, Project, Property } from '../types';
import { getPropertyImageUrl, getProjectImageUrl, getLandImageUrl } from '../utils/imageUtils';

const landingStats = [
  { label: 'Verified Listings', value: '1,015+' },
  { label: 'Trusted Agents', value: '120+' },
  { label: 'Cities Covered', value: '18' },
];

interface SavedSearch {
  query: string;
  type: 'properties' | 'projects' | 'lands';
  timestamp: number;
}

interface FooterTabContent {
  title: string;
  content: string;
  details?: string[];
}

const footerContent: Record<string, FooterTabContent> = {
  about: {
    title: 'About Oman Housing Bank',
    content: 'At Oman Housing Bank, we are dedicated to supporting the dreams of homeowners across the nation for over four decades. Our commitment to excellence and innovation drives us to provide exceptional housing solutions tailored to the needs of our community.',
    details: [
      'Established in 1977',
      'Serving the nation for over 45 years',
      'Committed to sustainable development',
      'Trusted housing finance partner'
    ]
  },
  role: {
    title: 'Our Role',
    content: 'Oman Housing Bank plays a crucial role in providing subsidized housing loans and financial services to ensure every citizen has access to quality housing. We deliver comprehensive financial solutions and expert consultation services.',
    details: [
      'Provide subsidized housing loans',
      'Offer comprehensive financial services',
      'Deliver expert consultation services',
      'Support sustainable development'
    ]
  },
  curators: {
    title: 'Leadership & Management',
    content: 'Our experienced leadership team and dedicated professionals work together to ensure excellence in all aspects of our operations and customer service.',
    details: [
      'Executive Leadership Team',
      'Board of Directors',
      'Senior Management',
      'Professional Staff'
    ]
  },
  history: {
    title: 'Our History',
    content: 'Oman Housing Bank has been a cornerstone of the nation\'s housing development since 1977. Over four decades of service, we have built a legacy of trust, innovation, and commitment to providing quality housing solutions.',
    details: [
      'Founded in 1977',
      'Four decades of service',
      'Consistent growth and expansion',
      'Building a brighter future for Oman'
    ]
  },
  resources: {
    title: 'Resources & Services',
    content: 'We offer a comprehensive range of services including lending services, deposit services, partner services, treasury services, and customer experience solutions.',
    details: [
      'Lending Services',
      'Deposit Services',
      'Partner Services',
      'Treasury Services',
      'Customer Experience',
      'Iskan Program'
    ]
  },
  legal: {
    title: 'Legal & Compliance',
    content: 'Oman Housing Bank operates under strict legal and regulatory frameworks to ensure transparency, accountability, and protection of customer rights.',
    details: [
      'Charter of Customer Rights',
      'Business Continuity Management',
      'Regulatory Compliance',
      'Whistleblowing Policy'
    ]
  },
  program: {
    title: 'Iskan Program',
    content: 'The Iskan Program is a comprehensive housing initiative designed to make homeownership more accessible to citizens through favorable financing options and flexible terms.',
    details: [
      'Subsidized housing loans',
      'Flexible payment terms',
      'Low interest rates',
      'Easy approval process'
    ]
  },
  social: {
    title: 'Connect With Us',
    content: 'Follow Oman Housing Bank on our social media channels to stay updated with the latest news, announcements, and industry insights.',
    details: [
      'Email: ohb@ohb.co.om',
      'Phone: +968 24775800',
      'P.O. Box 2555, Ruwi 112, Oman',
      'Facebook | LinkedIn | Twitter | YouTube | Instagram'
    ]
  }
};

interface HeaderTabContent {
  title: string;
  content: string;
  details?: string[];
}

const headerTabsContent: Record<string, HeaderTabContent> = {
  processes: {
    title: 'Our Processes',
    content: 'Streamlined and transparent processes designed to make your real estate journey seamless and worry-free.',
    details: [
      'Property Search & Discovery: Advanced filtering and AI-powered recommendations',
      'Application Process: Simple 3-step online application with instant approval',
      'Verification & Authentication: Rigorous verification of all listings and agents',
      'Financing Solutions: Flexible payment options and loan processing',
      'Closing & Handover: Secure transaction handling and property transfer',
      'After-Sales Support: Dedicated support team for all post-purchase needs'
    ]
  },
  help: {
    title: 'Help & Support',
    content: 'Get answers to your questions and find guidance on all aspects of using our platform.',
    details: [
      'FAQ: Frequently asked questions about properties, financing, and the marketplace',
      'Search Tips: Master advanced search techniques to find your perfect property',
      'Financing Guide: Understand different loan options and requirements',
      'Safety & Security: Learn how we protect your personal and financial information',
      'Contact Support: Reach our 24/7 customer support team via phone, email, or chat',
      'Documentation: Access detailed guides and documentation for all platform features'
    ]
  },
  properties: {
    title: 'Properties',
    content: 'Browse our comprehensive collection of verified properties across Oman.',
    details: [
      'Featured Listings: Hand-picked properties matching market demands',
      'Advanced Filters: Filter by location, price, bedrooms, amenities, and more',
      'Virtual Tours: 360° immersive property tours with detailed photography',
      'Price Trends: Market analysis and price history for informed decisions',
      'Agent Directory: Connect with verified and trusted real estate professionals',
      'Save & Compare: Create shortlists and compare multiple properties side by side'
    ]
  }
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [popularProjects, setPopularProjects] = useState<Project[]>([]);
  const [popularLands, setPopularLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [listingType, setListingType] = useState<'properties' | 'projects' | 'lands'>('properties');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [activeFooterTab, setActiveFooterTab] = useState<string | null>(null);
  const [activeHeaderTab, setActiveHeaderTab] = useState<string | null>(null);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('savedSearches');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedSearches(parsed);
      } catch (err) {
        console.error('Failed to parse saved searches:', err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [properties, projects, lands] = await Promise.all([
          getProperties(),
          getProjects(),
          getLands(),
        ]);

        const normalize = <T,>(value: T | { data?: T[] } | undefined): T[] => {
          if (!value) return [];
          if (Array.isArray(value)) return value;
          if (typeof value === 'object' && 'data' in value && Array.isArray(value.data)) {
            return value.data;
          }
          return [];
        };

        const normalizedProperties = normalize(properties as any) as Property[];
        const normalizedProjects = normalize(projects as any) as Project[];
        const normalizedLands = normalize(lands as any) as Land[];

        setFeaturedProperties(normalizedProperties.slice(0, 6));
        setPopularProjects(normalizedProjects.slice(0, 4));
        setPopularLands(normalizedLands.slice(0, 4));
      } catch (err) {
        console.error('Failed to load landing data', err);
        setError('Unable to load the marketplace right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `O$${(price / 10000000).toFixed(2)}M`;
    }
    if (price >= 100000) {
      return `O$${(price / 100000).toFixed(0)}L`;
    }
    return `O$${price.toLocaleString()}`;
  };

  const heroHighlights = useMemo(() => featuredProperties.slice(0, 3), [featuredProperties]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();
    
    // Save this search if there's a query
    if (query) {
      saveSearch(query, listingType);
    }

    navigate('/search-results', {
      state: {
        filters: {
          query,
          listingType,
        },
      },
    });
  };

  const saveSearch = (query: string, type: 'properties' | 'projects' | 'lands') => {
    const newSearch: SavedSearch = {
      query,
      type,
      timestamp: Date.now()
    };

    // Check if this search already exists
    const exists = savedSearches.some(
      s => s.query.toLowerCase() === query.toLowerCase() && s.type === type
    );

    if (!exists) {
      const updated = [newSearch, ...savedSearches].slice(0, 5); // Keep only 5 most recent
      setSavedSearches(updated);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    }
  };

  const handleSavedSearchClick = (search: SavedSearch) => {
    setSearchQuery(search.query);
    setListingType(search.type);
    
    navigate('/search-results', {
      state: {
        filters: {
          query: search.query,
          listingType: search.type,
        },
      },
    });
  };

  const removeSavedSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const handleCardClick = (id: string, type: 'property' | 'project' | 'land') => {
    navigate(`/${type}/${id}`);
  };

  const renderSpotlightCard = (property: Property) => (
    <div key={property.id} className="spotlight-row" onClick={() => handleCardClick(property.id, 'property')}>
      <div className="row-info">
        <p className="row-title">{property.title}</p>
        <p className="row-subtitle">{property.location}</p>
      </div>
      <span className="row-price">{formatPrice(property.price)}</span>
    </div>
  );

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-tabs">
            {['processes', 'help', 'properties'].map((tab) => (
              <button
                key={tab}
                className={`nav-tab ${activeHeaderTab === tab ? 'active' : ''}`}
                onClick={() => setActiveHeaderTab(activeHeaderTab === tab ? null : tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {activeHeaderTab && (
            <div className="nav-content">
              <div className="nav-content-header">
                <h3>{headerTabsContent[activeHeaderTab].title}</h3>
                <button 
                  className="nav-content-close"
                  onClick={() => setActiveHeaderTab(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="nav-content-description">{headerTabsContent[activeHeaderTab].content}</p>
              {headerTabsContent[activeHeaderTab].details && (
                <ul className="nav-content-list">
                  {headerTabsContent[activeHeaderTab].details?.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </nav>

      <header className="landing-hero">
        <aside className="hero-sidebar">
          <p className="sidebar-eyebrow">A REAL ESTATE MARKETPLACE</p>
          <h2 className="sidebar-title">
            Explore Oman Housing Bank
            <span>Curated Collections</span>
          </h2>
          <p className="sidebar-copy">
            High-trust listings, verified agents, and personalized recommendations tailored to your lifestyle.
          </p>
          <div className="sidebar-stats">
            {landingStats.map((stat) => (
              <div key={stat.label} className="sidebar-stat">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="hero-panel">
          <h1 className="hero-title"><b>Unlock Your Dream Home</b></h1>
          <p className="hero-subtitle">
            Search Verified Properties, Projects, and Land Across Oman
          </p>

          <form className="hero-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search by city, developer, or project name…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <select 
              value={listingType} 
              onChange={(event) => {
                const value = event.target.value as 'properties' | 'projects' | 'lands';
                setListingType(value);
              }}
            >
              <option value="properties">Properties</option>
              <option value="projects">Projects</option>
              <option value="lands">Lands</option>
            </select>
            <button type="submit">Search marketplace</button>
          </form>

          <div className="hero-saved-searches">
            <p>Your saved searches</p>
            {savedSearches.length > 0 ? (
              <div className="saved-searches-list">
                {savedSearches.map((search, index) => (
                  <span 
                    key={`${search.query}-${search.type}-${index}`}
                    onClick={() => handleSavedSearchClick(search)}
                    className="saved-search-item"
                  >
                    {search.query} · {search.type}
                    <button 
                      className="remove-search"
                      onClick={(e) => removeSavedSearch(index, e)}
                      aria-label="Remove saved search"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="saved-searches-empty">
                <span>No saved searches yet. Start searching to save your queries!</span>
              </div>
            )}
          </div>
        </section>

        <section className="hero-highlight">
          <h3>Most Popular Properties</h3>
          <div className="highlight-header">
            <span>Property</span>
            <span>Price</span>
          </div>
          <div className="highlight-body">
            {heroHighlights.map(renderSpotlightCard)}
            {heroHighlights.length === 0 && (
              <p className="hero-placeholder">Loading curated recommendations…</p>
            )}
          </div>
        </section>
      </header>

      {error && <p className="landing-error">{error}</p>}

      <section className="landing-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Featured</p>
            <h2>Featured Properties</h2>
          </div>
          <p className="section-note">Updated hourly using live data from the marketplace.</p>
        </div>
        <div className="cards-grid">
          {featuredProperties.map((property) => (
            <article
              key={property.id}
              className="spotlight-card"
              onClick={() => handleCardClick(property.id, 'property')}
            >
              <div className="card-image">
                <img 
                  src={getPropertyImageUrl(property.id, 0, 800, 600)}
                  alt={property.title}
                />
              </div>
              <div className="card-body">
                <p className="card-location">{property.location}</p>
                <h3>{property.title}</h3>
                <p className="card-price">{formatPrice(property.price)}</p>
                <div className="card-meta">
                  <span>🛏️ {property.bedrooms} beds</span>
                  <span>🚿 {property.bathrooms} baths</span>
                  <span>📐 {property.area} m²</span>
                </div>
                <button className="card-cta">View property</button>
              </div>
            </article>
          ))}
          {loading && <p className="section-loading">Fetching latest listings…</p>}
        </div>
      </section>

      <section className="landing-section two-column">
        <div>
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Popular</p>
              <h2>Projects Backed By Trusted Developers</h2>
            </div>
            <p className="section-note">Browse project timelines, amenities, and availability.</p>
          </div>
          <div className="cards-grid">
            {popularProjects.map((project) => (
              <article
                key={project.id}
                className="spotlight-card"
                onClick={() => handleCardClick(project.id, 'project')}
              >
                <div className="card-image">
                  <img 
                    src={getProjectImageUrl(project.id, 0, 800, 600)}
                    alt={project.title}
                  />
                </div>
                <div className="card-body">
                  <p className="card-location">{project.location}</p>
                  <h3>{project.title}</h3>
                  <p className="card-price">From {formatPrice(project.startingPrice)}</p>
                  <div className="card-meta">
                    <span>🧾 {project.availableUnits}/{project.totalUnits} units</span>
                    <span>📅 Completed {project.completionDate}</span>
                  </div>
                  <button className="card-cta">View project</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Popular</p>
              <h2>Land Opportunities</h2>
            </div>
            <p className="section-note">Track zoning, utilities, and access information.</p>
          </div>
          <div className="cards-grid">
            {popularLands.map((land) => (
              <article
                key={land.id}
                className="spotlight-card"
                onClick={() => handleCardClick(land.id, 'land')}
              >
                <div className="card-image">
                  <img 
                    src={getLandImageUrl(land.id, 0, 800, 600)}
                    alt={land.title}
                  />
                </div>
                <div className="card-body">
                  <p className="card-location">{land.location}</p>
                  <h3>{land.title}</h3>
                  <p className="card-price">{formatPrice(land.price)}</p>
                  <div className="card-meta">
                    <span>📐 {land.area} m²</span>
                    <span>🏷️ {land.zoning}</span>
                  </div>
                  <button className="card-cta">View land</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-header">
            <p className="footer-eyebrow">A REAL ESTATE MARKETPLACE</p>
          </div>
          <div className="footer-tabs">
            <button 
              className={`footer-tab ${activeFooterTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'about' ? null : 'about')}
            >
              About
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'role' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'role' ? null : 'role')}
            >
              Role
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'curators' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'curators' ? null : 'curators')}
            >
              Curators
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'history' ? null : 'history')}
            >
              History
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'resources' ? null : 'resources')}
            >
              Resources
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'legal' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'legal' ? null : 'legal')}
            >
              Legal
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'program' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'program' ? null : 'program')}
            >
              Program
            </button>
            <button 
              className={`footer-tab ${activeFooterTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveFooterTab(activeFooterTab === 'social' ? null : 'social')}
            >
              Social
            </button>
          </div>

          {/* Footer Content Panel */}
          {activeFooterTab && footerContent[activeFooterTab] && (
            <div className="footer-content-panel">
              <div className="footer-content-header">
                <h3>{footerContent[activeFooterTab].title}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setActiveFooterTab(null)}
                >
                  ✕
                </button>
              </div>
              <p className="footer-content-text">
                {footerContent[activeFooterTab].content}
              </p>
              {footerContent[activeFooterTab].details && (
                <ul className="footer-content-details">
                  {footerContent[activeFooterTab].details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Copyright */}
          <div className="footer-copyright">
            <p>© 2025 Oman Housing Bank (S.A.O.C). All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
