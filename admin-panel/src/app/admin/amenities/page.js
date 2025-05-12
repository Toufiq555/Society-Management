"use client";

import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import { useEffect, useState } from "react";

export default function AmenityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const headers = ["Name", "Description", "Capacity", "Price", "Advance", "Actions"];

  useEffect(() => {
    fetchAmenity();
  }, []);

  const fetchAmenity = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/get-amenity");
      const data = await response.json();

      if (data.success && Array.isArray(data.amenities)) {
        setTableData(data.amenities); // ✅ Pass only notices array
      } else {
        console.error("Invalid API response", data);
        setTableData([]); // Prevents crashing if response is unexpected
      }
    } catch (error) {
      console.error("Error fetching Amenity", error);
      setTableData([]); // Fallback in case of error
    }
  };

  const handleAddData = async (newData) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/add-amenity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        fetchAmenity();
        setIsModalOpen(false);
      } else {
        console.error("Error adding Amenity");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeleteAmenity = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/v1/${id}`, {
        method: "DELETE",
      });
      fetchAmenity();
    } catch (error) {
      console.error("Error deleting Amenity", error);
    }
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
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Amenities</h2>

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
          Add Amenity
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
          onDelete={handleDeleteAmenity}
        />

        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddData}
          headers={headers}
          isOtpEnabled={false}
          validationRules={{
            title: true,
            description: true,
            title: "Add Amenity",
          }}
        />
      </div>
    </div>
  );
}
