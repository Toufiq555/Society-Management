"use client";

import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import { useState } from "react";

export default function NoticePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const headers = ["Title", "Content", "Priority", "Posted On", "Actions"];

  const handleAddData = (newData) => {
    setTableData([...tableData, { ...newData, id: Date.now() }]);
  };

  const handleDeleteNotice = (id) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };
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
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Notice Board
        </h2>

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
            border: "1px",
            padding: "8px 16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Add Notices
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
          data={tableData}
          onDelete={handleDeleteNotice}
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
