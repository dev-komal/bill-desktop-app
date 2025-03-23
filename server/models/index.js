
const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: console.log
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Item = require('./item.model')(sequelize, Sequelize);
db.Bill = require('./bill.model')(sequelize, Sequelize);
db.BillItem = require('./billitem.model')(sequelize, Sequelize);
db.Customer = require('./customer.model')(sequelize, Sequelize);

// Define relationships
db.Bill.belongsTo(db.Customer, { foreignKey: 'customerId' });
db.Customer.hasMany(db.Bill, { foreignKey: 'customerId' });

db.Bill.hasMany(db.BillItem, { foreignKey: 'billId' });
db.BillItem.belongsTo(db.Bill, { foreignKey: 'billId' });

db.BillItem.belongsTo(db.Item, { foreignKey: 'itemId' });
db.Item.hasMany(db.BillItem, { foreignKey: 'itemId' });

module.exports = db;
