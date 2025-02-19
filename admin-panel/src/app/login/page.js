"use client"; // This is a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Predefined admin credentials
  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "admin123";

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true"); // Mark admin as logged in
      router.push("/admin/dashboard"); // Redirect to the dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Left Section - Login Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          animation: "slideInLeft 1s ease-in-out",
        }}
      >
        <div
          style={{
            width: "80%",
            maxWidth: "400px",
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <i className="fas fa-building"></i> Society Manager
          </h2>
          {error && (
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#4A5568",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                }}
                required
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#4A5568",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                }}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
      {/* Right Section - Information */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          backgroundColor: "#f8fafc",
          animation: "slideInRight 1s ease-in-out",
        }}
      >
        <div style={{ maxWidth: "500px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Society Management Made Easy
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4B5563",
              marginBottom: "16px",
            }}
          >
            Manage your society efficiently with our comprehensive admin panel.
            Control members, visitors, facilities, and more from one central
            dashboard.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              color: "#4B5563",
              fontSize: "1.125rem",
            }}
          >
            <li>✔️ Member Management</li>
            <li>✔️ Visitor Controls</li>
            <li>✔️ Notice Board</li>
            <li>✔️ Payment Tracking</li>
            <li>✔️ Amenity Bookings</li>
            <li>✔️ Helpdesk Support</li>
          </ul>
        </div>
      </div>
      <style jsx global>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideInLeft {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
      ;
    </div>
  );
}
