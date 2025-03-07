const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Import routes
const shipmentRoutes = require('./routes/shipment');
const invoiceRoutes = require('./routes/invoice');
const partRoutes = require('./routes/part');
const blawbRoutes = require('./routes/blawb');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('ERP Backend is running!');
});

// Mount routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/parts', partRoutes);
// BL/AWB routes use a full path within the file, so mounting at '/api' works well:
app.use('/api', blawbRoutes);

// Sync database and start server
sequelize.sync({ force: true }).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
