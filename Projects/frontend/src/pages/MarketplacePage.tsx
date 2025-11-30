import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './MarketplacePage.css';
import { Property, Project, Land } from '../types';
import api from '../services/api';
import { getPropertyImageUrl, getProjectImageUrl, getLandImageUrl } from '../utils/imageUtils';

const MarketplacePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'properties' | 'projects' | 'lands'>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    status: '',
  });

  useEffect(() => {
    // Load data based on navigation state or fetch all
    const state = location.state as any;
    if (state?.filters) {
      // Set filters from search
      const searchFilters = state.filters;
      setFilters({
        searchQuery: searchFilters.query || '',
        minPrice: searchFilters.minPrice || '',
        maxPrice: searchFilters.maxPrice || '',
        location: searchFilters.location || '',
        bedrooms: searchFilters.bedrooms || '',
        bathrooms: searchFilters.bathrooms || '',
        propertyType: searchFilters.type || '',
        status: searchFilters.status || '',
      });
      setActiveTab(searchFilters.listingType || 'all');
      
      // Fetch filtered results
      fetchFilteredListings(searchFilters);
    } else {
      // Fetch all listings
      fetchAllListings();
    }
  }, [location]);

  const fetchFilteredListings = async (searchFilters: any) => {
    try {
      setLoading(true);

      if (searchFilters.listingType === 'all' || searchFilters.listingType === 'properties') {
        const queryParams = new URLSearchParams();
        if (searchFilters.query) queryParams.append('q', searchFilters.query);
        if (searchFilters.type) queryParams.append('type', searchFilters.type);
        if (searchFilters.minPrice) queryParams.append('minPrice', searchFilters.minPrice);
        if (searchFilters.maxPrice) queryParams.append('maxPrice', searchFilters.maxPrice);
        if (searchFilters.location) queryParams.append('location', searchFilters.location);
        if (searchFilters.bedrooms) queryParams.append('bedrooms', searchFilters.bedrooms);
        if (searchFilters.bathrooms) queryParams.append('bathrooms', searchFilters.bathrooms);
        if (searchFilters.minArea) queryParams.append('minArea', searchFilters.minArea);
        if (searchFilters.maxArea) queryParams.append('maxArea', searchFilters.maxArea);
        if (searchFilters.status) queryParams.append('status', searchFilters.status);

        const response = await api.get(`/properties?${queryParams.toString()}`);
        setProperties(response.data.data || response.data || []);
      }

      if (searchFilters.listingType === 'all' || searchFilters.listingType === 'projects') {
        const response = await api.get('/projects');
        setProjects(response.data || []);
      }

      if (searchFilters.listingType === 'all' || searchFilters.listingType === 'lands') {
        const response = await api.get('/lands');
        setLands(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching filtered listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllListings = async () => {
    try {
      setLoading(true);
      const [propertiesRes, projectsRes, landsRes] = await Promise.all([
        api.get('/properties'),
        api.get('/projects'),
        api.get('/lands'),
      ]);

      setProperties(propertiesRes.data.data || propertiesRes.data || []);
      setProjects(projectsRes.data || []);
      setLands(landsRes.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Auto-apply filters after a short delay for better UX
    setTimeout(() => {
      applyFiltersWithState(newFilters);
    }, 300);
  };

  const applyFiltersWithState = async (currentFilters: typeof filters) => {
    try {
      setLoading(true);
      
      if (activeTab === 'all' || activeTab === 'properties') {
        const queryParams = new URLSearchParams();
        if (currentFilters.searchQuery) queryParams.append('q', currentFilters.searchQuery);
        if (currentFilters.propertyType) queryParams.append('type', currentFilters.propertyType);
        if (currentFilters.minPrice) queryParams.append('minPrice', currentFilters.minPrice);
        if (currentFilters.maxPrice) queryParams.append('maxPrice', currentFilters.maxPrice);
        if (currentFilters.location) queryParams.append('location', currentFilters.location);
        if (currentFilters.bedrooms) queryParams.append('bedrooms', currentFilters.bedrooms);
        if (currentFilters.bathrooms) queryParams.append('bathrooms', currentFilters.bathrooms);
        if (currentFilters.status) queryParams.append('status', currentFilters.status);

        const response = await api.get(`/properties?${queryParams.toString()}`);
        setProperties(response.data.data || response.data || []);
      } else {
        setProperties([]);
      }

      if (activeTab === 'all' || activeTab === 'projects') {
        const response = await api.get('/projects');
        setProjects(response.data || []);
      } else {
        setProjects([]);
      }

      if (activeTab === 'all' || activeTab === 'lands') {
        const response = await api.get('/lands');
        setLands(response.data || []);
      } else {
        setLands([]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      status: '',
    });
    fetchAllListings();
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getAllItems = () => {
    let items: any[] = [];
    if (activeTab === 'all' || activeTab === 'properties') {
      items = [...items, ...properties.map(p => ({ ...p, itemType: 'property' }))];
    }
    if (activeTab === 'all' || activeTab === 'projects') {
      items = [...items, ...projects.map(p => ({ ...p, itemType: 'project' }))];
    }
    if (activeTab === 'all' || activeTab === 'lands') {
      items = [...items, ...lands.map(l => ({ ...l, itemType: 'land' }))];
    }
    return items;
  };

  const getImageUrl = (item: any) => {
    const isProperty = item.itemType === 'property';
    const isProject = item.itemType === 'project';
    
    if (isProperty) {
      return getPropertyImageUrl(item.id, 0, 800, 600);
    } else if (isProject) {
      return getProjectImageUrl(item.id, 0, 800, 600);
    } else {
      return getLandImageUrl(item.id, 0, 800, 600);
    }
  };

  const getDefaultImage = (itemType: string) => {
    if (itemType === 'property') {
      return getPropertyImageUrl('default', 0, 800, 600);
    } else if (itemType === 'project') {
      return getProjectImageUrl('default', 0, 800, 600);
    } else {
      return getLandImageUrl('default', 0, 800, 600);
    }
  };

  const allItems = getAllItems();
  const totalCount = allItems.length;

  return (
    <div className="marketplace-page">
      {/* Simple Top Bar */}
      <div className="top-bar">
        <button onClick={() => navigate('/')} className="back-btn">← Home</button>
        <h1 className="page-title">Unlock Your Dream Home</h1>
        <span className="results-count">{totalCount} Results</span>
      </div>

      <div className="marketplace-container">
        {/* Left Sidebar - Filters */}
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h2>Filters</h2>
            <button onClick={resetFilters} className="reset-link">Clear All</button>
          </div>

          <div className="filter-section">
            <label className="filter-label">Search Listings</label>
            <input
              type="text"
              name="searchQuery"
              className="filter-input"
              placeholder="Search by keyword..."
              value={filters.searchQuery}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="price-range-inputs">
              <input
                type="number"
                name="minPrice"
                className="filter-input filter-input-small"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                name="maxPrice"
                className="filter-input filter-input-small"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Location</label>
            <input
              type="text"
              name="location"
              className="filter-input"
              placeholder="City or Area"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-section">
            <label className="filter-label">Bedrooms</label>
            <select
              name="bedrooms"
              className="filter-select"
              value={filters.bedrooms}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Bathrooms</label>
            <select
              name="bathrooms"
              className="filter-select"
              value={filters.bathrooms}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Property Type</label>
            <select
              name="propertyType"
              className="filter-select"
              value={filters.propertyType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
              <option value="studio">Studio</option>
              <option value="duplex">Duplex</option>
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Status</label>
            <select
              name="status"
              className="filter-select"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Any Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="marketplace-content">
          {/* Tabs */}
          <div className="listing-tabs">
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Listings
            </button>
            <button
              className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              Properties ({properties.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects ({projects.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'lands' ? 'active' : ''}`}
              onClick={() => setActiveTab('lands')}
            >
              Lands ({lands.length})
            </button>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading listings...</p>
            </div>
          ) : allItems.length === 0 ? (
            <div className="empty-state">
              <h3>No listings found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={resetFilters} className="reset-button">Reset Filters</button>
            </div>
          ) : (
            <div className="listings-grid">
              {allItems.map((item) => {
                const isProperty = item.itemType === 'property';
                const isProject = item.itemType === 'project';
                const isLand = item.itemType === 'land';

                return (
                  <Link
                    key={`${item.itemType}-${item.id}`}
                    to={isProperty ? `/property/${item.id}` : isProject ? `/project/${item.id}` : `/land/${item.id}`}
                    className="listing-card"
                  >
                    <div className="card-image-container">
                      <img 
                        src={getImageUrl(item)} 
                        alt={item.title} 
                        className="card-image"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = getDefaultImage(item.itemType);
                          target.onerror = null; // Prevent infinite loop
                        }}
                      />
                      <div className="card-badge-top">{item.status}</div>
                      <div className="card-type-badge">
                        {isProperty ? 'Property' : isProject ? 'Project' : 'Land'}
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-location">📍 {item.location}</p>
                      
                      {isProperty && (
                        <>
                          <p className="card-price">{formatPrice(item.price)}</p>
                          <div className="card-features">
                            <span>🛏️ {item.bedrooms} beds</span>
                            <span>🚿 {item.bathrooms} baths</span>
                            <span>📐 {item.area} sq ft</span>
                          </div>
                          <div className="card-property-type">{item.type}</div>
                        </>
                      )}
                      
                      {isProject && (
                        <>
                          <p className="card-developer">🏢 {item.developer}</p>
                          <p className="card-price">From {formatPrice(item.startingPrice)}</p>
                          <div className="card-units">
                            {item.availableUnits}/{item.totalUnits} units available
                          </div>
                        </>
                      )}
                      
                      {isLand && (
                        <>
                          <p className="card-price">{formatPrice(item.price)}</p>
                          <div className="card-features">
                            <span>📐 {item.area} sq m</span>
                            <span>🏷️ {item.zoning}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MarketplacePage;
