import { useNavigate } from 'react-router-dom';
import type { Land } from '../types';
import { getLandImageUrl } from '../utils/imageUtils';

interface LandCardProps {
  land: Land;
}

export default function LandCard({ land }: LandCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card featured-card" onClick={() => navigate(`/lands/${land.id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-image">
        <img src={getLandImageUrl(land.id, 0, 400, 300)} alt={land.title} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{land.title}</h3>
        <div className="card-price-large">{formatPrice(land.price)}</div>
        <div className="card-location">📍 {land.location}</div>
        <div className="card-specs">
          <span>📐 {land.area}m²</span>
          <span>🏗️ {land.zoning}</span>
        </div>
        {land.status && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <span className="badge" style={{ 
              background: land.status === 'available' ? 'var(--gradient-success)' : 'var(--color-gray-300)',
              color: 'white',
              textTransform: 'capitalize'
            }}>
              {land.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
