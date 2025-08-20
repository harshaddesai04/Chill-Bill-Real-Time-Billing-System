// server/scripts/initMenu.js
const mongoose = require('mongoose');
const Menu = require('./models/Menu.js'); // Relative path from initMenu.js
const connectDB = require('./config/db.js');


const menuData = [
    {
      category: "Starters",
    //   icon: <FaUtensils />,
      subcategories: [
        {
          name: "Vegetarian Starters",
          items: [
            { name: "Veg Spring Rolls", price: 120 , image: "/images/Veg Spring Rolls/Veg_Spring_Rolls.jpg"},
            { name: "Paneer Tikka", price: 150 , image: "/images/Paneer Tikka/Paneer_Tikka.jpg"},
            { name: "Stuffed Mushrooms", price: 130 , image: "/images/Stuffed Mushrooms/Stuffed_Mushroom.jpg"}
          ]
        },
        {
          name: "Non-Vegetarian Starters",
          items: [
            { name: "Chicken Wings", price: 170 , image: "/images/Chicken Wings/Chicken_wings.jpg"},
            { name: "Lamb Kebabs", price: 200 , image: "/images/Lamb Kebabs/Lamb_Kebabs.jpg"},
            { name: "Prawn Cocktail", price: 230 , image: "/images/Prawn Cocktail/Prawn_Cocktail.jpg"}
          ]
        }
      ]
    },
    {
      category: "Main Course",
    //   icon: <FaUtensils />,
      subcategories: [
        {
          name: "Vegetarian",
          items: [
            { name: "Paneer Butter Masala", price: 220 , image: "/images/Paneer Butter Masala/Paneer_Butter_Masala.jpg"},
            { name: "Veg Biryani", price: 190 , image: "/images/Veg Biryani/Veg_Biryani.jpg"},
            { name: "Dal Makhani", price: 160 , image: "/images/Dal Makhani/Dal_Makhni.jpg"}
        ]
        },
        {
          name: "Non-Vegetarian",
          items: [
            { name: "Chicken Curry", price: 240 , image: "/images/Chicken Curry/Chicken_curry.jpg"},
            { name: "Lamb Rogan Josh", price: 270 , image: "/images/Lamb Rogan Josh/Lamb_Rogan_Josh.jpg"},
            { name: "Fish Fry", price: 260 , image: "/images/Fish Fry/Fish_Fry.jpg"}
          ]
        }
      ]
    },
    {
        category: "Salads",
        subcategories: [
          {
            name: "Vegetarian Salads",
            items: [
              { name: "Caesar Salad", price: 140 , image: "/images/Caesar Salad/caesar_salad.jpg"},
              { name: "Greek Salad", price: 150 , image: "/images/Greek Salad/Greek_Salad.jpg"}
            ]
          },
          {
            name: "Non-Vegetarian Salads",
            items: [
              { name: "Chicken Caesar Salad", price: 180 , image: "/images/Chicken Caesar Salad/caesar_salad.jpg"},
              { name: "Prawn Salad", price: 190 , image: "/images/Prawn Salad/Prawn_salad.jpg"}
            ]
          }
        ]
      },
    {
      category: "Breads",
    //   icon: <FaBreadSlice />,
      subcategories: [
        {
          name: "Naan",
          items: [
            { name: "Butter Naan", price: 40 , image: "/images/Butter Naan/butter_naan.jpg"},
            { name: "Garlic Naan", price: 50 , image: "/images/Garlic Naan/Garlic_Naan.jpg"}
          ]
        },
        {
          name: "Roti",
          items: [
            { name: "Tandoori Roti", price: 30 , image: "/images/Tandoori Roti/Tandoori_Roti.jpg"},
            { name: "Missi Roti", price: 40 , image: "/images/Missi Roti/Missi_Roti.jpg"}
          ]
        }
      ]
    },
    {
        category: "Desserts",
        subcategories: [
          {
            name: "Ice Cream",
            items: [
              { name: "Vanilla Ice Cream", price: 89 , image: "/images/Vanilla Ice Cream/Vanilla_Ice_Cream.jpg"},
              { name: "Chocolate Ice Cream", price: 89 , image: "/images/Chocolate Ice Cream/Chocolate _Ice_Cream.jpg"},
              { name: "Mango Ice Cream", price: 99 , image: "/images/Mango Ice Cream/Mango_Ice_Cream.jpg"}
            ]
          },
          {
            name: "Traditional Desserts",
            items: [
              { name: "Gulab Jamun (2 Piece)", price: 50 , image: "/images/Gulab Jamun/Gulab_Jamun.jpg"},
              { name: "Chocolate Brownie", price: 120 , image: "/images/Chocolate Brownie/Chocolate_brownie.jpg"}
            ]
          }
        ]
      },
    {
      category: "Beverages",
    //   icon: <FaCoffee />,
      subcategories: [
        {
          name: "Hot Beverages",
          items: [
            { name: "Tea", price: 30 , image: "/images/Tea/Tea.jpg"},
            { name: "Coffee", price: 40 , image: "/images/coffee.png"}
          ]
        },
        {
          name: "Cold Beverages",
          items: [
            { name: "Soft Drinks", price: 50 , image: "/images/Soft Drinks/Soft_Drinks.jpg"},
            { name: "Fresh Juice", price: 50 , image: "/images/Fresh Juice/Fresh_Juice.jpg"},
            { name: "Milkshakes", price: 100 , image: "/images/Milkshakes/Milkshakes.jpg"}
          ]
        }
      ]
    }
  ];

const initializeMenu = async () => {
  await connectDB();
  
  try {
    await Menu.deleteMany({}); // Clear existing menu data
    const newMenu = new Menu({ menu: menuData });
    await newMenu.save();
    console.log('Menu initialized successfully');
  } catch (error) {
    console.error('Error initializing menu:', error);
  } finally {
    mongoose.disconnect();
  }
};

initializeMenu();