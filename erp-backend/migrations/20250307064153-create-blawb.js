'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BLAWBs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      blawb_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      forwarder: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mode: {
        type: Sequelize.ENUM('LCL', 'FCL', 'AIR', 'Courier'),
        allowNull: false,
        defaultValue: 'LCL'
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      cbm: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      vessel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      containers: {
        type: Sequelize.STRING,
        allowNull: false
      },
      etd: {
        type: Sequelize.DATE,
        allowNull: false
      },
      eta: {
        type: Sequelize.DATE,
        allowNull: false
      },
      shipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Shipments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BLAWBs');
  }
};
