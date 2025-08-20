// server/routes/menu.js
const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get the entire menu
router.get('/', async (req, res) => {
  try {
    const menu = await Menu.findOne();
    res.json(menu ? menu.menu : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new item to the menu
router.post('/add', async (req, res) => {
  try {
    const { category, subcategory, name, price, image } = req.body;
    const menu = await Menu.findOne();
    
    if (!menu) {
      // If no menu exists, create a new one
      const newMenu = new Menu({ menu: [{ category, icon: 'defaultIcon', items: [{ name, price, image }] }] });
      await newMenu.save();
      return res.status(201).json(newMenu.menu);
    }

    const categoryIndex = menu.menu.findIndex(c => c.category === category);
    if (categoryIndex === -1) {
      // If category doesn't exist, add it
      menu.menu.push({ category, icon: 'defaultIcon', items: [{ name, price, image }] });
    } else if (subcategory) {
      const subcategoryIndex = menu.menu[categoryIndex].subcategories.findIndex(s => s.name === subcategory);
      if (subcategoryIndex === -1) {
        // If subcategory doesn't exist, add it
        menu.menu[categoryIndex].subcategories.push({ name: subcategory, items: [{ name, price, image }] });
      } else {
        // Add item to existing subcategory
        menu.menu[categoryIndex].subcategories[subcategoryIndex].items.push({ name, price, image });
      }
    } else {
      // Add item directly to category
      menu.menu[categoryIndex].items.push({ name, price, image });
    }

    await menu.save();
    res.status(201).json(menu.menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an item from the menu
router.delete('/delete/:itemName', async (req, res) => {
  try {
    const { itemName } = req.params;
    const menu = await Menu.findOne();

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    let itemDeleted = false;

    menu.menu.forEach(category => {
      if (category.items) {
        const itemIndex = category.items.findIndex(item => item.name === itemName);
        if (itemIndex !== -1) {
          category.items.splice(itemIndex, 1);
          itemDeleted = true;
        }
      }
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          const itemIndex = subcategory.items.findIndex(item => item.name === itemName);
          if (itemIndex !== -1) {
            subcategory.items.splice(itemIndex, 1);
            itemDeleted = true;
          }
        });
      }
    });

    if (itemDeleted) {
      await menu.save();
      res.json({ message: 'Item deleted successfully', menu: menu.menu });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;