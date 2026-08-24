const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Order = require('./Order'); // Ensure Order.js is in the same 'server' folder

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
// Note: Using the standard connection string format to bypass SRV DNS issues
// Ensure this part exactly matches your terminal's setName
const URI = "mongodb://marwat_admin:TL2efbg4lSWyhq74@cluster0-shard-00-00.ee10mm7.mongodb.net:27017,cluster0-shard-00-01.ee10mm7.mongodb.net:27017,cluster0-shard-00-02.ee10mm7.mongodb.net:27017/MarwatGasDB?ssl=true&replicaSet=atlas-9x1v2i-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(URI, {
    serverSelectionTimeoutMS: 5000 
})
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => {
      console.error("Could not connect to database", err);
      process.exit(1);
  });

// API ROUTES
// Route to add a new order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json(err);
  }
});

// Route to fetch all orders
app.get('/api/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json(err);
    }
  });

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));