import React, { useState, useEffect } from 'react';
import { initializeProjects } from '../data/projects';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Get available categories
  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'web-design', label: 'Web Design' },
    { value: 'mobile-app', label: 'Mobile Apps' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'branding', label: 'Branding' }
  ];

  useEffect(() => {
    // Initialize projects with default data if none exist
    initializeProjects();
    
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Only show published projects
        const publishedProjects = parsedProjects.filter(project => project.status === 'published');
        setProjects(publishedProjects);
        setFilteredProjects(publishedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter projects by category
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div className="container">
          <h1>My Portfolio</h1>
          <p>A showcase of my recent work and projects</p>
        </div>
      </div>

      <div className="portfolio-content">
        <div className="container">
          {/* Category Filter */}
          <div className="portfolio-filters">
            <h3>Filter by Category</h3>
            <div className="filter-buttons">
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          {selectedCategory === 'all' && (
            <div className="featured-projects">
              <h2>Featured Projects</h2>
              <div className="featured-grid">
                {projects.filter(project => project.featured).map(project => (
                  <div key={project.id} className="featured-project-card">
                    <div className="project-image">
                      <img src={project.image} alt={project.title} />
                      <div className="project-overlay">
                        <div className="project-links">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                              View Live
                            </a>
                          )}
                          <a href={`/portfolio/project-${project.slug}`} className="btn btn-secondary">
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="project-info">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-technologies">
                        {project.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="tech-tag more">+{project.technologies.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Projects Grid */}
          <div className="projects-section">
            <h2>
              {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.value === selectedCategory)?.label}
              <span className="project-count">({filteredProjects.length})</span>
            </h2>
            
            {filteredProjects.length === 0 ? (
              <div className="no-projects">
                <div className="no-projects-icon">📁</div>
                <h3>No projects found</h3>
                <p>There are no projects in this category yet.</p>
              </div>
            ) : (
              <div className="projects-grid">
                {filteredProjects.map(project => (
                  <div key={project.id} className="project-card">
                    <div className="project-image">
                      <img src={project.image} alt={project.title} />
                      <div className="project-category">{project.category.replace('-', ' ')}</div>
                    </div>
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-technologies">
                        {project.technologies.slice(0, 4).map(tech => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <div className="project-actions">
                        <a href={`/portfolio/project-${project.slug}`} className="btn btn-primary">
                          View Project
                        </a>
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}