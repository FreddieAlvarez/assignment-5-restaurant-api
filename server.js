// Import packages, initialize an express app, and define the port you will use
const express = require("express");
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

app.use(express.json());

// request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  // Log body for POST and PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }

  next(); 
};

// Apply the middleware
app.use(requestLogger);


// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Validation Middleware
const menuValidation = [
  body('name').isString().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('description').isString().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  body('category').isIn(['appetizer', 'entree', 'dessert', 'beverage']).withMessage('Category must be one of: appetizer, entree, dessert, beverage'),
  body('ingredients').isArray({ min: 1 }).withMessage('Ingredients must be an array with at least 1 item'),
  body('available').optional().isBoolean().withMessage('Available must be true or false')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({ error: 'Validation failed', messages: errorMessages });
  }

  if (req.body.available === undefined) req.body.available = true;
  next();
};

// Define routes and implement middleware here

// GET /api/menu - get all menu items
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

// GET /api/menu/:id - Retrieve a specific menu item
app.get("/api/menu/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = menuItems.find(m => m.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
});

//POST for adding new menu item
app.post("/api/menu", menuValidation, handleValidationErrors, (req, res) => {
  const newItem = {
    id: menuItems.length ? Math.max(...menuItems.map(i => i.id)) + 1 : 1,
    ...req.body
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT for Updating an existing menu item
app.put("/api/menu/:id", menuValidation, handleValidationErrors, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = menuItems.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ message: "Item not found" });

  const updated = { id, ...req.body };
  menuItems[index] = updated;
  res.json(updated);
});
// DELETE for removing a menu item
app.delete("/api/menu/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = menuItems.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ message: "Item not found" });

  const deletedItem = menuItems.splice(index, 1)[0];
  res.json(deletedItem);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});