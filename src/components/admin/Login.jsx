import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../data/users";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const users = getAllUsers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!disclaimerAccepted) {
      alert("Please accept the disclaimer to proceed.");
      return;
    }

    setLoading(true);

    const success = await login(username, password);

    if (success) {
      navigate("/admin");
    } else {
      setError("Invalid username or password. Please try again.");
    }

    setLoading(false);
  };

  const fillUserCredentials = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError("");
  };

  return (
    <div className="loginPage">
      <div className="login-form">
        <h2>
          Sign into the Greycat Content Management System <hr />
        </h2>

        {users.length > 0 && (
          <div className="quick-fill-buttons">
            <p className="quick-fill-label">Quick Login (Development Only):</p>
            <div className="user-buttons">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`btn quick-fill-btn ${user.role.toLowerCase()}`}
                  onClick={() => fillUserCredentials(user)}
                  title={`Login as ${user.name} (${user.role})`}
                >
                  <span className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                  </span>
                  <span className="material-icons">
                    {user.role === "ADMIN" ? "admin_panel_settings" : "person"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          <div className="disclaimer">
            <label htmlFor="disclaimer">
              <input
                type="checkbox"
                id="disclaimer"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
              />
              I accept this is not for misuse or plagerism.
            </label>
          </div>

          {error && <div className="btn btn-danger error-message">{error}</div>}

          <div className="login-btns">
            <button type="submit" disabled={loading} className="btn btn-login">
              <span className="material-icons">person</span>{" "}
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              disabled={loading}
              className="btn btn-primary"
            >
              <span className="material-icons">login</span>{" "}
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
