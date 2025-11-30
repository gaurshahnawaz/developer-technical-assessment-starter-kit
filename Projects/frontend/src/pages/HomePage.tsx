import { useState, useEffect } from 'react';
import { getProperties, getLands, getProjects } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import LandCard from '../components/LandCard';
import ProjectCard from '../components/ProjectCard';
import type { Property, Land, Project } from '../types';

type ViewType = 'properties' | 'lands' | 'projects';

export default function HomePage() {
  const [view, setView] = useState<ViewType>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Only load if we don't have data for this view
      if (view === 'properties' && properties.length > 0) return;
      if (view === 'lands' && lands.length > 0) return;
      if (view === 'projects' && projects.length > 0) return;

      setLoading(true);
      setError(null);
      try {
        switch (view) {
          case 'properties':
            const propsData = await getProperties();
            setProperties(propsData);
            break;
          case 'lands':
            const landsData = await getLands();
            setLands(landsData);
            break;
          case 'projects':
            const projectsData = await getProjects();
            setProjects(projectsData);
            break;
        }
      } catch (err) {
        setError('Failed to load data. Please ensure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const formatPriceLabel = (price: number) => {
    if (price >= 10000000) return `O$${(price / 10000000).toFixed(2)}M`;
    if (price >= 100000) return `O$${(price / 100000).toFixed(0)}L`;
    return `O$${price.toLocaleString()}`;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏠 Real Estate Platform</h1>
        <p>Oman Housing Bank - Find Your Dream Property</p>
        <nav className="nav">
          <button
            className={view === 'properties' ? 'active' : ''}
            onClick={() => setView('properties')}
          >
            Properties
          </button>
          <button
            className={view === 'lands' ? 'active' : ''}
            onClick={() => setView('lands')}
          >
            Lands
          </button>
          <button
            className={view === 'projects' ? 'active' : ''}
            onClick={() => setView('projects')}
          >
            Projects
          </button>
        </nav>
      </header>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="grid">
          {view === 'properties' && properties.map(property => (
            <PropertyCard
              key={property.id}
              id={property.id}
              thumbnail={property.images?.[0] ?? ''}
              title={property.title}
              priceRange={formatPriceLabel(property.price)}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
            />
          ))}
          {view === 'lands' && lands.map(land => (
            <LandCard key={land.id} land={land} />
          ))}
          {view === 'projects' && projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {!loading && !error && view === 'properties' && properties.length === 0 && (
        <div className="loading">No properties available</div>
      )}
      {!loading && !error && view === 'lands' && lands.length === 0 && (
        <div className="loading">No lands available</div>
      )}
      {!loading && !error && view === 'projects' && projects.length === 0 && (
        <div className="loading">No projects available</div>
      )}
    </div>
  );
}
