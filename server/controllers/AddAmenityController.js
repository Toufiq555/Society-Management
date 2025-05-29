// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const os = require("os");
// const db = require("../config/db");
// //const router = express.Router();


// const UPLOAD_DIR_AMENITIES = path.join(__dirname, "../public/uploads/amenities");

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

// const addAmenity = async (req, res) => {
//   try {
//     let imageUrl = null;

//     // Check if image is uploaded
//     if (req.files && req.files.image) {
//       const image = req.files.image;
//       const sanitizedFileName = image.name.replace(/[:]/g, "-");
//       const fileName = `${Date.now()}_${sanitizedFileName}`;
//       const savePath = path.join(UPLOAD_DIR_AMENITIES, fileName);

//       // Create upload directory if it doesn't exist
//       if (!fs.existsSync(UPLOAD_DIR_AMENITIES)) {
//         try {
//           fs.mkdirSync(UPLOAD_DIR_AMENITIES, { recursive: true });
//         } catch (err) {
//           console.error("Error creating amenities upload directory:", err);
//           return res.status(500).json({ message: "Failed to create directory" });
//         }
//       }

//       try {
//         await image.mv(savePath);

//         // Dynamically build image URL using local IP
//         const serverIp = getLocalIp();
//         const imageUrlPath = `/uploads/amenities/${fileName}`;
//         imageUrl = `http://${serverIp}:8080${imageUrlPath}`;
//         console.log("Saved Amenity Image URL:", imageUrl);

//       } catch (err) {
//         console.error("File upload error (amenity):", err);
//         return res.status(500).json({ message: "Error saving amenity image" });
//       }
//     } else {
//       return res.status(400).json({ message: "No image file provided for amenity" });
//     }

//     // Save amenity record to database
//     const { name, capacity, price, advance } = req.body; // Removed description here
//     if (!name || !capacity || !price || !advance) {
//       return res.status(400).json({
//         message: "All fields (name, capacity, price, advance) are required", // Updated message
//       });
//     }

//     if (isNaN(capacity) || isNaN(price) || isNaN(advance)) {
//       return res.status(400).json({ message: "Capacity, price, and advance must be numbers" });
//     }

//     console.log(
//       "Data to be inserted into DB:",
//       name,
//       imageUrl,
//       capacity,
//       price,
//       advance
//     );

//     // ✅ Insert Query (Include imageUrl)
//     const [result] = await db.query(
//       "INSERT INTO amenities (name, imageUrl, capacity, price, advance) VALUES (?, ?, ?, ?, ?)",
//       [name, imageUrl, capacity, price, advance]
//     );

//     if (result.affectedRows === 1) {
//       return res.status(201).json({ success: true, message: "Amenity added successfully" });
//     } else {
//       return res.status(500).json({ success: false, message: "Failed to add Amenity" });
//     }
//   } catch (error) {
//     console.error("Error adding Amenity:", error.message, error.stack);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const getAmenity = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT id, name, imageUrl, capacity, price, advance, created_at FROM amenities ORDER BY created_at DESC"
//     );
//     res.json({ success: true, amenities: rows });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// };

// const deleteAmenity = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Get the imageUrl of the amenity to be deleted
//     const [imageResult] = await db.query("SELECT imageUrl FROM amenities WHERE id = ?", [id]);

//     if (imageResult.length > 0 && imageResult[0].imageUrl) {
//       const imageUrl = imageResult[0].imageUrl;
//       const localPathPrefix = `http://${getLocalIp()}:8080/uploads/amenities/`;

//       if (imageUrl.startsWith(localPathPrefix)) {
//         const fileName = imageUrl.replace(localPathPrefix, "");
//         const filePath = path.join(UPLOAD_DIR_AMENITIES, fileName);

//         if (fs.existsSync(filePath)) {
//           try {
//             fs.unlinkSync(filePath);
//             console.log("Deleted amenity image:", filePath);
//           } catch (err) {
//             console.error("Error deleting amenity image:", err);
//             // Don't block the deletion of the database record if image deletion fails
//           }
//         }
//       }
//     }

//     // Query execute & result destructure karein
//     const [result] = await db.query("DELETE FROM amenities WHERE id = ?", [id]);

