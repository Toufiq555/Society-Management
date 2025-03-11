const express = require("express");
const router = express.Router();
const {
  addNotices,
  getNotices,
  deleteNotices,
} = require("../controllers/noticeController");

router.post("/add-notice", addNotices);
router.get("/get-notice", getNotices);
router.delete("/:id", deleteNotices);
module.exports = router;
