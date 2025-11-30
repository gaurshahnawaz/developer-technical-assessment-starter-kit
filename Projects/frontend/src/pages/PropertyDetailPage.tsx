import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../services/api';
import type { Property } from '../types';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProperty(id);
        setProperty(data);
      } catch (err) {
        setError('Failed to load property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="detail-header">
        <div className="detail-image">
          {property.images && property.images.length > 0 ? (
            <img src={property.images[0]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            '🏠'
          )}
        </div>
      </div>

      <div className="detail-content">
        <h1 className="detail-title">{property.title}</h1>
        <div className="detail-price">{formatPrice(property.price)}</div>
        <div className="card-location" style={{ fontSize: '1.2rem' }}>📍 {property.location}</div>
        <span className={`card-status status-${property.status}`}>{property.status}</span>

        <div className="detail-section">
          <h2>Property Details</h2>
          <div className="card-details" style={{ fontSize: '1.1rem' }}>
            <span className="card-detail">🛏️ {property.bedrooms} Bedrooms</span>
            <span className="card-detail">🚿 {property.bathrooms} Bathrooms</span>
            <span className="card-detail">📐 {property.area} m²</span>
            <span className="card-detail">🏷️ {property.type}</span>
          </div>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{property.description}</p>
        </div>

        {property.features && property.features.length > 0 && (
          <div className="detail-section">
            <h2>Features</h2>
            <ul className="features-list">
              {property.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
