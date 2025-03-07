// erp-backend/models/Shipment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
    shipment_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
});

// Define associations for Shipment
Shipment.associate = models => {
    // A Shipment has many Invoices
    Shipment.hasMany(models.Invoice, {
        foreignKey: 'shipment_id'
    });
    // A Shipment has many BLAWBs
    Shipment.hasMany(models.BLAWB, {
        foreignKey: 'shipment_id'
    });
};

module.exports = Shipment;