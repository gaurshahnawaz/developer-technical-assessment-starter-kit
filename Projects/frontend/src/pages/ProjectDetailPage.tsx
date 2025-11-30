import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../services/api';
import type { Project } from '../types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="detail-header">
        <div className="detail-image">
          {project.images && project.images.length > 0 ? (
            <img src={project.images[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            '🏗️'
          )}
        </div>
      </div>

      <div className="detail-content">
        <h1 className="detail-title">{project.title}</h1>
        <div className="detail-price">Starting from {formatPrice(project.startingPrice)}</div>
        <div className="card-location" style={{ fontSize: '1.2rem' }}>📍 {project.location}</div>
        <span className={`card-status status-${project.status}`}>{project.status}</span>

        <div className="detail-section">
          <h2>Project Details</h2>
          <div className="card-details" style={{ fontSize: '1.1rem' }}>
            <span className="card-detail">🏢 {project.totalUnits} Total Units</span>
            <span className="card-detail">✅ {project.availableUnits} Available</span>
            <span className="card-detail">🏗️ {project.developer}</span>
            {project.completionDate && (
              <span className="card-detail">📅 {formatDate(project.completionDate)}</span>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{project.description}</p>
        </div>

        {project.amenities && project.amenities.length > 0 && (
          <div className="detail-section">
            <h2>Amenities</h2>
            <ul className="amenities-list">
              {project.amenities.map((amenity, index) => (
                <li key={index}>✓ {amenity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