//     //

//     // affectedRows check karein
//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Amenity not found" });
//     }

//     res.json({ success: true, message: "Amenity deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting amenity:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// /********************************************************************** */

// // Define all possible time slots on the backend as well for full-day logic
// const allTimeSlots = [
//   '8 AM ','TO', '11 PM'
// ];


// const getBookedSlots = async (req, res) => {
//   const { amenityName, date } = req.query;
//   console.log(`[getBookedSlots] Fetching booked slots for amenity: ${amenityName} on date: ${date}`);

//   if (!amenityName || !date) {
//     return res.status(400).json({ message: "Amenity name and date are required query parameters." });
//   }

//   try {
//     const queryDate = new Date(date).toISOString().split('T')[0];
//     console.log(`[getBookedSlots] Formatted date for query: ${queryDate}`);

//     const [rows] = await db.query(
//       `SELECT time_slots, booking_type FROM bookings
//        WHERE amenity_name = ?
//        AND (
//            (booking_type = 'hourly' AND start_date = ?)
//            OR
//            (booking_type = 'fullday' AND ? BETWEEN start_date AND end_date)
//        )`,
//       [amenityName, queryDate, queryDate]
//     );

//     let unavailableSlots = [];

//     if (rows.length > 0) {
//     console.log(`[getBookedSlots] Found ${rows.length} relevant bookings for ${amenityName} on ${queryDate}.`);
//       for (const row of rows) { // Using for...of for potential early exit if full-day found
//         console.log(`[getBookedSlots] Processing row: booking_type=${row.booking_type}, time_slots=${JSON.stringify(row.time_slots)}`);
//         if (row.booking_type === 'fullday') {
//           // If a full-day booking exists for this date, all slots are unavailable
//           unavailableSlots = allTimeSlots;
//           console.log(`[getBookedSlots] Full day booking found. All slots unavailable.`);
//           break; // Exit the loop early as all slots are now marked
//         } else if (row.booking_type === 'hourly') {
//           // Ensure time_slots is an array; db driver might return it as object
//           const slots = Array.isArray(row.time_slots) ? row.time_slots : [];
//           unavailableSlots = unavailableSlots.concat(slots);
//           console.log(`[getBookedSlots] Added hourly slots: ${JSON.stringify(slots)}`);
//         }
//       }
//     } else {
//        console.log(`[getBookedSlots] No bookings found for ${amenityName} on ${queryDate}.`);
//     }

//     unavailableSlots = [...new Set(unavailableSlots)]; // Ensure unique slots

//     console.log('Found unavailable slots for frontend:', unavailableSlots);
//     res.json({ success: true, unavailableSlots });

//   } catch (error) {
//     console.error('Error fetching booked slots:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching booked slots',
//       error: error.message,
//       stack: error.stack
//     });
//   }
// };


// // --- BOOK AMENITY CONTROLLER ---
// const bookAmenity = async (req, res) => {
//   console.log('Request body for bookAmenity:', JSON.stringify(req.body, null, 2));

//   // Destructure booking details from request body (matching frontend's keys)
//   const { amenityName, startDate, endDate, timeSlots, userBlock, userName, userFlat, bookingType } = req.body;

//   // Basic validation
//   if (!amenityName || !startDate || !userBlock || !userName || !userFlat || !bookingType) {
//     return res.status(400).json({ message: 'Missing required booking details.' });
//   }

//   // Frontend should ensure timeSlots is an array, but add a safeguard
//   if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
//       return res.status(400).json({ message: 'timeSlots must be a non-empty array.' });
//   }

//   try {
//     // Format dates to YYYY-MM-DD for MySQL DATE type
//     const parsedStartDate = new Date(startDate);
//     const formattedStartDate = parsedStartDate.toISOString().split('T')[0];

//     let formattedEndDate;
//     if (bookingType === 'fullday') {
//       const parsedEndDate = new Date(endDate);
//       if (isNaN(parsedEndDate.getTime()) || parsedEndDate < parsedStartDate) {
//         return res.status(400).json({ message: 'Invalid end date for full day booking.' });
//       }
//       formattedEndDate = parsedEndDate.toISOString().split('T')[0];
//     } else {
//       formattedEndDate = formattedStartDate; // For hourly, end date is the same as start date
//     }

