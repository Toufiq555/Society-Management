"use client";
import { useState } from "react";
import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";

export default function AdminPage() {
  // State for Amenities
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [amenitiesData, setAmenitiesData] = useState([]); // Store Amenities data
  const amenitiesHeaders = ["Name", "Description", "Price", "Actions"];

  // State for Bookings
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState([]); // Store Bookings data
  const bookingsHeaders = ["Amenities", "Slot", "Price", "Status", "Actions"];

  // Handle Add Data for Amenities
  const handleAddAmenitiesData = (newData) => {
    setAmenitiesData([...amenitiesData, { ...newData, id: Date.now() }]); // Append new entry with unique ID
  };

  // Handle Add Data for Bookings
  const handleAddBookingsData = (newData) => {
    setBookingsData([...bookingsData, { ...newData, id: Date.now() }]); // Append new entry with unique ID
  };

  // Handle Delete for Amenities
  const handleDeleteAmenities = (id) => {
    setAmenitiesData(amenitiesData.filter((item) => item.id !== id)); // Remove the item with the matching ID
  };

  // Handle Delete for Bookings
  const handleDeleteBookings = (id) => {
    setBookingsData(bookingsData.filter((item) => item.id !== id)); // Remove the item with the matching ID
  };

  return (
    <div>
      {/* Amenities Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Amenities
          </h1>
          <button
            onClick={() => setIsAmenitiesModalOpen(true)}
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
          {/* Table for Amenities */}
          <TableComponent
            headers={amenitiesHeaders}
            data={amenitiesData}
            onDelete={handleDeleteAmenities} // Pass delete handler
          />
          {/* Modal for Amenities */}
          <ModalComponent
            isOpen={isAmenitiesModalOpen}
            onClose={() => setIsAmenitiesModalOpen(false)}
            onSubmit={handleAddAmenitiesData}
            headers={amenitiesHeaders}
          />
        </div>
      </div>

      {/* Bookings Section */}
      <div style={{ marginTop: "50px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Bookings
          </h1>
          <button
            onClick={() => setIsBookingsModalOpen(true)}
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
            Add Booking
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
          {/* Table for Bookings */}
          <TableComponent
            headers={bookingsHeaders}
            data={bookingsData}
            onDelete={handleDeleteBookings} // Pass delete handler
          />
          {/* Modal for Bookings */}
          <ModalComponent
            isOpen={isBookingsModalOpen}
            onClose={() => setIsBookingsModalOpen(false)}
            onSubmit={handleAddBookingsData}
            headers={bookingsHeaders}
          />
        </div>
      </div>
    </div>
  );
}
