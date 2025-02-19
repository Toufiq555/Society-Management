"use client";

import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import { useState } from "react";

export default function HelpdeskPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const headers = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Created At",
    "Actions",
  ];

  const handleAddData = (newData) => {
    setTableData([...tableData, { ...newData, id: Date.now() }]);
  };

  const handleDelete = (id) => {
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
            Helpdesk
          </h1>
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
          onDelete={handleDelete}
        />

        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddData}
          headers={headers}
        />
      </div>
    </div>
  );
}
