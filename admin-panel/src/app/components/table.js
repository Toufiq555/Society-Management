"use client";

export default function TableComponent({
  headers,
  data = [],
  onDelete,
  onUpdateStatus,
}) {
  if (!Array.isArray(data)) {
    console.error("TableComponent Error: Data is not an array", data);
    return <p>Error: Data format is incorrect</p>;
  }

  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
    >
      <thead>
        <tr
          style={{
            background: "white",
            textAlign: "left",
            borderRadius: "10px",
          }}
        >
          {headers.map((header, index) => (
            <th key={index} style={styles.th}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={headers.length}
              style={{ textAlign: "center", padding: "10px" }}
            >
              No records found
            </td>
          </tr>
        ) : (
          data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              style={{ borderBottom: "1px solid #e5e7eb" }}
            >
              {headers.map((header, colIndex) => {
                const key = header.toLowerCase().replace(/\s+/g, "_"); // Convert header format to match API keys

                return (
                  <td key={`${rowIndex}-${colIndex}`} style={styles.td}>
                    {header === "Actions" ? (
                      <button
                        onClick={() => onDelete(item.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    ) : header === "Status" ? (
                      <select
                        value={item.status}
                        onChange={(e) =>
                          onUpdateStatus(item.id, e.target.value)
                        }
                        style={styles.select}
                      >
                        <option value="Not Approved">Not Approved</option>
                        <option value="Approved">Approved</option>
                      </select>
                    ) : (
                      item[key] || "—" // Fallback value
                    )}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

const styles = {
  th: {
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    fontWeight: "bold",
  },
  td: { padding: "10px", verticalAlign: "middle" },
  deleteButton: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  select: {
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
  },
};