//     console.log(`[bookAmenity] Processing booking: Amenity=${amenityName}, Type=${bookingType}, Start=${formattedStartDate}, End=${formattedEndDate}`);


//     // --- Clash Detection Logic ---
//     let conflictFound = false;
//     let conflictMessage = '';

//     if (bookingType === 'fullday') {
//       console.log(`[bookAmenity] Checking full-day clash for range ${formattedStartDate} to ${formattedEndDate}`);
//       const [clashRows] = await db.query(
//         `SELECT * FROM bookings
//          WHERE amenity_name = ?
//          AND (
//              (start_date BETWEEN ? AND ?)
//              OR (end_date BETWEEN ? AND ?)
//              OR (? BETWEEN start_date AND end_date)
//              OR (? BETWEEN start_date AND end_date)
//          )`,
//         [amenityName, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate]
//       );

//       if (clashRows.length > 0) {
//         conflictFound = true;
//         conflictMessage = 'Amenity is already booked for part or all of the selected full-day range.';
//         console.log(`[bookAmenity] Full-day clash detected:`, clashRows);
//       }

//     } else if (bookingType === 'hourly') {
//       console.log(`[bookAmenity] Checking hourly clash for date ${formattedStartDate} and slots ${JSON.stringify(timeSlots)}`);
//       const [clashRows] = await db.query(
//         `SELECT time_slots, booking_type FROM bookings
//          WHERE amenity_name = ?
//          AND start_date = ?
//          AND (
//              (booking_type = 'hourly' AND JSON_OVERLAPS(time_slots, ?))
//              OR
//              (booking_type = 'fullday')
//          )`,
//         [amenityName, formattedStartDate, JSON.stringify(timeSlots)]
//       );

//       if (clashRows.length > 0) {
//         console.log(`[bookAmenity] Hourly clash detected. Clash rows:`, clashRows);
//         const bookedHourlySlots = clashRows
//             .filter(row => row.booking_type === 'hourly')
//             // Fix: Assume db driver already parses JSON. If not, re-add JSON.parse
//             .map(row => row.time_slots)
//             .flat();
//         const fullDayBlocked = clashRows.some(row => row.booking_type === 'fullday');

//         if (fullDayBlocked) {
//             conflictFound = true;
//             conflictMessage = `Amenity is fully booked on ${formattedStartDate}. No hourly slots available.`;
//         } else {
//             const conflictingSlots = timeSlots.filter(slot => bookedHourlySlots.includes(slot));
//             if (conflictingSlots.length > 0) {
//                 conflictFound = true;
//                 conflictMessage = `Selected time slots are already booked: ${conflictingSlots.join(', ')}`;
//             }
//         }
//       }
//     }

//     if (conflictFound) {
//       return res.status(409).json({ message: conflictMessage });
//     }

//     // --- Insert New Booking ---
//     console.log('[bookAmenity] No conflict found. Attempting to insert booking:', {
//       amenity_name: amenityName,
//       user_name: userName,
//       user_block: userBlock,
//       user_flat: userFlat,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate,
//       time_slots: JSON.stringify(timeSlots), // Store as JSON string in DB
//       booking_type: bookingType,
//     });

//     await db.query(
//       `INSERT INTO bookings (amenity_name, user_name, user_block, user_flat, start_date, end_date, time_slots, booking_type)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [amenityName, userName, userBlock, userFlat, formattedStartDate, formattedEndDate, JSON.stringify(timeSlots), bookingType]
//     );
//     console.log('[bookAmenity] Booking insertion successful.');

//     return res.status(201).json({ message: 'Amenity booked successfully' });

//   } catch (error) {
//     console.error('[bookAmenity] Booking error in controller:', error);
//     // Return detailed error for debugging
//     return res.status(500).json({ message: 'Server error during booking', error: error.message, stack: error.stack });
//   }
// };

// const getAmenityByName = async (req, res) => {
//     try {
//         const { name } = req.params; // Extract the 'name' from the URL parameters
//         console.log(`[getAmenityByName] Fetching amenity details for: ${name}`);

