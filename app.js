const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/canteen", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Canteen Management Database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// User Schema and Model (Canteen Staff/Admin)
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Signup Route for Staff/Admin
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Login Route for Staff/Admin
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Food Item Schema and Model
const foodItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  availability: { type: Boolean, default: true },
});
const FoodItem = mongoose.model("FoodItem", foodItemSchema);

// Get All Food Items
app.get("/api/food", async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json(foodItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch food items" });
  }
});

// Get Food Item by ID
app.get("/api/food/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FoodItem.findOne({ id });
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(foodItem);
  } catch (err) {
    res.status(500).json({ message: "Error in fetching food item" });
  }
});

// Add New Food Item
app.post("/api/food", async (req, res) => {
  const { name, price, category, availability } = req.body;
  try {
    const newFoodItem = new FoodItem({
      id: uuidv4(),
      name,
      price,
      category,
      availability,
    });
    const savedFoodItem = await newFoodItem.save();
    res.status(201).json(savedFoodItem);
  } catch (err) {
    res.status(500).json({ message: "Error in creating food item", err });
  }
});

// Update Food Item
app.put("/api/food/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category, availability } = req.body;
  try {
    const updatedFoodItem = await FoodItem.findOneAndUpdate(
      { id },
      { name, price, category, availability },
      { new: true }
    );
    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ message: "Updated successfully", updatedFoodItem });
  } catch (error) {
    res.status(500).json({ message: "Error in updating food item", error });
  }
});

// Delete Food Item
app.delete("/api/food/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFoodItem = await FoodItem.findOneAndDelete({ id });
    if (!deletedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ message: "Food item deleted successfully", deletedFoodItem });
  } catch (err) {
    res.status(500).json({ message: "Error in deleting food item", err });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Canteen Management System server is running on port 3000");
});
