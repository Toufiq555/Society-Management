"use client"; // This is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      router.push("/login"); // Redirect to login if not logged in
    }
  }, [router]);

  const [user, setUser] = useState({
    name: "Admin",
    // Replace with actual profile image URL
  });

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn"); // Clear login status
    router.push("/login"); // Redirect to login page
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid #ccc",
            backgroundColor: "white",
            borderBottom: "1px solid #bbb",
          }}
        >
          <div></div> {/* Empty div for layout balance */}
          {/* Profile Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src="/image/profilepic.png"
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #ddd",
              }}
            />
            <span style={{ fontSize: "16px", fontWeight: "500" }}>
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
