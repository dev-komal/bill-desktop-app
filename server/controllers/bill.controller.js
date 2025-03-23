
const db = require('../models');
const Bill = db.Bill;
const BillItem = db.BillItem;
const Customer = db.Customer;
const Item = db.Item;
const sequelize = db.sequelize;

// Create and Save a new Bill
exports.create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Validate request
    if (!req.body.customerName) {
      return res.status(400).send({
        message: "Customer name cannot be empty!"
      });
    }

    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).send({
        message: "Bill must have at least one item!"
      });
    }

    // Find or create customer
    let customer = await Customer.findOne({ 
      where: { name: req.body.customerName },
      transaction: t
    });

    if (!customer) {
      customer = await Customer.create({
        name: req.body.customerName
      }, { transaction: t });
    }

    // Create the bill
    const bill = await Bill.create({
      customerId: customer.id,
      totalAmount: req.body.totalAmount,
      totalGst: req.body.totalGst
    }, { transaction: t });

    // Create bill items
    const billItemPromises = req.body.items.map(item => {
      return BillItem.create({
        billId: bill.id,
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
        gstPercentage: item.gstPercentage,
        totalPrice: item.totalPrice,
        gstAmount: item.gstAmount
      }, { transaction: t });
    });

    await Promise.all(billItemPromises);
    await t.commit();

    res.status(201).send({
      id: bill.id,
      customerName: customer.name,
      items: req.body.items,
      totalAmount: bill.totalAmount,
      totalGst: bill.totalGst,
      createdAt: bill.createdAt
    });

  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Bill."
    });
  }
};

// Retrieve all Bills from the database.
exports.findAll = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: [
        {
          model: Customer,
          attributes: ['name']
        },
        {
          model: BillItem,
          include: [{
            model: Item,
            attributes: ['name']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Format the response to match the existing structure in the frontend
    const formattedBills = bills.map(bill => {
      const billItems = bill.BillItems.map(billItem => {
        return {
          id: billItem.itemId,
          name: billItem.Item.name,
          quantity: billItem.quantity,
          price: parseFloat(billItem.price),
          gstPercentage: billItem.gstPercentage,
          totalPrice: parseFloat(billItem.totalPrice),
          gstAmount: parseFloat(billItem.gstAmount)
        };
      });

      return {
        id: bill.id,
        customerName: bill.Customer.name,
        items: billItems,
        totalAmount: parseFloat(bill.totalAmount),
        totalGst: parseFloat(bill.totalGst),
        createdAt: bill.createdAt
      };
    });

    res.send(formattedBills);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bills."
    });
  }
};

// Find a single Bill with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const bill = await Bill.findByPk(id, {
      include: [
        {
          model: Customer,
          attributes: ['name']
        },
        {
          model: BillItem,
          include: [{
            model: Item,
            attributes: ['name']
          }]
        }
      ]
    });

    if (!bill) {
      return res.status(404).send({
        message: `Bill with id=${id} not found.`
      });
    }

    // Format the response
    const billItems = bill.BillItems.map(billItem => {
      return {
        id: billItem.itemId,
        name: billItem.Item.name,
        quantity: billItem.quantity,
        price: parseFloat(billItem.price),
        gstPercentage: billItem.gstPercentage,
        totalPrice: parseFloat(billItem.totalPrice),
        gstAmount: parseFloat(billItem.gstAmount)
      };
    });

    const formattedBill = {
      id: bill.id,
      customerName: bill.Customer.name,
      items: billItems,
      totalAmount: parseFloat(bill.totalAmount),
      totalGst: parseFloat(bill.totalGst),
      createdAt: bill.createdAt
    };

    res.send(formattedBill);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Bill with id=" + id
    });
  }
};
