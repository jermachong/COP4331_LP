import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface SignupProps {
  onSignupSuccess: (username: string, userData: UserData) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const API_URL =
      import.meta.env.MODE === "development"
        ? "http://localhost:5000/api"
        : "https://travelinggenie.com/api";

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, login, password }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(
          "Registration successful! Please check your email to verify your account."
        );

        const userData: UserData = {
          userId: data.userId,
          firstName,
          lastName,
          token: data.token,
        };

        localStorage.setItem(
          "user",
          JSON.stringify({ username: login, ...userData })
        );

        onSignupSuccess(login, userData);

        setFirstName("");
        setLastName("");
        setEmail("");
        setLogin("");
        setPassword("");

        setTimeout(() => navigate("/"), 5000);
      }
    } catch (err) {
      setError("An error occurred during signup.");
    }
  };

  return (
    <div className="container mt-3">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSignup}>
        <div className="mb-3 d-flex gap-3">
          <div className="flex-fill">
            <label>First Name:</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="flex-fill">
            <label>Last Name:</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-3 password-field-wrapper">
          <label>
            Password:
            <span className="tooltip-icon" tabIndex={0}>
              ?
            </span>
            <div className="tooltip-text">
              Must be at least 8 characters, include:
              <br />1 uppercase, 1 lowercase, 1 number, 1 special character
            </div>
          </label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
