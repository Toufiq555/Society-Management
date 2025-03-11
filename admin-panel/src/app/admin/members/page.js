"use client";

import { useState, useEffect } from "react";
import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const headers = [
    "Name",
    "Role",
    "Email",
    "Phone",
    "Block",
    "Flat_no",
    "Status",
    "Actions",
  ];
  const dropdownFields = {
    role: ["Owner", "Tenant", "Admin", "Security", "Manager", "Guard"],
    block: ["A", "B", "C", "D"],
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/members");
      const data = await response.json();

      // Check if the data contains the "members" field and it's an array
      if (Array.isArray(data.members)) {
        setTableData(data.members); // Set the members array
      } else {
        throw new Error("Invalid data format, expected 'members' array");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setTableData([]); // Default to empty array if there's an error
    }
  };

  const handleAddData = async (newData) => {
    console.log("Sending Data:", newData); // Debugging ke liye check karo

    try {
      const response = await fetch("http://localhost:8080/api/v1/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      // Check for network errors or status codes outside 2xx
      if (!response.ok) {
        const errorDetails = await response.text(); // Read error body if available
        throw new Error(
          `Failed to add member: ${response.status} ${errorDetails}`
        );
      }
      let result;
      try {
        result = await response.json(); // Ensure response is valid JSON
        let mem = result.member;
        // Successfully received valid data, now update the state
        setTableData((prev) => [...prev, mem]);
        fetchMembers();
      } catch (jsonError) {
        throw new Error("Invalid JSON response from server");
      }
    } catch (error) {
      console.error("Error adding member:", error.message);
      // Optionally show a user-friendly message in the UI
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/members/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update member status");
      }

      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      alert("Status updated successfully!");
      // fetchMembers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteMembers = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/members/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete member");

      setTableData(tableData.filter((item) => item.id !== id));
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const filteredData = tableData.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Members</h1>
          <input
            type="text"
            placeholder="search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: "#000",
            color: "#fff",
            padding: "8px 16px",
            border: "1px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Add New
        </button>
      </div>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#fff",
          marginTop: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TableComponent
          headers={headers}
          data={filteredData}
          onDelete={handleDeleteMembers}
          onUpdateStatus={handleUpdateStatus}
        />
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddData}
          headers={headers}
          isOtpEnabled={true}
          dropdownFields={dropdownFields} // ✅ Add this line
          validationRules={{ email: true, phone: true, title: "Add Member" }}
        />
      </div>
    </div>
  );
}
