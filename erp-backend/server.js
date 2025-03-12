const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Load environment variables (if needed)
dotenv.config();

// Import your database model for bulk insert
const ItemMaster = require('./models/ItemMaster');

// Import routes
const shipmentRoutes = require('./routes/shipment');
const invoiceRoutes = require('./routes/invoice');
const partRoutes = require('./routes/part');
const blawbRoutes = require('./routes/blawb'); // <-- Import BL/AWB routes
const itemMasterRoutes = require('./routes/itemMaster');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up file storage for uploads using multer's diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename with timestamp
  },
});

// Initialize multer with storage configuration
const uploadMiddleware = multer({ storage });

// Route registration
app.use('/api/shipments', shipmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/parts', partRoutes);
app.use('/api', blawbRoutes); // Mount BL/AWB routes (adjust the prefix as needed)
app.use('/api/itemmasters', itemMasterRoutes);

// Upload route for Excel files
app.post('/api/upload', uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Get the uploaded file path
  const filePath = req.file.path;
  console.log(`Uploaded file path: ${filePath}`);

  try {
    // Read the uploaded Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    console.log("Extracted Data:", jsonData);

    // Push extracted data to the database (bulk insert)
    // Ensure that jsonData keys exactly match your ItemMaster model attributes.
    await ItemMaster.bulkCreate(jsonData);

    // Clean up: delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ 
      message: "File uploaded, processed, and data inserted successfully!", 
      data: jsonData 
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ message: "Error processing Excel file." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
