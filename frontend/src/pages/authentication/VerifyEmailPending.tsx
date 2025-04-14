import React from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmailPending: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-primary mb-3">
                <i
                  className="bi bi-envelope-check"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <h3>Check Your Email</h3>
              <p className="mt-3">
                We've sent you an email with a verification link. Please check
                your inbox and click the link to verify your account.
              </p>
              <p className="text-muted">
                If you don't see the email, please check your spam folder.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/")}
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPending;
