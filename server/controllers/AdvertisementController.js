// const path = require("path");
// const fs = require("fs");
// const os = require("os");
// const db = require("../config/db");

// const UPLOAD_DIR = path.join(__dirname, "../public/uploads/ads");

// function getLocalIp() {
//   const interfaces = os.networkInterfaces();
//   for (const name in interfaces) {
//     for (const iface of interfaces[name]) {
//       if (iface.family === "IPv4" && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }
//   return "localhost";
// }

// exports.addAdvertisement = async (req, res) => {
//   try {
//     let ImageUrl = null;

//     // Check if image is uploaded
//     if (req.files && req.files.image) {
//       const image = req.files.image;
//       const sanitizedFileName = image.name.replace(/[:]/g, "-");
//       const fileName = `${Date.now()}_${sanitizedFileName}`;
//       const savePath = path.join(UPLOAD_DIR, fileName);

//       // Create upload directory if it doesn't exist
//       if (!fs.existsSync(UPLOAD_DIR)) {
//         try {
//           fs.mkdirSync(UPLOAD_DIR, { recursive: true });
//         } catch (err) {
//           console.error("Error creating upload directory:", err);
//           return res.status(500).json({ success: false, message: "Failed to create directory" });
//         }
//       }

//       try {
//         await image.mv(savePath);

//         // Dynamically build image URL using local IP
//         const serverIp = getLocalIp();
//         const imageUrlPath = `/uploads/ads/${fileName}`;
//         ImageUrl = `http://${serverIp}:8080${imageUrlPath}`;
//         console.log("Saved Image URL:", ImageUrl);

//       } catch (err) {
        
//         console.error("File upload error:", err);
//         return res.status(500).json({ success: false, message: "Error saving image" });
//       }
//     } else {
//       return res.status(400).json({ success: false, message: "No image file provided" });
//     }

//     // Save advertisement record to database
//     const insertQuery = "INSERT INTO advertisements (ImageUrl) VALUES (?)";
//     db.query(insertQuery, [ImageUrl], (err, result) => {
//       if (err) {
//         console.error("Insert error:", err);
//         return res.status(500).json({ success: false, message: "Database error" });
//       }

//       return res.json({
//         success: true,
//         message: "Advertisement added successfully",
//         advertisement: {
//           id: result.insertId,
//           ImageUrl: ImageUrl,
//         },
//       });
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ success: false, message: "Upload failed" });
//   }
// };
// // Refactored getAdvertisements to use promise-based queries
// exports.getAdvertisements = async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM advertisements ORDER BY CreatedAt DESC');
//     console.log("Data Fetch",rows);
//     res.json({ success: true, advertisements: rows });
//   } catch (err) {
//     console.error("Error fetching advertisements:", err);
//     res.status(500).send("Error fetching advertisements");
//   }
// };

// exports.deleteAdvertisement = async (req, res) => {
//   const adId = req.params.id;

//   try {
//     // Use promise-based query to get advertisement details
//     const [results] = await db.query("SELECT ImageUrl FROM advertisements WHERE id = ?", [adId]);

//     if (results.length === 0) {
//       return res.status(404).json({ success: false, message: "Advertisement not found" });
//     }

//     const ImageUrl = results[0].ImageUrl;
//     const localPathPrefix = "http://localhost:8080/uploads/ads/";

//     if (ImageUrl && ImageUrl.startsWith(localPathPrefix)) {
//       const fileName = ImageUrl.replace(localPathPrefix, "");
//       const filePath = path.join(UPLOAD_DIR, fileName);

//       // Delete the file if it exists
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     }

//     // Use promise-based query to delete the advertisement
//     await db.query("DELETE FROM advertisements WHERE id = ?", [adId]);

//     res.json({ success: true, message: "Advertisement deleted successfully" });
//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


const path = require("path");
const fs = require("fs");
const os = require("os");
const db = require("../config/db");

const UPLOAD_DIR = path.join(__dirname, "../public/uploads/ads");

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const addAdvertisement = async (req, res) => {
  try {
    let ImageUrl = null;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const sanitizedFileName = image.name.replace(/[:]/g, "-");
      const fileName = `${Date.now()}_${sanitizedFileName}`;
      const savePath = path.join(UPLOAD_DIR, fileName);

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      await image.mv(savePath);

      const serverIp = getLocalIp();
      ImageUrl = `http://${serverIp}:8080/uploads/ads/${fileName}`;
    } else {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const insertQuery = "INSERT INTO advertisements (ImageUrl) VALUES (?)";
    const [result] = await db.query(insertQuery, [ImageUrl]);

    return res.json({
      success: true,
      message: "Advertisement added successfully",
      advertisement: {
        id: result.insertId,
        ImageUrl,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

const getAdvertisements = async (req, res) => {
  console.log("getAdvertisements function called");
  try {
    console.log("Trying to query the database for advertisements");
    const [rows] = await db.query("SELECT * FROM advertisements ORDER BY CreatedAt DESC");
    console.log("Database query executed successfully. Result:", rows);

    console.log("Sending JSON response with success and data");
    res.json({ success: true, advertisements: rows });
    console.log("JSON response sent successfully");
  } catch (err) {
    console.error("Error fetching advertisements:", err);
    console.log("Error occurred. Sending 500 status code and error message");
    res.status(500).json({ success: false, message: "Error fetching advertisements" });
    console.log("500 status code and error message sent");
  }
};


const deleteAdvertisement = async (req, res) => {
  const adId = req.params.id;

  try {
    const [results] = await db.query("SELECT ImageUrl FROM advertisements WHERE id = ?", [adId]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }

    const ImageUrl = results[0].ImageUrl;
    const localPrefix = "http://localhost:8080/uploads/ads/";
    const serverPrefix = `http://${getLocalIp()}:8080/uploads/ads/`;

    const prefixToRemove = ImageUrl.startsWith(serverPrefix) ? serverPrefix : localPrefix;
    const fileName = ImageUrl.replace(prefixToRemove, "");
    const filePath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query("DELETE FROM advertisements WHERE id = ?", [adId]);

    res.json({ success: true, message: "Advertisement deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAdvertisements,
  addAdvertisement,
  deleteAdvertisement,
};
