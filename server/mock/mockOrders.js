export const mockOrders = [
  {
    _id: "order_1",
    buyerId: "user_buyer_1",
    farmerId: "user_farmer_1",
    products: [
      {
        productId: "prod_1",
        qty: 5,
        price: 40
      }
    ],
    totalAmount: 200,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "order_2",
    buyerId: "user_buyer_1",
    farmerId: "user_farmer_1",
    products: [
      {
        productId: "prod_2",
        qty: 1,
        price: 250
      }
    ],
    totalAmount: 250,
    status: "accepted",
    paymentStatus: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
