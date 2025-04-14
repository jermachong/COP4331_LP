import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const { token: tokenFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const token = tokenFromPath || searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "http://travelinggenie.com:5000/api";

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        console.log("[DEBUG] Verifying token:", token);
        console.log("[DEBUG] API URL:", API_URL);
        // Try both path parameter and query parameter formats
        const response = await fetch(`${API_URL}/verify-email/${token}`);
        if (!response.ok) {
          // If path parameter fails, try query parameter
          const queryResponse = await fetch(
            `${API_URL}/verify-email?token=${token}`
          );
          if (!queryResponse.ok) {
            throw new Error("Verification failed");
          }
          const data = await queryResponse.json();
          handleVerificationSuccess(data);
        } else {
          const data = await response.json();
          handleVerificationSuccess(data);
        }
      } catch (error) {
        console.error("[DEBUG] Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    const handleVerificationSuccess = (data: { message?: string }) => {
      setStatus("success");
      setMessage(
        data.message || "Email verified successfully! You can now log in."
      );

      // Get stored user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        // Navigate to dashboard after successful verification
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        // If no stored user data, redirect to login
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              {status === "verifying" && (
                <>
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h3>Verifying your email...</h3>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="text-success mb-3">
                    <i
                      className="bi bi-check-circle-fill"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h3 className="text-success">Success!</h3>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="text-danger mb-3">
                    <i
                      className="bi bi-x-circle-fill"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h3 className="text-danger">Error</h3>
                </>
              )}

              <p className="mt-3">{message}</p>

              {status === "error" && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate("/login")}
                >
                  Return to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
