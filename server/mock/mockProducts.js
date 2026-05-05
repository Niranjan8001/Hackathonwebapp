export const mockProducts = [
  {
    _id: "prod_1",
    farmerId: "user_farmer_1",
    title: "Fresh Organic Tomatoes",
    price: 40,
    category: "Vegetables",
    stock: 100,
    images: ["https://images.unsplash.com/photo-1546473422-292c7b913c52?auto=format&fit=crop&q=80&w=400"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "prod_2",
    farmerId: "user_farmer_1",
    title: "Golden Honey",
    price: 250,
    category: "Groceries",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "prod_3",
    farmerId: "user_farmer_1",
    title: "Organic Spinach",
    price: 30,
    category: "Vegetables",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
