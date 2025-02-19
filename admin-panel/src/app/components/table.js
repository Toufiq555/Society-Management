export default function TableComponent({ headers, data, onDelete }) {
  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
    >
      <thead>
        <tr
          style={{
            background: "wh",
            textAlign: "left",
            border: "grey",
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
        {data.map((item, rowIndex) => (
          <tr
            key={item.id}
            style={{
              borderBottom: "1px solid #e5e7eb",
              transition: "background-color 0.3s ease",
            }}
          >
            {headers.map((header, colIndex) => {
              if (header === "Actions") {
                // Add a Delete button in the Actions column
                return (
                  <td key={colIndex} style={styles.td}>
                    <button
                      onClick={() => onDelete(item.id)} // Pass the item's ID to the delete function
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                );
              }
              return (
                <td key={colIndex} style={styles.td}>
                  {item[header.toLowerCase()]}
                </td>
              );
            })}
          </tr>
        ))}
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
};
