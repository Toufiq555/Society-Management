"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaUserCheck } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [showNoticesDropdown, setShowNoticesDropdown] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Members", path: "/admin/members", icon: <FaUsers /> },
    { name: "Visitors", path: "/admin/visitors", icon: <FaUserCheck /> },
    { name: "Payments", path: "/admin/payments", icon: <FaUserCheck /> },
    { name: "Amenities", path: "/admin/amenities", icon: <FaUserCheck /> },
    { name: "Helpdesk", path: "/admin/helpdesk", icon: <FaUserCheck /> },
  ];

  const noticeItems = [
    { name: "Notices", path: "/admin/notices" },
    { name: "Add", path: "/admin/Advertisment" },
  ];

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "white",
        padding: "20px",
        borderRight: "1px solid #bbb",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                  color: pathname === item.path ? "black" : "#5d6d7e",
                  padding: "12px",
                  borderRadius: "4px",
                  transition: "background 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                  e.currentTarget.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    pathname === item.path ? "black" : "#5d6d7e";
                }}
              >
                {item.icon}
                {item.name}
              </a>
            </Link>
          </li>
        ))}

        {/* Dropdown Section for Notices */}
        <li style={{ margin: "10px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "12px",
              borderRadius: "4px",
              color: "#5d6d7e",
            }}
            onClick={() => setShowNoticesDropdown((prev) => !prev)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f0f0f0";
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#5d6d7e";
            }}
          >
            <FaUserCheck />
            Notices
          </div>

          {showNoticesDropdown && (
            <ul style={{ listStyle: "none", paddingLeft: "25px", marginTop: "5px" }}>
              {noticeItems.map((subItem) => (
                <li key={subItem.path} style={{ margin: "5px 0" }}>
                  <Link href={subItem.path} legacyBehavior>
                    <a
                      style={{
                        textDecoration: "none",
                        fontWeight: pathname === subItem.path ? "bold" : "normal",
                        color: pathname === subItem.path ? "black" : "#5d6d7e",
                        transition: "color 0.2s",
                      }}
                    >
                      {subItem.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
