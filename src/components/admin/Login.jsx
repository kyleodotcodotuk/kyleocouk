import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, DEMO_CREDENTIALS } from "../../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError(
        `Those details didn't match. Try "${DEMO_CREDENTIALS.username}" / "${DEMO_CREDENTIALS.password}".`
      );
    }
  };

  const fillDemoCredentials = () => {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  return (
    <div className="loginPage">
      <div className="login-form">
        <h2>
          Sign into the Grey Cat Content Management System <hr />
        </h2>

        <div className="alert alert-info">
          <span className="material-icons" aria-hidden="true">info</span>
          <p>
            This CMS is a front-end showcase. There's no server behind it, and
            any edits stay in your browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder={DEMO_CREDENTIALS.username}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder={DEMO_CREDENTIALS.password}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          {error && (
            <div id="login-error" role="alert" className="alert alert-danger">
              <span className="material-icons" aria-hidden="true">warning</span>
              {error}
            </div>
          )}

          <div className="login-btns">
            <button type="submit" className="btn btn-login">
              <span className="material-icons" aria-hidden="true">login</span>
              Sign in
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fillDemoCredentials}
            >
              <span className="material-icons" aria-hidden="true">key</span>
              Use demo login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
