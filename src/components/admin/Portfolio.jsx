import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { initializeProjects } from "../../data/projects";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current view based on URL
  const getCurrentView = useCallback(() => {
    const path = location.pathname;
    if (path.includes("/skills")) return "skills";
    return "projects";
  }, [location.pathname]);

  const [view, setView] = useState(() => getCurrentView());

  // Update view when URL changes
  useEffect(() => {
    setView(getCurrentView());
  }, [getCurrentView]);

  const handleViewChange = (newView) => {
    const basePath = "/admin/portfolio";
    const paths = {
      projects: `${basePath}/projects`,
      skills: `${basePath}/skills`,
    };
    navigate(paths[newView]);
  };

  useEffect(() => {
    // Initialize projects with default data if none exist
    initializeProjects();

    // Load projects from localStorage or API
    const savedProjects = localStorage.getItem("portfolioProjects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch {
        setProjects([]);
      }
    }
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="widget">
          <h2>Portfolio Management</h2>
          <div className="portfolio-tabs">
            <button
              className={`btn ${view === "projects" ? "active" : ""}`}
              onClick={() => handleViewChange("projects")}
            >
              <span className="material-icons">work</span>
              Projects
            </button>
            <button
              className={`btn ${view === "skills" ? "active" : ""}`}
              onClick={() => handleViewChange("skills")}
            >
              <span className="material-icons">psychology</span>
              Skills
            </button>
          </div>
          {view === "projects" && (
            <div className="projects-section">
              <h3>Portfolio Projects</h3>

              {projects.length === 0 ? (
                <div className="empty-state">
                  <span className="material-icons">work_outline</span>
                  <h3>No projects yet</h3>
                  <p>Create your first portfolio project to get started</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="project-card">
                      <div className="project-image">
                        {project.image ? (
                          <img height="100px" src={project.image} alt={project.title} />
                        ) : (
                          <div className="placeholder-image">
                            <span className="material-icons">image</span>
                          </div>
                        )}
                      </div>
                      <div className="project-content">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <ul className="project-tags">
                          {project.technologies?.map((tech) => (
                            <li key={tech}>
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "skills" && (
            <div className="skills-section">
              <div className="section-header">
                <h2>Skills & Expertise</h2>
                <button className="btn btn-primary">
                  <span className="material-icons">add</span>
                  Add Skill
                </button>
              </div>
              <div className="skills-grid">
                <div className="skill-category">
                  <h3>Frontend Development</h3>
                  <div className="skills-list">
                    <div className="skill-item">
                      <span>React</span>
                      <div className="skill-level">
                        <div
                          className="skill-bar"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span>JavaScript</span>
                      <div className="skill-level">
                        <div
                          className="skill-bar"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span>CSS/SCSS</span>
                      <div className="skill-level">
                        <div
                          className="skill-bar"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