//         // Query the database to find the amenity by its name
//         const [rows] = await db.query(
//             "SELECT id, name, imageUrl, capacity, price, advance, created_at FROM amenities WHERE name = ?",
//             [name]
//         );

//         if (rows.length > 0) {
//             // If an amenity is found, send it back in the response
//             console.log(`[getAmenityByName] Found amenity: ${name}`);
//             res.json({ success: true, amenity: rows[0] });
//         } else {
//             // If no amenity is found with that name, send a 404 Not Found
//             console.log(`[getAmenityByName] Amenity not found: ${name}`);
//             res.status(404).json({ success: false, message: "Amenity not found." });
//         }
//     } catch (error) {
//         // Catch any database or server errors
//         console.error('[getAmenityByName] Error fetching amenity by name:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error fetching amenity by name',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// };



// // Export all controller functions
// module.exports = { getAmenity, addAmenity, deleteAmenity, bookAmenity, getBookedSlots , getAmenityByName};


const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const db = require("../config/db");
//const router = express.Router();


const UPLOAD_DIR_AMENITIES = path.join(__dirname, "../public/uploads/amenities");

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

const addAmenity = async (req, res) => {
    try {
        let imageUrl = null;

        // Check if image is uploaded
        if (req.files && req.files.image) {
            const image = req.files.image;
            const sanitizedFileName = image.name.replace(/[:]/g, "-");
            const fileName = `${Date.now()}_${sanitizedFileName}`;
            const savePath = path.join(UPLOAD_DIR_AMENITIES, fileName);

            // Create upload directory if it doesn't exist
            if (!fs.existsSync(UPLOAD_DIR_AMENITIES)) {
                try {
                    fs.mkdirSync(UPLOAD_DIR_AMENITIES, { recursive: true });
                } catch (err) {
                    console.error("Error creating amenities upload directory:", err);
                    return res.status(500).json({ message: "Failed to create directory" });
                }
            }

            try {
                await image.mv(savePath);

                // Dynamically build image URL using local IP
                const serverIp = getLocalIp();
                const imageUrlPath = `/uploads/amenities/${fileName}`;
                imageUrl = `http://${serverIp}:8080${imageUrlPath}`;
                console.log("Saved Amenity Image URL:", imageUrl);

            } catch (err) {
                console.error("File upload error (amenity):", err);
                return res.status(500).json({ message: "Error saving amenity image" });
            }
        } else {
            return res.status(400).json({ message: "No image file provided for amenity" });
        }

        // Save amenity record to database
        const { name, capacity, price, advance } = req.body; // Removed description here
        if (!name || !capacity || !price || !advance) {
            return res.status(400).json({
                message: "All fields (name, capacity, price, advance) are required", // Updated message
            });
        }

        if (isNaN(capacity) || isNaN(price) || isNaN(advance)) {
            return res.status(400).json({ message: "Capacity, price, and advance must be numbers" });
        }

        console.log(
            "Data to be inserted into DB:",
            name,
            imageUrl,
            capacity,
            price,
            advance
        );

        // ✅ Insert Query (Include imageUrl)
        const [result] = await db.query(
            "INSERT INTO amenities (name, imageUrl, capacity, price, advance) VALUES (?, ?, ?, ?, ?)",
            [name, imageUrl, capacity, price, advance]
        );

        if (result.affectedRows === 1) {
            return res.status(201).json({ success: true, message: "Amenity added successfully" });
        } else {
            return res.status(500).json({ success: false, message: "Failed to add Amenity" });
        }
    } catch (error) {
        console.error("Error adding Amenity:", error.message, error.stack);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAmenity = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, imageUrl, capacity, price, advance, created_at FROM amenities ORDER BY created_at DESC"
        );
        res.json({ success: true, amenities: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

const deleteAmenity = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the imageUrl of the amenity to be deleted
        const [imageResult] = await db.query("SELECT imageUrl FROM amenities WHERE id = ?", [id]);

        if (imageResult.length > 0 && imageResult[0].imageUrl) {
            const imageUrl = imageResult[0].imageUrl;
            const localPathPrefix = `http://${getLocalIp()}:8080/uploads/amenities/`;

            if (imageUrl.startsWith(localPathPrefix)) {
                const fileName = imageUrl.replace(localPathPrefix, "");
                const filePath = path.join(UPLOAD_DIR_AMENITIES, fileName);

                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log("Deleted amenity image:", filePath);
                    } catch (err) {
                        console.error("Error deleting amenity image:", err);
                        // Don't block the deletion of the database record if image deletion fails
                    }
                }
            }
        }

        // Query execute & result destructure karein
        const [result] = await db.query("DELETE FROM amenities WHERE id = ?", [id]);

        //

        // affectedRows check karein
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Amenity not found" });
        }

        res.json({ success: true, message: "Amenity deleted successfully" });
    } catch (error) {
        console.error("Error deleting amenity:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



//### `getBookedSlots` Function Enhancement

//The `getBookedSlots` function needs to handle two scenarios: hourly booking availability and full-day booking availability.

//```javascript
// Define all possible time slots on the backend as well for full-day logic
// This array should match the frontend's timeSlots array exactly for consistent logic
const allTimeSlots = [
    '8 AM - 9 AM', '9 AM - 10 AM', '10 AM - 11 AM', '11 AM - 12 PM',
    '12 PM - 1 PM', '1 PM - 2 PM', '2 PM - 3 PM', '3 PM - 4 PM', '4 PM - 5 PM',
    '5 PM - 6 PM', '6 PM - 7 PM', '7 PM - 8 PM', '8 PM - 9 PM', '9 PM - 10 PM', '10 PM - 11 PM'
];


const getBookedSlots = async (req, res) => {
    const { amenityName, date, startDate, endDate, bookingType } = req.query;
    console.log(`[getBookedSlots] Fetching booked info for amenity: ${amenityName}, type: ${bookingType}, date(s): ${date || (startDate + ' to ' + endDate)}`);

    if (!amenityName || !bookingType) {
        return res.status(400).json({ message: "Amenity name and booking type are required query parameters." });
    }

    try {
        if (bookingType === 'hourly') {
            if (!date) {
                return res.status(400).json({ message: "Date is required for hourly booking availability." });
            }
            const queryDate = new Date(date).toISOString().split('T')[0];
            console.log(`[getBookedSlots - Hourly] Formatted date for query: ${queryDate}`);

            const [rows] = await db.query(
                `SELECT time_slots, booking_type FROM bookings
                WHERE amenity_name = ?
                AND (
                    (booking_type = 'hourly' AND start_date = ?)
                    OR
                    (booking_type = 'fullday' AND ? BETWEEN start_date AND end_date)
                )`,
                [amenityName, queryDate, queryDate]
            );

            let unavailableSlots = [];

            if (rows.length > 0) {
                console.log(`[getBookedSlots - Hourly] Found ${rows.length} relevant bookings for ${amenityName} on ${queryDate}.`);
                for (const row of rows) {
                    if (row.booking_type === 'fullday') {
                        // If a full-day booking exists for this date, all slots are unavailable
                        // Assuming 'allTimeSlots' is defined elsewhere in your code
                        unavailableSlots = allTimeSlots; 
                        console.log(`[getBookedSlots - Hourly] Full day booking found. All slots unavailable.`);
                        break; // Exit the loop early as all slots are now marked
                    } else if (row.booking_type === 'hourly') {
                        // Ensure time_slots is an array; db driver might return it as object
                        const slots = Array.isArray(row.time_slots) ? row.time_slots : JSON.parse(row.time_slots || '[]');
                        unavailableSlots = unavailableSlots.concat(slots);
                        console.log(`[getBookedSlots - Hourly] Added hourly slots: ${JSON.stringify(slots)}`);
                    }
                }
            } else {
                console.log(`[getBookedSlots - Hourly] No bookings found for ${amenityName} on ${queryDate}.`);
            }

            unavailableSlots = [...new Set(unavailableSlots)]; // Ensure unique slots
            console.log('Found unavailable slots for frontend (Hourly Final):', unavailableSlots);
            res.json({ success: true, unavailableSlots });

        } else if (bookingType === 'fullday') {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Start date and end date are required for full day booking availability." });
            }

            const queryStartDate = new Date(startDate).toISOString().split('T')[0];
            const queryEndDate = new Date(endDate).toISOString().split('T')[0];
            console.log(`[getBookedSlots - FullDay] Formatted date range for query: ${queryStartDate} to ${queryEndDate}`);

            // Find all unique dates that are booked (either hourly or full-day) within the requested range
            const [rows] = await db.query(
                `SELECT DISTINCT start_date, end_date, booking_type FROM bookings
                WHERE amenity_name = ?
                AND (
                    (start_date BETWEEN ? AND ?)
                    OR (end_date BETWEEN ? AND ?)
                    OR (? BETWEEN start_date AND end_date)
                    OR (? BETWEEN start_date AND end_date)
                )`,
                [amenityName, queryStartDate, queryEndDate, queryStartDate, queryEndDate, queryStartDate, queryEndDate]
            );

            console.log(`[getBookedSlots - FullDay] RAW DB Rows Found (from SQL query):`, rows);

           
            let unavailableDates = new Set(); // Use a Set to store unique dates

            if (rows.length > 0) {
                console.log(`[getBookedSlots - FullDay] Found ${rows.length} relevant bookings for ${amenityName} in range ${queryStartDate} to ${queryEndDate}.`);
                rows.forEach(row => {
                   
                    const bookingStartDateRaw = row.start_date; // This is '2025-05-25T18:30:00.000Z'
                    const bookingEndDateRaw = row.end_date;     // This is '2025-05-26T18:30:00.000Z'

                   
                    const startLocal = new Date(bookingStartDateRaw); // This is 2025-05-26 00:00:00 IST
                    const endLocal = new Date(bookingEndDateRaw);     // This is 2025-05-27 00:00:00 IST

                    // Ensure these represent the start of the local day for consistent iteration
                    startLocal.setHours(0, 0, 0, 0);
                    endLocal.setHours(0, 0, 0, 0);

                    
                    const bookingStartCalendarDay = startLocal.getFullYear() + '-' 
                                                + String(startLocal.getMonth() + 1).padStart(2, '0') + '-'
                                                + String(startLocal.getDate()).padStart(2, '0');
                    
                    // This is '2025-05-27'
                    const bookingEndCalendarDay = endLocal.getFullYear() + '-' 
                                                + String(endLocal.getMonth() + 1).padStart(2, '0') + '-'
                                                + String(endLocal.getDate()).padStart(2, '0');


                    console.log(`[getBookedSlots - FullDay] Processing booking from calendar day ${bookingStartCalendarDay} to ${bookingEndCalendarDay}`); 

                   
                    let currentIterDate = new Date(bookingStartCalendarDay); 
                    const endIterDate = new Date(bookingEndCalendarDay);


                    while (currentIterDate <= endIterDate) {
                        const formattedDate = currentIterDate.getFullYear() + '-' 
                                                + String(currentIterDate.getMonth() + 1).padStart(2, '0') + '-'
                                                + String(currentIterDate.getDate()).padStart(2, '0');
                                                
                        console.log(`[getBookedSlots - FullDay]   Checking date: ${formattedDate}, query range: ${queryStartDate} to ${queryEndDate}`); 

                        if (formattedDate >= queryStartDate && formattedDate <= queryEndDate) {
                            unavailableDates.add(formattedDate);
                            console.log(`[getBookedSlots - FullDay]   Added to unavailableDates SET: ${formattedDate}`); 
                        }
                        currentIterDate.setDate(currentIterDate.getDate() + 1); // Advance by local day
                    }
                });
            } else {
                console.log(`[getBookedSlots - FullDay] No bookings found for ${amenityName} in range ${queryStartDate} to ${queryEndDate}.`);
            }

            const sortedUnavailableDates = Array.from(unavailableDates).sort();
            console.log('Found unavailable dates for frontend (FullDay FINAL):', sortedUnavailableDates);
            res.json({ success: true, unavailableDates: sortedUnavailableDates });

        } else {
            return res.status(400).json({ message: "Invalid booking type provided. Must be 'hourly' or 'fullday'." });
        }

    } catch (error) {
        console.error('Error fetching booked slots/dates:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching booked slots/dates',
            error: error.message,
            stack: error.stack
        });
    }
};


