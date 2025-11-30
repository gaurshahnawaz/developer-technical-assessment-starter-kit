import React, { useState } from 'react';
import './AdvancedSearch.css';

interface SearchFilters {
  query: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
  status: string;
  listingType: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    status: '',
    listingType: 'all',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      query: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      status: '',
      listingType: 'all',
    };
    setFilters(resetFilters);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="advanced-search">
      <form onSubmit={handleSubmit} className="search-form">
        {/* Main Search Bar */}
        <div className="search-main">
          <div className="search-input-group">
            <input
              type="text"
              name="query"
              className="search-input-main"
              placeholder="Search by city, area, project name, or keyword..."
              value={filters.query}
              onChange={handleInputChange}
            />
            <select
              name="listingType"
              className="listing-type-select"
              value={filters.listingType}
              onChange={handleInputChange}
            >
              <option value="all">All Types</option>
              <option value="properties">Properties</option>
              <option value="projects">Projects</option>
              <option value="lands">Lands</option>
            </select>
          </div>
          <div className="search-actions">
            <button type="submit" className="btn-search">
              🔍 Search
            </button>
            <button
              type="button"
              className={`btn-filters ${isExpanded ? 'active' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              ⚙️ Filters {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {isExpanded && (
          <div className="filters-panel">
            <div className="filters-grid">
              {/* Property Type */}
              <div className="filter-group">
                <label>Property Type</label>
                <select name="type" value={filters.type} onChange={handleInputChange}>
                  <option value="">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="studio">Studio</option>
                  <option value="duplex">Duplex</option>
                </select>
              </div>

              {/* Status */}
              <div className="filter-group">
                <label>Status</label>
                <select name="status" value={filters.status} onChange={handleInputChange}>
                  <option value="">Any Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              {/* Location */}
              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Mumbai, Delhi"
                  value={filters.location}
                  onChange={handleInputChange}
                />
              </div>

              {/* Bedrooms */}
              <div className="filter-group">
                <label>Bedrooms</label>
                <select name="bedrooms" value={filters.bedrooms} onChange={handleInputChange}>
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="filter-group">
                <label>Bathrooms</label>
                <select name="bathrooms" value={filters.bathrooms} onChange={handleInputChange}>
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="filter-group filter-group-wide">
                <label>Price Range</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                  />
                  <span className="range-separator">to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Area Range */}
              <div className="filter-group filter-group-wide">
                <label>Area (sq ft)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    name="minArea"
                    placeholder="Min Area"
                    value={filters.minArea}
                    onChange={handleInputChange}
                  />
                  <span className="range-separator">to</span>
                  <input
                    type="number"
                    name="maxArea"
                    placeholder="Max Area"
                    value={filters.maxArea}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button type="button" onClick={handleReset} className="btn-reset">
                Reset Filters
              </button>
              <button type="submit" className="btn-apply-filters">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearch;
