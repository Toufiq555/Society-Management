"use client"; // Mark as a Client Component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaUserCheck } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Members", path: "/admin/members", icon: <FaUsers /> },
    { name: "Visitors", path: "/admin/visitors", icon: <FaUserCheck /> },
    { name: "Notices", path: "/admin/notices", icon: <FaUserCheck /> },
    { name: "Payments", path: "/admin/payments", icon: <FaUserCheck /> },
    { name: "Amenities", path: "/admin/amenities", icon: <FaUserCheck /> },
    { name: "Helpdesk", path: "/admin/helpdesk", icon: <FaUserCheck /> },
  ];

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "white",
        padding: "20px",
        borderRight: "1px solid #bbb", // Thicker right border with a softer color
      }}
    >
      <h3
        style={{
          fontFamily: "sans-serif",
          fontSize: "25px",
          textAlign: "center",
        }}
      >
        Society Admin
      </h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          fontFamily: "system-ui",
          fontSize: "18px",
          marginTop: "35px",
        }}
      >
        {menuItems.map((item) => (
          <li key={item.path} style={{ margin: "10px 0" }}>
            <Link href={item.path} legacyBehavior>
              <a
                style={{
                  display: "flex", // Aligns icon and text
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                  color: pathname === item.path ? "black" : "#5d6d7e",
                  padding: "12px", // Improved padding
                  borderRadius: "4px",
                  transition: "background 0.3s ease, color 0.3s ease", // Smooth effect
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                  e.currentTarget.style.color = "black";
                }} // Hover background
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    pathname === item.path ? "black" : "#5d6d7e";
                }} // Remove hover effect
              >
                {item.icon} {/* Icon Here */}
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
