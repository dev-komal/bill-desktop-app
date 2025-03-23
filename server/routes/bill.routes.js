
module.exports = app => {
  const bills = require("../controllers/bill.controller.js");
  const router = require("express").Router();

  // Create a new Bill
  router.post("/", bills.create);

  // Retrieve all Bills
  router.get("/", bills.findAll);

  // Retrieve a single Bill with id
  router.get("/:id", bills.findOne);

  app.use("/api/bills", router);
};
