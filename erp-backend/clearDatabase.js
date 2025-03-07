const sequelize = require('./config/database');
const { Shipment, Invoice, Part, BLAWB } = require('./models');

async function clearDatabase() {
    try {
        await Promise.all([
            Shipment.destroy({ where: {}, truncate: true }),
            Invoice.destroy({ where: {}, truncate: true }),
            Part.destroy({ where: {}, truncate: true }),
            BLAWB.destroy({ where: {}, truncate: true }),
        ]);
        console.log("All tables cleared successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing tables:", error);
        process.exit(1);
    }
}

clearDatabase();