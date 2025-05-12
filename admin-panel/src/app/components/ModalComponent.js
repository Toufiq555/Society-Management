"use client";

import { useState } from "react";

export default function ModalComponent({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Not Approved");
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [daysInAdvance, setDaysInAdvance] = useState(0);

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      alert("Name and Description are required!");
      return;
    }

    const newAmenity = {
      name: name.trim(),
      description: description.trim(),
      status,
      max_capacity: maxCapacity,
      price,
      days_in_advance: daysInAdvance,
    };

    onSubmit(newAmenity);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Add New Amenity</h2>
        <input
          type="text"
          placeholder="Amenity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
          <option value="Not Approved">Not Available</option>
          <option value="Approved">Available</option>
        </select>

        <input
          type="number"
          placeholder="Max Capacity"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(Number(e.target.value))}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          step="0.01"
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Days in Advance"
          value={daysInAdvance}
          onChange={(e) => setDaysInAdvance(Number(e.target.value))}
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button onClick={handleSubmit} style={styles.addButton}>Add Amenity</button>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  addButton: {
    backgroundColor: "green",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
