// server/models/Menu.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [menuItemSchema]
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategories: [subcategorySchema],
  items: [menuItemSchema]
});

const Menu = mongoose.model('Menu', mongoose.Schema({
  menu: [categorySchema]
}));

module.exports = Menu;