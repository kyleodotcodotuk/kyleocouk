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

        <section className="widget">
          <h2 className="widget-heading">
            Welcome back <span className="material-icons">waving_hand</span>
          </h2>
          <hr />
          <p>Admin CMS is ready for development.</p>
        </section>
        
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
    </AdminLayout>
  );
}
