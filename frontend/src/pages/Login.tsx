import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data));
        onLoginSuccess();
        navigate("/dashboard");
      } else {
        setError(data.error);
        console.error("Error logging in:", data.error);
      }
    } catch (error) {
      setError("An error occurred during login.");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="container mt-3">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="login" className="form-label">
            Login:
          </label>
          <input
            type="text"
            className="form-control"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
