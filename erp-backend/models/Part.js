// erp-backend/models/Part.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Part = sequelize.define('Part', {
    part_no: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    unit: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        validate: { min: 1 } 
    },
    price: { 
        type: DataTypes.DECIMAL(10, 4), 
        allowNull: false, 
        validate: { min: 0 } 
    },
    total: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false, 
        validate: { min: 0 } 
    },
    invoice_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'Invoices', key: 'id' } 
    },
}, {
    timestamps: true,
});

// Define associations for Part
Part.associate = models => {
    // A Part belongs to an Invoice
    Part.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    });
};

module.exports = Part;
