"use client";

import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import { useState } from "react";

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const headers = [
    "Name",
    "Role",
    "Email",
    "Phone",
    "Building",
    "Flat No.",
    "Ownership",
    "Approvel",
    "Actions",
  ];

  const dropdownFields = {
    Role: ["Member", "Admin", "Committee"],
    Ownership: ["Owner", "Tenant"],
    Approvel: ["Yes", "No"],
  };

  const handleAddData = (newData) => {
    setTableData([...tableData, { ...newData, id: Date.now() }]);
  };

  const handleDeleteMembers = (id) => {
    setTableData(tableData.filter((item) => item.id !== id));
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
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Members
          </h1>

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
            background: "black",
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
        />

        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddData}
          headers={headers}
          dropdownFields={dropdownFields}
        />
      </div>
    </div>
  );
}
