import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLand } from '../services/api';
import type { Land } from '../types';
import './LandDetailPage.css';
import { getLandImageUrl, getDefaultImage } from '../utils/imageUtils';

export default function LandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [land, setLand] = useState<Land | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const loadLand = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getLand(id);
        setLand(data);
      } catch (err) {
        setError('Failed to load land details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLand();
  }, [id]);

  const getLandImages = (land: Land): string[] => {
    const imageCount = 6;
    const images: string[] = [];
    for (let i = 0; i < imageCount; i++) {
      images.push(getLandImageUrl(land.id, i));
    }
    return images;
  };

  const landImages = land ? getLandImages(land) : [];

  const handlePrevImage = () => {
    if (landImages && landImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? landImages.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (landImages && landImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === landImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Contact request sent successfully!');
    setContactForm({ name: '', email: '', phone: '', message: '' });
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
        <p>Loading land details...</p>
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="error-container">
        <h2>{error || 'Land not found'}</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  const hasImages = landImages && landImages.length > 0;

  return (
    <div className="land-details">
      {/* Search Header */}
      <div className="search-header">
        <Link to="/" className="back-button">← Back</Link>
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by city, area, or land type…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Land Title Section */}
      <div className="details-header">
        <h1 className="land-title">{land.title}</h1>
        <p className="land-subtitle">📍 {land.location}</p>
      </div>

      <div className="details-grid">
        {/* LEFT PANEL - Image Gallery */}
        <div className="left-column">
          <div className="image-gallery">
            <div className="main-image">
              {hasImages ? (
                <>
                  <img
                    src={landImages[currentImageIndex]}
                    alt={`${land.title} - Image ${currentImageIndex + 1}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultImage('land');
                    }}
                  />
                  {landImages.length > 1 && (
                    <>
                      <button className="nav-button prev" onClick={handlePrevImage}>
                        ❮
                      </button>
                      <button className="nav-button next" onClick={handleNextImage}>
                        ❯
                      </button>
                      <div className="image-counter">
                        {currentImageIndex + 1} / {landImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image-placeholder">
                  <span className="placeholder-icon">🏞️</span>
                  <p>No images available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasImages && landImages.length > 1 && (
              <div className="thumbnail-strip">
                {landImages.map((image, index) => (
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
                        target.src = getDefaultImage('land');
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Details */}
        <div className="right-column">
          <div className="price-section">
            <div className="price-tag">{formatPrice(land.price)}</div>
            <div className="status-badge">{land.status}</div>
          </div>

          {/* Land Specifications */}
          <div className="key-details">
            <h2>Land Specifications</h2>
            <div className="details-grid-info">
              <div className="detail-item">
                <span className="detail-icon">📐</span>
                <div>
                  <div className="detail-label">Total Area</div>
                  <div className="detail-value">{land.area} m²</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏗️</span>
                <div>
                  <div className="detail-label">Zoning</div>
                  <div className="detail-value">{land.zoning}</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{land.location}</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">✓</span>
                <div>
                  <div className="detail-label">Status</div>
                  <div className="detail-value">{land.status}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>Description</h2>
            <p>{land.description}</p>
          </div>

          {/* Features */}
          {land.features && land.features.length > 0 && (
            <div className="features-section">
              <h2>Features & Amenities</h2>
              <ul className="features-list">
                {land.features.map((feature, index) => (
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
            <h2>Inquire About This Land</h2>
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
              <button type="submit" className="contact-button">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
