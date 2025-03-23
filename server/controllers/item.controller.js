
const db = require('../models');
const Item = db.Item;
const { Op } = require('sequelize');

// Create and Save a new Item
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.price) {
      return res.status(400).send({
        message: "Name and price cannot be empty!"
      });
    }

    // Create an Item
    const item = {
      name: req.body.name,
      description: req.body.description || "",
      category: req.body.category,
      price: req.body.price,
      gstPercentage: req.body.gstPercentage,
      stock: req.body.stock || 1
    };

    // Save Item in the database
    const data = await Item.create(item);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Item."
    });
  }
};

// Retrieve all Items from the database.
exports.findAll = async (req, res) => {
  try {
    const data = await Item.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving items."
    });
  }
};

// Find a single Item with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Item.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Item with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Item with id=" + id
    });
  }
};

// Search Items by name
exports.search = async (req, res) => {
  const search = req.query.search;

  try {
    const data = await Item.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        }
      }
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while searching items."
    });
  }
};

// Update an Item by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Item.update(req.body, {
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Item was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Item with id=${id}. Maybe Item was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating Item with id=" + id
    });
  }
};

// Delete an Item with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Item.destroy({
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Item was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Item with id=" + id
    });
  }
};
