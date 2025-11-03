import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [project, setProject] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    image: '',
    gallery: [],
    liveUrl: '',
    githubUrl: '',
    category: 'web-design',
    status: 'published',
    featured: false,
    completedDate: ''
  });

  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (isEditing) {
      // Load project data for editing
      const savedProjects = localStorage.getItem('portfolioProjects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const projectToEdit = projects.find(p => p.id === parseInt(id));
        if (projectToEdit) {
          setProject(projectToEdit);
        }
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (field, value) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !project.technologies.includes(newTech.trim())) {
      handleInputChange('technologies', [...project.technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechnology = (tech) => {
    handleInputChange('technologies', project.technologies.filter(t => t !== tech));
  };

  const handleSave = () => {
    const savedProjects = localStorage.getItem('portfolioProjects');
    let projects = savedProjects ? JSON.parse(savedProjects) : [];
    
    if (isEditing) {
      // Update existing project
      projects = projects.map(p => p.id === parseInt(id) ? { ...project, id: parseInt(id) } : p);
    } else {
      // Create new project
      const newProject = {
        ...project,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      projects.push(newProject);
    }

    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    navigate('/admin/portfolio');
  };

  return (
    <AdminLayout>
      <div className="project-editor">
        <div className="editor-header">
          <div className="header-left">
            <button 
              className="btn btn-back"
              onClick={() => navigate('/admin/portfolio')}
            >
              <span className="material-icons">arrow_back</span>
              Back to Portfolio
            </button>
            <h1>{isEditing ? 'Edit Project' : 'Create New Project'}</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/admin/portfolio')}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <span className="material-icons">save</span>
              {isEditing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>

        <div className="editor-content">
          <div className="editor-main">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description for project cards"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Detailed Description</label>
                <textarea
                  value={project.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                  placeholder="Detailed project description, process, challenges, etc."
                  rows={8}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Technologies Used</h3>
              <div className="tech-input">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology (e.g., React, Node.js)"
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                />
                <button type="button" className="btn btn-icon" onClick={addTechnology}>
                  <span className="material-icons">add</span>
                </button>
              </div>
              <div className="tech-tags">
                {project.technologies.map(tech => (
                  <span key={tech} className="tech-tag">
                    {tech}
                    <button className="btn btn-icon" onClick={() => removeTechnology(tech)}>
                      <span className="material-icons">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Project Links</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Live URL</label>
                  <input
                    type="url"
                    value={project.liveUrl}
                    onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    value={project.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="editor-sidebar">
            <div className="form-section">
              <h3>Project Settings</h3>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={project.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="web-design">Web Design</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="ui-ux">UI/UX Design</option>
                  <option value="branding">Branding</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={project.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label>Completion Date</label>
                <input
                  type="date"
                  value={project.completedDate}
                  onChange={(e) => handleInputChange('completedDate', e.target.value)}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  Featured Project
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Featured Image</h3>
              <div className="image-upload">
                {project.image ? (
                  <div className="image-preview">
                    <img src={project.image} alt="Project preview" />
                    <button 
                      className="btn btn-danger remove-image"
                      onClick={() => handleInputChange('image', '')}
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="material-icons">add_photo_alternate</span>
                    <p>Add featured image</p>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      onBlur={(e) => handleInputChange('image', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}