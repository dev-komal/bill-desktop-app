
const db = require('../models');
const Customer = db.Customer;

// Create and Save a new Customer
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name) {
      return res.status(400).send({
        message: "Name cannot be empty!"
      });
    }

    // Create a Customer
    const customer = {
      name: req.body.name,
      email: req.body.email || null,
      phone: req.body.phone || null,
      address: req.body.address || null
    };

    // Save Customer in the database
    const data = await Customer.create(customer);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Customer."
    });
  }
};

// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
  try {
    const data = await Customer.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving customers."
    });
  }
};

// Find a single Customer with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Customer.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Customer with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Customer with id=" + id
    });
  }
};
