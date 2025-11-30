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
      <header className="landing-hero">
        <aside className="hero-sidebar">
          <p className="sidebar-eyebrow">A REAL ESTATE MARKETPLACE</p>
          <h2 className="sidebar-title">
            Explore Oman Housing Bank
            <span>curated collections</span>
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
          <p className="hero-eyebrow">Unlock your dream home</p>
          <h1 className="hero-title">Search Verified Properties, Projects, and Land Across Oman</h1>
          <p className="hero-subtitle">
            Use the advanced search and smart filters to surface offerings that match your budget, lifestyle, and location preferences.
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
    </div>
  );
};

export default LandingPage;
