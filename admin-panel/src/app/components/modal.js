import { useState } from "react";

export default function ModalComponent({ isOpen, onClose, onSubmit, headers }) {
  const [formData, setFormData] = useState(
    headers
      .filter((header) => header !== "Actions")
      .reduce((acc, header) => {
        acc[header.toLowerCase()] = "";
        return acc;
      }, {})
  );

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData }); // Pass data to parent
    setFormData(
      headers
        .filter((header) => header !== "Actions")
        .reduce((acc, header) => {
          acc[header.toLowerCase()] = "";
          return acc;
        }, {})
    ); // Reset form
    onClose(); // Close modal
  };

  return (
    <div style={modalStyles.overlay}>
      <div
        style={modalStyles.modal}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          {headers
            .filter((header) => header !== "Actions")
            .map((header, index) => (
              <div key={index} style={{ margin: "10px 0" }}>
                <label>{header}:</label>
                <input
                  type="text"
                  name={header.toLowerCase()}
                  value={formData[header.toLowerCase()]}
                  onChange={handleChange}
                  required
                  style={modalStyles.input}
                />
              </div>
            ))}
          <button type="submit" style={modalStyles.button}>
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            style={modalStyles.closeButton}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  addButton: {
    background: "black",
    color: "white",
    marginRight: "10px",
  },
  closeButton: {
    background: "gray",
    color: "white",
  },
};
