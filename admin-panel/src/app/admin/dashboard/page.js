import { FaUsers, FaTicketAlt, FaUserCheck, FaBell } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      {/* Dashboard Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Total Members */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // textAlign: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: "18px", color: "#555" }}>Total Members</h3>
            <p
              style={{ fontSize: "24px", fontWeight: "bold", marginTop: "5px" }}
            >
              0
            </p>
          </div>
          <FaUsers size={25} color="#afb4b9 " style={{ marginRight: "5px" }} />
        </div>

        {/* Total Tickets */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // textAlign: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: "18px", color: "#555" }}>Open Tickets</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              0
            </p>
          </div>
          <FaTicketAlt
            size={25}
            color="#afb4b9 "
            style={{ marginRight: "5px" }}
          />
        </div>

        {/* Total Tickets */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // textAlign: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: "18px", color: "#555" }}>Active Notice</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              0
            </p>
          </div>
          <FaBell size={25} color="#afb4b9 " style={{ marginRight: "5px" }} />
        </div>

        {/* Total Visitors */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            // textAlign: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: "18px", color: "#555" }}>Active Visitors</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              0
            </p>
          </div>
          <FaUserCheck
            size={25}
            color="#afb4b9 "
            style={{ marginRight: "5px" }}
          />
        </div>
      </div>
    </div>
  );
}
