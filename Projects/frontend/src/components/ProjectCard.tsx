import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';
import { getProjectImageUrl } from '../utils/imageUtils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card featured-card" onClick={() => navigate(`/projects/${project.id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-image">
        <img src={getProjectImageUrl(project.id, 0, 400, 300)} alt={project.title} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <div className="card-price-large">From {formatPrice(project.startingPrice)}</div>
        <div className="card-location">📍 {project.location}</div>
        <div className="card-specs">
          <span>🏢 {project.totalUnits} units</span>
          <span>✅ {project.availableUnits} available</span>
        </div>
        {project.status && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <span className="badge" style={{ 
              background: project.status === 'under-construction' ? 'var(--gradient-accent)' : 
                         project.status === 'completed' ? 'var(--gradient-success)' : 'var(--color-gray-300)',
              color: 'white',
              textTransform: 'capitalize'
            }}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
