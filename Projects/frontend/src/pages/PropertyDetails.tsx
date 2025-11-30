import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PropertyDetails.css';
import { Property } from '../types';
import api from '../services/api';
import { getPropertyImageUrl, getDefaultImage } from '../utils/imageUtils';

// EXACT WIREFRAME IMPLEMENTATION - PROPERTY DETAILS PAGE
// 2-COLUMN LAYOUT: LEFT (Image Gallery) + RIGHT (Details)

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Generate multiple images for gallery based on property ID
  const getPropertyImages = (property: Property): string[] => {
    const imageCount = 6; // Generate 6 images for gallery
    const images: string[] = [];
    for (let i = 0; i < imageCount; i++) {
      images.push(getPropertyImageUrl(property.id, i));
    }
    return images;
  };

  const propertyImages = property ? getPropertyImages(property) : [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get token from localStorage (if authentication is implemented)
      const token = localStorage.getItem('access_token');
      
      await api.post('/agent-contact', {
        propertyId: Number(id),
        ...contactForm
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      alert('Contact request sent successfully!');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending contact request:', error);
      alert('Failed to send contact request. Please try again.');
    }
  };

  const handlePrevImage = () => {
    if (propertyImages && propertyImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? propertyImages.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (propertyImages && propertyImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === propertyImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₹${(price / 1000000).toFixed(2)} Million`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container">
        <h2>Property not found</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  const hasImages = propertyImages && propertyImages.length > 0;

  return (
    <div className="property-details">
      {/* SEARCH HEADER - Exact same as Landing Page */}
      <div className="search-header">
        <Link to="/" className="back-button">← Back</Link>
        <form className="search-container" onSubmit={handleSearch}>
          {/* Input placeholder: "Search by city, area, project…" */}
          <input
            type="text"
            className="search-input"
            placeholder="Search by city, area, or project name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Search icon button */}
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Property Title Section */}
      <div className="details-header">
        <h1 className="property-title">{property.title}</h1>
        <p className="property-subtitle">📍 {property.location}</p>
      </div>

      <div className="details-grid">
        {/* LEFT PANEL - EXACT WIREFRAME IMPLEMENTATION */}
        {/* Large image gallery box + horizontal row of thumbnails */}
        <div className="left-column">
          <div className="image-gallery">
            <div className="main-image">
              {hasImages ? (
                <>
                  <img
                    src={propertyImages[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultImage('property');
                    }}
                  />
                  {propertyImages.length > 1 && (
                    <>
                      <button className="nav-button prev" onClick={handlePrevImage}>
                        ❮
                      </button>
                      <button className="nav-button next" onClick={handleNextImage}>
                        ❯
                      </button>
                      <div className="image-counter">
                        {currentImageIndex + 1} / {propertyImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image-placeholder">
                  <span className="placeholder-icon">📷</span>
                  <p>No images available</p>
                </div>
              )}
            </div>

            {/* Below it, a horizontal row of small thumbnails */}
            {/* Clicking thumbnail updates the main image */}
            {hasImages && propertyImages.length > 1 && (
              <div className="thumbnail-strip">
                {propertyImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getDefaultImage('property');
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - EXACT WIREFRAME IMPLEMENTATION */}
        <div className="right-column">
          {/* Property title text (large, bold) */}
          {/* Price (clear, bold) */}
          {/* Location (smaller text) */}
          <div className="price-section">
            <div className="price-tag">{formatPrice(property.price)}</div>
            <div className="status-badge">{property.status}</div>
          </div>

          {/* Section: "Features" */}
          {/* List of bullet points or icons: Bedrooms, Bathrooms, Area, Balcony, Parking */}
          <div className="key-details">
            <h2>Features</h2>
            <div className="details-grid-info">
              <div className="detail-item">
                <span className="detail-icon">🛏️</span>
                <div>
                  <div className="detail-label">Bedrooms</div>
                  <div className="detail-value">{property.bedrooms}</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🚿</span>
                <div>
                  <div className="detail-label">Bathrooms</div>
                  <div className="detail-value">{property.bathrooms}</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📐</span>
                <div>
                  <div className="detail-label">Area</div>
                  <div className="detail-value">{property.area}m²</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏠</span>
                <div>
                  <div className="detail-label">Type</div>
                  <div className="detail-value">{property.type}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: "Description" */}
          {/* Multi-line paragraph describing the property */}
          <div className="description-section">
            <h2>Description</h2>
            <p>{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="features-section">
              <h2>Features & Amenities</h2>
              <ul className="features-list">
                {property.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-bullet">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Form */}
          <div className="contact-section">
            <h2>Contact Agent</h2>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Message (optional)"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              {/* Button: "Contact Agent" */}
              <button type="submit" className="contact-button">
                Contact Agent
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
