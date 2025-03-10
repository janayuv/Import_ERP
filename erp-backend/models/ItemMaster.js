// erp-backend/models/ItemMaster.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // adjust path as needed

const ItemMaster = sequelize.define('ItemMaster', {
  part_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  hs_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bcd_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sws_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  igst_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = ItemMaster;