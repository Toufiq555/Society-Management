const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const http = require("http");
const bodyParser = require("body-parser");

const connectDB = require("./config/db.js");
const db = require("./config/db.js"); // For direct MySQL query

const chatRoutes = require("./routes/chatRoutes.js");
const members = require("./routes/members.js");
const userRoutes = require("./routes/userRoutes.js");
const guestRoutes = require("./routes/guestRoutes.js");
const DeliveryRoutes = require("./routes/DeliveryRoutes.js");
const noticeRoutes = require("./routes/noticeRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const AmenitiesRoutes = require("./routes/AmenitiesRoutes.js");
const AdvertisementRoutes = require("./routes/AdvertisementRoutes.js");
const { initializeSocket } = require('./socket'); // Import initializeSocket

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes


app.use("/api/v1/members", members);
app.use("/api/v1/guests", guestRoutes);
app.use("/api/v1/Deliveries", DeliveryRoutes);
app.use("/api/v1/amenities", AmenitiesRoutes);
// app.use("/api/v1/amenities/booked-slots",AmenitiesRoutes);

app.use('/api/v1/chats', chatRoutes);

app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/advertisements", AdvertisementRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server Running on PORT ${PORT}`.bgGreen.white);
});
