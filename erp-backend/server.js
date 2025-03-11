const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Import routes
const shipmentRoutes = require('./routes/shipment');
const invoiceRoutes = require('./routes/invoice');
const partRoutes = require('./routes/part');
const blawbRoutes = require('./routes/blawb'); // <-- Import BL/AWB routes
const itemMasterRoutes = require('./routes/itemMaster');

// Middleware
app.use(cors());
app.use(express.json());

// Route registration
app.use('/api/shipments', shipmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/parts', partRoutes);
app.use('/api', blawbRoutes); // Mount BL/AWB routes (adjust the prefix as needed)
app.use('/api/itemmasters', itemMasterRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
