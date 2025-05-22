"use client";

import { useState, useEffect } from "react";
import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";

export default function AdvertisementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
   const API_BASE_URL = "http://localhost:8080/api/v1/advertisements";

  const headers = ["ImageUrl", "CreatedAt", "Actions"];

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    console.log("Fetching advertisements...");
    try {
      const response = await fetch(`${API_BASE_URL}/get-advertisements`);
      const data = await response.json();
      console.log("Fetch response:", data);
     if (data.success && Array.isArray(data.advertisements)){
      setTableData(data.advertisements);
      console.log("Fetching Adevertisement:",data.advertisements);
     }else{
      console.error("Invalid API response",data);
     setTableData([]);
    }
  }
  catch(error){
    console.error("Error fetching advertisement",error);
    setTableData([]);
  }
  };

  const handleAddAd = async () => {
    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    console.log("Uploading advertisement...");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(`${API_BASE_URL}/add-advertisement`, {
        method: "POST",
        body: formData,
      });

      console.log("Upload response:", res);
      const result = await res.json();
      console.log("Upload result:", result);

      if (res.ok && result?.success) {
        console.log("Advertisement uploaded successfully. Calling fetchAdvertisements...");
        setImageFile(null);
        setIsModalOpen(false);
        alert("Advertisement uploaded successfully");
        fetchAdvertisements(); // refresh table
        console.log("fetchAdvertisements() called.");
      } else {
        alert(result?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAd = async (id) => {
    console.log("Deleting advertisement with ID:", id);
    try {
      const res = await fetch(`${API_BASE_URL}/advertisements/${id}`, {
        method: "DELETE",
      });
      console.log("Delete response:", res);
      const result = await res.json();
      console.log("Delete result:", result);
      if (res.ok && result.success) {
        fetchAdvertisements();
      } else {
        alert(result.message || "Failed to delete advertisement");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting advertisement");
    }
  };

  const renderTableData = tableData.map((ad) => ({
    id: ad.id, // ✅ Required for deletion
    ImageUrl: (
      <img
        src={ad.ImageUrl}
        alt="Ad"
        style={{ width: "100px", borderRadius: "6px" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder-image.png";
        }}
      />
    ),
    CreatedAt: new Date(ad.CreatedAt).toLocaleString(),
    Actions: (
      <button
        onClick={() => handleDeleteAd(ad.id)}
        style={{
          padding: "6px 12px",
          backgroundColor: "red",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    ),
  }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Advertisements</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add Advertisement
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
          <TableComponent
            headers={headers}
            data={renderTableData}
            onDelete={handleDeleteAd}
          />
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>No advertisements found</div>
        )}

        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAd}
          disableSubmit={isUploading}
          submitButtonText={isUploading ? "Uploading..." : "Upload Advertisement"}
          customContent={
            <div>
              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                Select Advertisement Image
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
                  Uploading... Please wait
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}