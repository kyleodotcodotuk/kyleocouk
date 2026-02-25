import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initializeProjects } from '../data/projects';

export default function ProjectDetailPage() {
  const { slug: fullSlug } = useParams();
  const navigate = useNavigate();
  // Extract the actual slug by removing the "project-" prefix
  const slug = fullSlug?.startsWith('project-') ? fullSlug.slice(8) : fullSlug;
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize projects with default data if none exist
    initializeProjects();
    
    // Load project by slug
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        const foundProject = projects.find(p => p.slug === slug && p.status === 'published');
        
        if (foundProject) {
          setProject(foundProject);
          
          // Find related projects (same category, excluding current)
          const related = projects
            .filter(p => 
              p.category === foundProject.category && 
              p.id !== foundProject.id && 
              p.status === 'published'
            )
            .slice(0, 3);
          setRelatedProjects(related);
        } else {
          // Project not found
          navigate('/portfolio');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        navigate('/portfolio');
      }
    } else {
      navigate('/portfolio');
    }
    setLoading(false);
  }, [slug, navigate]);

  const nextImage = () => {
    if (project?.gallery) {
      setCurrentImageIndex((prev) => 
        prev === project.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.gallery) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.gallery.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="project-loading">
        <div className="loading-spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/portfolio')} className="btn btn-primary">
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Project Header */}
      <div className="project-hero">
        <div className="container">
          <nav className="breadcrumb">
            <button onClick={() => navigate('/portfolio')} className="breadcrumb-link">
              Portfolio
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{project.title}</span>
          </nav>
          
          <div className="project-hero-content">
            <div className="project-info">
              <div className="project-category">{project.category.replace('-', ' ')}</div>
              <h1>{project.title}</h1>
              <p className="project-description">{project.description}</p>
              
              <div className="project-meta">
                <div className="meta-item">
                  <strong>Completed:</strong> {new Date(project.completedDate).toLocaleDateString()}
                </div>
                <div className="meta-item">
                  <strong>Technologies:</strong>
                  <div className="tech-list">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="project-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <span className="btn-icon">🔗</span>
                    View Live Site
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <span className="btn-icon">📱</span>
                    View Code
                  </a>
                )}
              </div>
            </div>

            <div className="project-hero-image">
              <img src={project.image} alt={project.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Project Gallery */}
      {project.gallery && project.gallery.length > 1 && (
        <div className="project-gallery">
          <div className="container">
            <h2>Project Gallery</h2>
            <div className="gallery-main">
              <div className="gallery-viewer">
                <button className="gallery-nav prev" onClick={prevImage}>‹</button>
                <img 
                  src={project.gallery[currentImageIndex]} 
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                />
                <button className="gallery-nav next" onClick={nextImage}>›</button>
              </div>
              <div className="gallery-thumbnails">
                {project.gallery.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Details */}
      <div className="project-details">
        <div className="container">
          <div className="details-content">
            <h2>Project Overview</h2>
            <div className="project-description-long">
              {project.longDescription.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {project.featured && (
              <div className="featured-badge">
                <span className="badge">⭐ Featured Project</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="related-projects">
          <div className="container">
            <h2>Related Projects</h2>
            <div className="related-grid">
              {relatedProjects.map(relatedProject => (
                <div key={relatedProject.id} className="related-project-card">
                  <div className="project-image">
                    <img src={relatedProject.image} alt={relatedProject.title} />
                  </div>
                  <div className="project-content">
                    <h3>{relatedProject.title}</h3>
                    <p>{relatedProject.description}</p>
                    <button 
                      onClick={() => navigate(`/portfolio/project-${relatedProject.slug}`)}
                      className="btn btn-outline"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Portfolio */}
      <div className="back-to-portfolio">
        <div className="container">
          <button onClick={() => navigate('/portfolio')} className="btn btn-primary">
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}