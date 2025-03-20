const db = require("../config/db");

// 🔹 ADD NOTICE (MySQL2 Raw Query)
const addNotices = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // ✅ MySQL2 Query for INSERT
    const [result] = await db.query(
      "INSERT INTO notices (title, description) VALUES (?, ?)",
      [title, description]
    );

    if (result.affectedRows === 1) {
      return res
        .status(201)
        .json({ success: true, message: "Notice added successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add notice" });
    }
  } catch (error) {
    console.error("Error adding notice:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔹 GET ALL NOTICES
const getNotices = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notices ORDER BY created_at DESC"
    );
    res.json({ success: true, notices: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

// delete notice
const deleteNotices = async (req, res) => {
  try {
    const { id } = req.params;

    // Query execute & result destructure karein
    const [result] = await db.query("DELETE FROM notices WHERE id = ?", [id]);

    // affectedRows check karein
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }

    res.json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { addNotices, getNotices, deleteNotices };
