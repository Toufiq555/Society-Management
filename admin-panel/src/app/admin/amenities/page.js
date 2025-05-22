"use client";

import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import { useEffect, useState } from "react";

export default function AmenityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [amenityName, setAmenityName] = useState("");
  const [amenityCapacity, setAmenityCapacity] = useState("");
  const [amenityPrice, setAmenityPrice] = useState("");
  const [amenityAdvance, setAmenityAdvance] = useState("");
  const API_BASE_URL = "http://localhost:8080/api/v1/amenities";

  const headers = ["Name", "Image", "Capacity", "Price", "Advance", "Actions"];

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-amenity`);
      const data = await response.json();

      if (data.success && Array.isArray(data.amenities)) {
        setTableData(data.amenities);
        // Console log to inspect the data and imageUrl
        console.log("Fetched Amenity Data:", data.amenities);
      } else {
        console.error("Invalid API response", data);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching Amenities", error);
      setTableData([]);
    }
  };

  const handleAddData = async () => {
    if (!amenityName.trim()) {
      alert("Please enter the amenity name.");
      return;
    }

    if (!amenityCapacity.trim()) {
      alert("Please enter the capacity.");
      return;
    }

    if (!amenityPrice.trim()) {
      alert("Please enter the price.");
      return;
    }

    if (!amenityAdvance.trim()) {
      alert("Please enter the advance amount.");
      return;
    }

    if (!imageFile) {
      alert("Please select an image for the amenity.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", amenityName);
      formData.append("capacity", amenityCapacity);
      formData.append("price", amenityPrice);
      formData.append("advance", amenityAdvance);
      formData.append("image", imageFile);

      const res = await fetch(`${API_BASE_URL}/add-amenity`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result?.success) {
        setAmenityName("");
        setAmenityCapacity("");
        setAmenityPrice("");
        setAmenityAdvance("");
        setImageFile(null);
        setIsModalOpen(false);
        alert("Amenity added successfully");
        fetchAmenities(); // refresh table
      } else {
        alert(result?.message || "Failed to add amenity");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An unexpected error occurred while adding amenity.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAmenity = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/amenities/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchAmenities();
      } else {
        alert(result.message || "Failed to delete amenity");
      }
    } catch (error) {
      console.error("Error deleting Amenity", error);
      alert("Error deleting amenity");
    }
  };

  const renderTableData = tableData.map((amenity) => ({
    id: amenity.id,
    Name: amenity.name,
    Image: (
      <img
        src={amenity.imageUrl} // Use the full URL from the API
        alt={amenity.name}
        style={{ width: "80px", height: "60px", borderRadius: "4px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/image/profilepic.png"; // Fallback to placeholder
        }}
      />
    ),
    Capacity: amenity.capacity,
    Price: amenity.price,
    Advance: amenity.advance,
    Actions: (
      <button
        onClick={() => handleDeleteAmenity(amenity.id)}
        style={{
          padding: "6px 10px",
          backgroundColor: "red",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Delete
      </button>
    ),
  }));

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
            border: "none",
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
        {tableData.length > 0 ? (
          <TableComponent headers={headers} data={renderTableData} onDelete={handleDeleteAmenity} />
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>No amenities found</div>
        )}

        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddData}
          isOtpEnabled={false}
          validationRules={{
            title: "Add Amenity",
          }}
          customContent={
            <div>
              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                Amenity Name
              </label>
              <input
                type="text"
                value={amenityName}
                onChange={(e) => setAmenityName(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />

              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                Capacity
              </label>
              <input
                type="number"
                value={amenityCapacity}
                onChange={(e) => setAmenityCapacity(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />

              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                Price
              </label>
              <input
                type="number"
                value={amenityPrice}
                onChange={(e) => setAmenityPrice(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />

              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                Advance
              </label>
              <input
                type="number"
                value={amenityAdvance}
                onChange={(e) => setAmenityAdvance(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc" }}
              />

              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                Select Amenity Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert("File must be less than 5MB");
                      return;
                    }
                    setImageFile(file);
                  }
                }}
                style={{ marginBottom: "10px" }}
              />
              {imageFile && (
                <div style={{ marginTop: "10px" }}>
                  <p>{imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)</p>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    style={{ width: "200px", borderRadius: "6px" }}
                  />
                </div>
              )}
              {isUploading && (
                <div style={{ marginTop: "10px", color: "#0070f3" }}>
                  Adding amenity... Please wait
                </div>
              )}
            </div>
          }
          disableSubmit={
            isUploading ||
            !amenityName.trim() ||
            !amenityCapacity.trim() ||
            !amenityPrice.trim() ||
            !amenityAdvance.trim() ||
            !imageFile
          }
          submitButtonText={isUploading ? "Adding..." : "Add Amenity"}
        />
      </div>
    </div>
  );
}


