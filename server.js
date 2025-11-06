// Import packages, initialize an express app, and define the port you will use
const express = require("express");
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

  next(); // pass control to the next middleware/route
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
app.post("/api/menu", (req, res) => {
  console.log("Request body:", req.body); // debug line
  const newItem = {
    id: menuItems.length ? Math.max(...menuItems.map(i => i.id)) + 1 : 1,
    ...req.body
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT for Updating an existing menu item
app.put("/api/menu/:id", (req, res) => {
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