// --- BOOK AMENITY CONTROLLER ---
const bookAmenity = async (req, res) => {
    console.log('Request body for bookAmenity:', JSON.stringify(req.body, null, 2));

    // Destructure booking details from request body (matching frontend's keys)
    const { amenityName, startDate, endDate, timeSlots, userBlock, userName, userFlat, bookingType } = req.body;

    // Basic validation
    if (!amenityName || !startDate || !userBlock || !userName || !userFlat || !bookingType) {
        return res.status(400).json({ message: 'Missing required booking details.' });
    }

    // Frontend should ensure timeSlots is an array, but add a safeguard
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
        return res.status(400).json({ message: 'timeSlots must be a non-empty array.' });
    }

    try {
        // Format dates to YYYY-MM-DD for MySQL DATE type
        const parsedStartDate = new Date(startDate);
        const formattedStartDate = parsedStartDate.toISOString().split('T')[0];

        let formattedEndDate;
        if (bookingType === 'fullday') {
            const parsedEndDate = new Date(endDate);
            if (isNaN(parsedEndDate.getTime()) || parsedEndDate < parsedStartDate) {
                return res.status(400).json({ message: 'Invalid end date for full day booking.' });
            }
            formattedEndDate = parsedEndDate.toISOString().split('T')[0];
        } else {
            formattedEndDate = formattedStartDate; // For hourly, end date is the same as start date
        }

        console.log(`[bookAmenity] Processing booking: Amenity=${amenityName}, Type=${bookingType}, Start=${formattedStartDate}, End=${formattedEndDate}`);


        // --- Clash Detection Logic ---
        let conflictFound = false;
        let conflictMessage = '';

        if (bookingType === 'fullday') {
            console.log(`[bookAmenity] Checking full-day clash for range ${formattedStartDate} to ${formattedEndDate}`);
            const [clashRows] = await db.query(
                `SELECT * FROM bookings
                WHERE amenity_name = ?
                AND (
                    (start_date BETWEEN ? AND ?)
                    OR (end_date BETWEEN ? AND ?)
                    OR (? BETWEEN start_date AND end_date)
                    OR (? BETWEEN start_date AND end_date)
                )`,
                [amenityName, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate]
            );

            if (clashRows.length > 0) {
                conflictFound = true;
                conflictMessage = 'Amenity is already booked for part or all of the selected full-day range.';
                console.log(`[bookAmenity] Full-day clash detected:`, clashRows);
            }

        } else if (bookingType === 'hourly') {
            console.log(`[bookAmenity] Checking hourly clash for date ${formattedStartDate} and slots ${JSON.stringify(timeSlots)}`);
            const [clashRows] = await db.query(
                `SELECT time_slots, booking_type FROM bookings
                WHERE amenity_name = ?
                AND start_date = ?
                AND (
                    (booking_type = 'hourly' AND JSON_OVERLAPS(time_slots, ?))
                    OR
                    (booking_type = 'fullday')
                )`,
                [amenityName, formattedStartDate, JSON.stringify(timeSlots)]
            );

            if (clashRows.length > 0) {
                console.log(`[bookAmenity] Hourly clash detected. Clash rows:`, clashRows);
                const bookedHourlySlots = clashRows
                    .filter(row => row.booking_type === 'hourly')
                    // Fix: Assume db driver already parses JSON. If not, re-add JSON.parse
                    .map(row => JSON.parse(row.time_slots || '[]')) // Ensure parsing if DB stores as string
                    .flat();
                const fullDayBlocked = clashRows.some(row => row.booking_type === 'fullday');

                if (fullDayBlocked) {
                    conflictFound = true;
                    conflictMessage = `Amenity is fully booked on ${formattedStartDate}. No hourly slots available.`;
                } else {
                    const conflictingSlots = timeSlots.filter(slot => bookedHourlySlots.includes(slot));
                    if (conflictingSlots.length > 0) {
                        conflictFound = true;
                        conflictMessage = `Selected time slots are already booked: ${conflictingSlots.join(', ')}`;
                    }
                }
            }
        }

        if (conflictFound) {
            return res.status(409).json({ message: conflictMessage });
        }

        // --- Insert New Booking ---
        console.log('[bookAmenity] No conflict found. Attempting to insert booking:', {
            amenity_name: amenityName,
            user_name: userName,
            user_block: userBlock,
            user_flat: userFlat,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            time_slots: JSON.stringify(timeSlots), // Store as JSON string in DB
            booking_type: bookingType,
        });

        await db.query(
            `INSERT INTO bookings (amenity_name, user_name, user_block, user_flat, start_date, end_date, time_slots, booking_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [amenityName, userName, userBlock, userFlat, formattedStartDate, formattedEndDate, JSON.stringify(timeSlots), bookingType]
        );
        console.log('[bookAmenity] Booking insertion successful.');

        return res.status(201).json({ message: 'Amenity booked successfully' });

    } catch (error) {
        console.error('[bookAmenity] Booking error in controller:', error);
        // Return detailed error for debugging
        return res.status(500).json({ message: 'Server error during booking', error: error.message, stack: error.stack });
    }
};



const getMyBookings = async (req, res) => {
    // --- WARNING: SECURITY RISK ---
    // This endpoint is now relying on query parameters for user identification
    // and is NOT using JWT (req.user) to verify the user.
    // This means ANYONE can potentially request bookings for ANY block/flat number
    // if they know the URL and parameter names.
    // This is generally NOT recommended for private user data.
    // --- END WARNING ---

    // Extract user details from query parameters
    const userBlock = req.query.block;
    const userFlat = req.query.flatNo;
    // Note: If you used a 'userId' in query params, you'd get it here too.

    console.log(`[getMyBookings] Attempting to fetch bookings for: Block=${userBlock}, Flat=${userFlat}`);

    // Basic validation for query parameters
    if (!userBlock || !userFlat) {
        return res.status(400).json({
            success: false,
            message: "Block and flat number are required as query parameters (e.g., /my-bookings?block=A&flatNo=101)."
        });
    }

    try {
        let rows;

        // Use parameterized query to prevent SQL injection
        // Adjust column names (user_block, user_flat) to match your database schema
        // Also ensure amenity_name and time_slots correctly map to your DB columns
        [rows] = await db.query( // Assuming db.query returns rows directly, or { rows } if it's like a pg.Pool.query
            `SELECT
                id,
                amenity_name AS amenityName,
                DATE_FORMAT(start_date, '%Y-%m-%d') AS bookingDate,
                DATE_FORMAT(end_date, '%Y-%m-%d') AS endDate,
                time_slots AS bookingTime,  -- Assuming time_slots now holds the booking time string
                booking_type AS bookingType
            FROM bookings
            WHERE user_block = ? AND user_flat = ?
            ORDER BY start_date DESC, id DESC`,
            [userBlock, userFlat] // Use the values from query parameters
        );

        console.log(`[getMyBookings] Fetched ${rows.length} bookings for Block=${userBlock}, Flat=${userFlat}.`);

        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No bookings found for the provided details.",
                bookings: []
            });
        }

        // Send the fetched bookings
        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully.",
            bookings: rows
        });

    } catch (error) {
        console.error("[getMyBookings] Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred while fetching bookings.",
            error: error.message
        });
    }
};


const getAmenityByName = async (req, res) => {
    try {
        const { name } = req.params; // Extract the 'name' from the URL parameters
        console.log(`[getAmenityByName] Fetching amenity details for: ${name}`);

        // Query the database to find the amenity by its name
        const [rows] = await db.query(
            "SELECT id, name, imageUrl, capacity, price, advance, created_at FROM amenities WHERE name = ?",
            [name]
        );

        if (rows.length > 0) {
            // If an amenity is found, send it back in the response
            console.log(`[getAmenityByName] Found amenity: ${name}`);
            res.json({ success: true, amenity: rows[0] });
        } else {
            // If no amenity is found with that name, send a 404 Not Found
            console.log(`[getAmenityByName] Amenity not found: ${name}`);
            res.status(404).json({ success: false, message: "Amenity not found." });
        }
    } catch (error) {
        // Catch any database or server errors
        console.error('[getAmenityByName] Error fetching amenity by name:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching amenity by name',
            error: error.message,
            stack: error.stack
        });
    }
};





// Export all controller functions
module.exports = { getAmenity, addAmenity, deleteAmenity, bookAmenity, getBookedSlots, getAmenityByName, getMyBookings };