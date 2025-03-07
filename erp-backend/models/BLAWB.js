// erp-backend/models/BLAWB.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BLAWB = sequelize.define('BLAWB', {
    blawb_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    forwarder: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mode: {
        type: DataTypes.ENUM('LCL', 'FCL', 'AIR', 'Courier'),
        allowNull: false,
        defaultValue: 'LCL',
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cbm: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vessel: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    containers: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    etd: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    eta: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    shipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
});

// Define associations for BLAWB
BLAWB.associate = models => {
    // A BLAWB belongs to a Shipment
    BLAWB.belongsTo(models.Shipment, {
        foreignKey: 'shipment_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
};

module.exports = BLAWB;