import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';
import { getPropertyImageUrl } from '../utils/imageUtils';

// REUSABLE COMPONENT: PopularPropertyCard & FeaturedPropertyCard
// Used in: Most Popular Properties section (Left Sidebar) & Featured Properties (Center)

interface PropertyCardProps {
  id: string;
  thumbnail: string;
  title?: string;
  priceRange: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  variant?: 'popular' | 'featured';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  thumbnail,
  title,
  priceRange,
  location,
  bedrooms,
  bathrooms,
  area,
  variant = 'popular',
}) => {
  if (variant === 'popular') {
    // POPULAR PROPERTY CARD (Left Sidebar)
    return (
      <Link to={`/property/${id}`} className="property-card popular-card">
        {/* Small thumbnail placeholder box */}
        <div className="card-thumbnail">
          <img src={getPropertyImageUrl(id, 0, 200, 150)} alt={location} />
        </div>
        
        <div className="card-info">
          {/* Price range (e.g., "₹40L – ₹60L") */}
          <div className="card-price">{priceRange}</div>
          
          {/* Location (e.g., "Mumbai") */}
          <div className="card-location">{location}</div>
        </div>
      </Link>
    );
  }

  // FEATURED PROPERTY CARD (Center Content)
  return (
    <Link to={`/property/${id}`} className="property-card featured-card">
      {/* Small image */}
      <div className="card-image">
        <img src={getPropertyImageUrl(id, 0, 400, 300)} alt={title} />
      </div>
      
      <div className="card-content">
        {/* Property name */}
        {title && <h3 className="card-title">{title}</h3>}
        
        {/* Price */}
        <div className="card-price-large">{priceRange}</div>
        
        {/* Location */}
        <div className="card-location">📍 {location}</div>
        
        {/* Property specs */}
        {(bedrooms || bathrooms || area) && (
          <div className="card-specs">
            {bedrooms && <span>🛏️ {bedrooms} beds</span>}
            {bathrooms && <span>🚿 {bathrooms} baths</span>}
            {area && <span>📐 {area}m²</span>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
