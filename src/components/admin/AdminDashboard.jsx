import React, { useState, useEffect } from "react";
import { usersAPI } from "../../data/users";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = usersAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard">
        {/* Full sized widget */}
        <div className="fullWidth">
          <section className="widget">
            <h2 className="widget-heading">
              Welcome back <span className="material-icons">waving_hand</span>
            </h2>
            <hr />
            <p>Admin CMS is ready for development.</p>
          </section>
        </div>
        {/* 50 50 SPLIT */}
        <div className="fullWidth">
          <div className="column-wrapper">
            {/* LEFT SIDE */}
            <div className="left-column">
              {currentUser ? (
                <section className="widget">
                  <h2 className="widget-heading">
                    Next CMS tasks <span className="material-icons">check</span>
                  </h2>
                  <hr />
                  <ul>
                    <li>Projects</li>
                    <li>Find what to use for skills page</li>
                    <li>Bare bones usability</li>
                    <li>Login error stuff</li>
                  </ul>
                </section>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            {/* RIGHT SIDE */}
            <div className="right-column">
              <section className="widget">
                <h2 className="widget-heading">
                  Error handling <span className="material-icons">check</span>
                </h2>
                <hr />
                <div role="alert" className="alert alert-danger">
                  <span className="material-icons">warning</span>
                  This is an alert showing a denial or hard problem
                </div>

                <div role="alert" className="alert alert-warning">
                  <span className="material-icons">assignment_late</span>
                  This is an alert showing an error, like a soft warning
                </div>

                <div role="alert" className="alert alert-success">
                  <span className="material-icons">check</span>
                  This is an alert showing the action was successful
                </div>

                <div role="alert" className="alert alert-info">
                  <span className="material-icons">info</span>
                  This is an alert showing information that might be useful
                </div>
              </section>
            </div>
          </div>
          {/* Thirds */}
          <div className="column-wrapper">
            <div className="third-column">
              <div className="widget">
                 <h2 className="widget-heading">
                  1/3rd <span className="material-icons">view_column</span>
                </h2>
                <div className="alert alert-info">test</div>
              </div>
            </div>
            <div className="third-column">
              <div className="widget">
                 <h2 className="widget-heading">
                  1/3rd <span className="material-icons">view_column</span>
                </h2>
                <div className="alert alert-info">test</div>
              </div>
            </div>
             <div className="third-column">
              <div className="widget">
                 <h2 className="widget-heading">
                  1/3rd <span className="material-icons">view_column</span>
                </h2>
                <div className="alert alert-info">test</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
