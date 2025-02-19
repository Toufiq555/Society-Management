"use client";
import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useState } from "react";
import * as XLSX from "xlsx"; // Library for Excel export

export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const headers = [
    "Date",
    "Flat No.",
    "Amount",
    "Status",
    "Reference ID",
    "Actions",
  ];

  // Add new payment data
  const handleAddData = (newData) => {
    setTableData([...tableData, { ...newData, id: Date.now() }]);
  };

  // Delete a payment entry
  const handleDeletePayment = () => {
    setTableData(tableData.filter((item) => item.id !== deleteId));
    setDeleteId(null); // Reset deleteId after deletion
  };

  const confirmDelete = (id) => {
    setDeleteId(id); // Set the ID of the item to delete
  };

  // Download data as Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payments.xlsx");
  };

  return (
    <div>
      {/* Header Section */}
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
          Payments
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
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
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Add Payment
          </button>
          <button
            onClick={handleDownloadExcel}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Download Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
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
          onDelete={(id) => confirmDelete(id)} // Trigger confirmation modal
        />
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddData}
          headers={headers}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null} // Show modal if deleteId is set
        onClose={() => setDeleteId(null)} // Close modal
        onConfirm={handleDeletePayment} // Confirm deletion
      />
    </div>
  );
}
