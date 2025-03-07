// erp-backend/models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    supplier: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    invoice_no: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    date: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    material: {
        type: DataTypes.ENUM('RM', 'CG', 'SP', 'SM'),
        allowNull: false,
    },       
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD',
    },
    invoice_total: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    shipment_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null if an invoice might not be linked to a shipment
    }
}, {
    timestamps: true,
});

// Define associations for Invoice
Invoice.associate = models => {
    // An Invoice belongs to a Shipment
    Invoice.belongsTo(models.Shipment, {
        foreignKey: 'shipment_id',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    });
    // An Invoice has many Parts
    Invoice.hasMany(models.Part, {
        foreignKey: 'invoice_id'
    });
};

module.exports = Invoice;