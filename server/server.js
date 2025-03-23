
const express = require("express");
const cors = require("cors");
const db = require("./models");

// Create Express app
const app = express();

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins
app.use(cors());

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hardware Billing API." });
});

// Include routes
require("./routes/item.routes")(app);
require("./routes/customer.routes")(app);
require("./routes/bill.routes")(app);

// Set port and listen for requests
const PORT = process.env.PORT || 4000;

// Sync database and start server
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database connected!");
    
    // Add some initial data if the tables are empty
    seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error("Failed to sync database:", err.message);
  });

// Function to seed database with initial data if empty
async function seedDatabase() {
  try {
    const itemCount = await db.Item.count();
    if (itemCount === 0) {
      const items = [
        {
          name: 'Hammer',
          description: 'Claw hammer with wooden handle',
          category: 'Tools',
          price: 299,
          gstPercentage: 18,
          stock: 25
        },
        {
          name: 'Screwdriver Set',
          description: 'Set of 10 screwdrivers with various heads',
          category: 'Tools',
          price: 599,
          gstPercentage: 18,
          stock: 15
        },
        {
          name: 'PVC Pipe (10ft)',
          description: '1 inch diameter PVC pipe',
          category: 'Plumbing',
          price: 120,
          gstPercentage: 12,
          stock: 50
        },
        {
          name: 'Wire (10m)',
          description: '2.5mm electrical copper wire',
          category: 'Electrical',
          price: 350,
          gstPercentage: 18,
          stock: 30
        },
        {
          name: 'Wall Paint (4L)',
          description: 'Interior wall paint, white color',
          category: 'Paints',
          price: 899,
          gstPercentage: 28,
          stock: 20
        },
        {
          name: 'Door Handle',
          description: 'Stainless steel door handle with lock',
          category: 'Hardware',
          price: 499,
          gstPercentage: 18,
          stock: 35
        },
        {
          name: 'Cement (50kg)',
          description: 'Portland cement bag',
          category: 'Building Materials',
          price: 380,
          gstPercentage: 28,
          stock: 100
        }
      ];

      await db.Item.bulkCreate(items);
      console.log("Database seeded with initial items!");
    }
  } catch (err) {
    console.error("Error seeding database:", err.message);
  }
}
