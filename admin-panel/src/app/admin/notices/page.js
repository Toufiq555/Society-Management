// "use client";

// import ModalComponent from "@/app/components/modal";
// import TableComponent from "@/app/components/table";
// import { useEffect, useState } from "react";

// export default function NoticePage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const headers = [
//   { label: "Title", key: "title" },
//   { label: "Description", key: "description" },
//   { label: "Actions", key: "actions" },
// ];


//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   const fetchNotices = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/v1/get-notice");

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success && Array.isArray(data.notices)) {
//         setTableData(data.notices);
//       } else {
//         setTableData([]);
//       }
//     } catch (error) {
//       console.error("Fetch failed:", error.message);
//       setTableData([]);
//     }
//   };

//   const handleAddData = async (newData) => {
//     try {
//       const response = await fetch("http://localhost:8080/api/v1/add-notice", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newData),
//       });

//       if (response.ok) {
//         fetchNotices();
//         setIsModalOpen(false);
//       } else {
//         console.error("Error adding notice");
//       }
//     } catch (error) {
//       console.error("Error", error);
//     }
//   };

//   const handleDeleteNotice = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/v1/notices/${id}`, {
//         method: "DELETE",
//       });
//       if (response.ok) {
//         fetchNotices();
//       } else {
//         console.error("Error deleting notice");
//       }
//     } catch (error) {
//       console.error("Error deleting notice", error);
//     }
//   };

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "10px",
//           alignItems: "center",
//         }}
//       >
//         <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Notice Board</h2>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "8px",
//             borderRadius: "6px",
//             fontSize: "14px",
//             fontWeight: "500",
//             backgroundColor: "#000",
//             color: "#fff",
//             border: "1px solid #000",
//             padding: "8px 16px",
//             cursor: "pointer",
//             transition: "background-color 0.3s ease",
//           }}
//         >
//           Add Notices
//         </button>
//       </div>

//       <div
//         style={{
//           border: "1px solid #e5e7eb",
//           borderRadius: "8px",
//           backgroundColor: "#fff",
//           marginTop: "10px",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <TableComponent
//           headers={headers}
//           data={tableData}
//           onDelete={handleDeleteNotice}
//         />

//         <ModalComponent
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSubmit={handleAddData}
//           headers={headers}
//           isOtpEnabled={false}
//           validationRules={{
//             title: true,
//             description: true,
//             modalTitle: "Add Notice",
//           }}
//         />
//       </div>
//     </div>
//   );
// }


"use client";

import ModalComponent from "@/app/components/modal";
import TableComponent from "@/app/components/table";
import { useEffect, useState } from "react";

export default function NoticePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const headers = [
     "Title",
    "Description",
     "Actions" 
  ];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/notices/get-notice");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API data.notices:", data?.notices); // Inspect raw data

      if (data?.success && Array.isArray(data?.notices)) {
        const transformedData = data.notices.map((notice) => ({
          id: notice.id,
          title: typeof notice.title === 'object' && notice.title !== null ? notice.title.label : notice.title,
          description: typeof notice.description === 'object' && notice.description !== null ? notice.description.label : notice.description,
          actions: null, // Handle button in TableComponent
          originalItem: notice,
        }));
        console.log("Transformed tableData:", transformedData); // Inspect transformed data
        setTableData(transformedData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Fetch failed:", error.message);
      setTableData([]);
    }
  };

  const handleAddData = async (newData) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/notices/add-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        fetchNotices();
        setIsModalOpen(false);
      } else {
        console.error("Error adding notice");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/notices/notices/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchNotices();
      } else {
        console.error("Error deleting notice");
      }
    } catch (error) {
      console.error("Error deleting notice", error);
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
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Notice Board</h2>

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
            border: "1px solid #000",
            padding: "8px 16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Add Notices
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
          onDelete={(id) => {
            const itemToDelete = tableData.find(item => item.id === id)?.originalItem;
            if (itemToDelete) {
              handleDeleteNotice(id);
            } else {
              console.error("Original item not found for deletion");
            }
          }}
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
            modalTitle: "Add Notice",
          }}
        />
      </div>
    </div>
  );
}