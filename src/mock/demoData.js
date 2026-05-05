export const DEMO_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Organic Tomatoes',
    category: 'Vegetables',
    price: '₹40',
    stock: '50 kg',
    quantity: 50,
    image: 'https://images.unsplash.com/photo-1595858602621-eebcbcd83e1c?w=400&h=400&fit=crop',
    status: 'Active',
    sold: '12 kg',
    unit: '/ kg',
    weight: '1 kg'
  },
  {
    id: 'mock-2',
    name: 'Farm Fresh Potatoes',
    category: 'Vegetables',
    price: '₹30',
    stock: '100 kg',
    quantity: 100,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop',
    status: 'Active',
    sold: '45 kg',
    unit: '/ kg',
    weight: '1 kg'
  },
  {
    id: 'mock-3',
    name: 'Green Spinach',
    category: 'Vegetables',
    price: '₹20',
    stock: '15 kg',
    quantity: 15,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
    status: 'Active',
    sold: '8 kg',
    unit: '/ bunch',
    weight: '500g'
  },
  {
    id: 'mock-4',
    name: 'Fresh Carrots',
    category: 'Vegetables',
    price: '₹60',
    stock: '5 kg',
    quantity: 5,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
    status: 'Low Stock',
    sold: '20 kg',
    unit: '/ kg',
    weight: '1 kg'
  },
  {
    id: 'mock-5',
    name: 'Organic Honey',
    category: 'Groceries',
    price: '₹250',
    stock: '0 kg',
    quantity: 0,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    status: 'Out of Stock',
    sold: '10 kg',
    unit: '/ bottle',
    weight: '500g'
  }
];

export const DEMO_ORDERS = [
  { id: 101, productId: 'mock-1', productName: 'Tomatoes', quantity: 5, customerName: 'Ramesh Singh', status: 'Pending', total: 200, date: new Date().toISOString() },
  { id: 102, productId: 'mock-2', productName: 'Potatoes', quantity: 10, customerName: 'Suresh Kumar', status: 'Accepted', total: 300, date: new Date(Date.now() - 86400000).toISOString() },
  { id: 103, productId: 'mock-3', productName: 'Apples', quantity: 2, customerName: 'Priya Verma', status: 'Delivered', total: 240, date: new Date(Date.now() - 172800000).toISOString() },
];

export const DEMO_EARNINGS = {
  total: 440, // 200 + 240
  weekly: 440
};
