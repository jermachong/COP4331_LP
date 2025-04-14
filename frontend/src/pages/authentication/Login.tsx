import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface LoginProps {
  onLoginSuccess: (username: string, userData: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: setAuthUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const API_URL =
        import.meta.env.MODE === "development"
          ? "http://localhost:5000/api"
          : "http://travelinggenie.com:5000/api";

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData: UserData = {
          userId: data.userId.toString(),
          firstName: data.firstName,
          lastName: data.lastName,
          token: data.token,
        };

        setAuthUser(userData);

        // call prop function after login success
        onLoginSuccess(login, userData);
      } else {
        if (data.needsVerification) {
          setError("Please verify your email before logging in.");
        } else {
          setError(data.error || "Login failed.");
        }
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="container mt-3">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Login:</label>
          <input
            type="text"
            className="form-control"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
