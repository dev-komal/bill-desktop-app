
module.exports = (sequelize, DataTypes) => {
  const BillItem = sequelize.define('BillItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    billId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bills',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    gstPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    gstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: false,
    tableName: 'bill_items'
  });

  return BillItem;
};
