// // "use client";

// // export default function TableComponent({
// //   headers,
// //   data = [],
// //   onDelete,
// //   onUpdateStatus,
// // }) {
// //   if (!Array.isArray(data)) {
// //     console.error("TableComponent Error: Data is not an array", data);
// //     return <p>Error: Data format is incorrect</p>;
// //   }

// //   console.log("Rendering table with data:", data);

// //   return (
// //     <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
// //       <thead>
// //         <tr style={{ background: "white", textAlign: "left", borderRadius: "10px" }}>
// //           {headers.map((header, index) => (
// //             <th key={index} style={styles.th}>{header.label}</th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {data.length === 0 ? (
// //           <tr>
// //             <td colSpan={headers.length} style={{ textAlign: "center", padding: "10px" }}>
// //               No records found
// //             </td>
// //           </tr>
// //         ) : (
// //           data.map((item, rowIndex) => (
// //             <tr key={item.id || rowIndex} style={{ borderBottom: "1px solid #e5e7eb" }}>
// //               {headers.map((header, colIndex) => {
// //                 const key = header.key;

// //                 return (
// //                   <td key={`${rowIndex}-${colIndex}`} style={styles.td}>
// //                     {key === "actions" ? (
// //                       <button onClick={() => onDelete(item.id)} style={styles.deleteButton}>
// //                         Delete
// //                       </button>
// //                     ) : key === "status" ? (
// //                       <select
// //                         value={item.status}
// //                         onChange={(e) => onUpdateStatus(item.id, e.target.value)}
// //                         style={styles.select}
// //                       >
// //                         <option value="Not Available">Not Available</option>
// //                         <option value="Available">Available</option>
// //                       </select>
// //                     ) : (
// //                       item[key] || "—"
// //                     )}
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))
// //         )}
// //       </tbody>
// //     </table>
// //   );
// // }

// // const styles = {
// //   th: {
// //     padding: "10px",
// //     borderBottom: "1px solid #e5e7eb",
// //     textAlign: "left",
// //     fontWeight: "bold",
// //   },
// //   td: { padding: "10px", verticalAlign: "middle" },
// //   deleteButton: {
// //     background: "red",
// //     color: "white",
// //     border: "none",
// //     padding: "5px 10px",
// //     cursor: "pointer",
// //     borderRadius: "4px",
// //   },
// //   select: {
// //     padding: "5px",
// //     borderRadius: "4px",
// //     border: "1px solid #ccc",
// //     background: "white",
// //     cursor: "pointer",
// //   },
// // };


"use client";

export default function TableComponent({ headers, data = [], onDelete }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={styles.th}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr key={item.id || rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={styles.td}>
                  {header.key === "actions" ? (
                    <button
                      aria-label={`Delete ${item.name || 'item'}`}
                      onClick={() => onDelete(item.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  ) : (
                    item[header.key] ?? "—"
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} style={styles.tdCenter}>
              No data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

const styles = {
  th: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "10px",
  },
  tdCenter: {
    textAlign: "center",
    padding: "10px",
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};



