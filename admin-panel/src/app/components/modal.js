"use client";
import { useState } from "react";

export default function ModalComponent({
  isOpen,
  onClose,
  onSubmit,
  headers = [],
  dropdownFields = {},
  isOtpEnabled = false,
  validationRules = {},
}) {
  const [formData, setFormData] = useState(
    headers
      .filter((header) => header !== "Actions" && header !== "Status")
      .reduce((acc, header) => {
        acc[header.toLowerCase()] = "";
        return acc;
      }, {})
  );
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    let newErrors = { ...errors };

    // ✅ Check validationRules before applying validation
    if (validationRules.email && name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      newErrors.email = emailRegex.test(value) ? "" : "Invalid email address";
    }

    if (validationRules.phone && name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      newErrors.phone = phoneRegex.test(value) ? "" : "Invalid phone number";
    }

    setErrors(newErrors);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone.startsWith("+")) {
      return `+91${phone}`; // Default India country code, change as needed
    }
    return phone;
  };
  //send otp function

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(formData.phone);

    if (!formattedPhone.match(/^\+?[1-9]\d{1,14}$/)) {
      alert(
        "Invalid phone number format! Use country code, e.g., +91XXXXXXXXXX"
      );
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      if (!response.ok) {
        throw new Error("Failed to send otp");
      }
      alert("OTP sent successfully");
      setOtpSent(true);
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 30000);
    } catch (error) {
      console.error("error sending otp:", error);
    }
  };

  //verify otp function

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.phone, otp: otp }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert("Invalid OTP. Please try again!");
        return;
      }
      alert("OTP sent successfully");
      setIsOtpVerified(true);
    } catch (error) {
      console.error("error verifying otp:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Apply validation only if defined in validationRules
    if (
      validationRules.email &&
      !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      alert("Invalid email format!");
      return;
    }

    if (validationRules.phone && !formData.phone.match(/^\+?[1-9]\d{9,14}$/)) {
      alert("Invalid phone format! Use country code.");
      return;
    }

    if (isOtpEnabled && !isOtpVerified) {
      alert("Please verify OTP before submitting.");
      return;
    }

    onSubmit({ ...formData });
    setFormData(
      headers
        .filter((header) => header !== "Actions " && header !== "Status")
        .reduce((acc, header) => {
          acc[header.toLowerCase()] = "";
          return acc;
        }, {})
    );

    setIsOtpVerified(false);
    setOtpSent(false);
    onClose();
  };

  return (
    <div style={modalStyles.overlay}>
      <div
        style={modalStyles.modal}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <h2 style={modalStyles.h2}>Add Members</h2>
        <form onSubmit={handleSubmit}>
          {headers
            .filter((header) => header !== "Actions" && header !== "Status")
            .map((header, index) => {
              const fieldName = header.toLowerCase();
              return (
                <div key={index} style={{ margin: "10px 0" }}>
                  <label style={{ fontSize: "17px", fontWeight: "bold" }}>
                    {header}:
                  </label>
                  {dropdownFields[fieldName] ? (
                    <select
                      name={fieldName}
                      value={formData[fieldName]}
                      onChange={handleChange}
                      required={validationRules[fieldName] || false}
                      style={modalStyles.input}
                    >
                      <option value="">Select {header}</option>
                      {dropdownFields[fieldName].map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={fieldName}
                      value={formData[fieldName]}
                      onChange={handleChange}
                      required
                      style={{
                        ...modalStyles.input,
                        border:
                          isOtpEnabled && fieldName === "phone" && isOtpVerified
                            ? "2px solid green"
                            : "1px solid #ccc",
                      }}
                    />
                  )}

                  {/* ✅ OTP Section (Only for Phone) */}
                  {isOtpEnabled && fieldName === "phone" && (
                    <div style={{ marginTop: "10px" }}>
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          style={modalStyles.button}
                        >
                          Send OTP
                        </button>
                      ) : (
                        !isOtpVerified && ( // ✅ OTP Verified hone ke baad ye hide ho jayega
                          <>
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              style={modalStyles.input}
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              style={modalStyles.button}
                            >
                              Verify OTP
                            </button>

                            {/* Resend OTP Button */}
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={resendDisabled}
                              style={{
                                ...modalStyles.button,
                                backgroundColor: resendDisabled
                                  ? "gray"
                                  : "#007bff",
                              }}
                            >
                              Resend OTP
                            </button>
                          </>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          <div style={modalStyles.addcancel}>
            <button type="submit" style={modalStyles.button}>
              Add
            </button>

            <button type="button" onClick={onClose} style={modalStyles.button}>
              Cancel
            </button>
          </div>
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
    width: "600px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  h2: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
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
    fontSize: "15px",
    fontWeight: "bold",
  },
  addcancel: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "20px",
  },
};
