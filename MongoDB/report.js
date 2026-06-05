const mongoose = require("./database");

const customerSchema = new mongoose.Schema({
    customerName: String,
    city: String,
    mobile: String,
    email: String
});

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    orderDate: Date,
    productName: String,
    quantity: Number,
    price: Number,
    totalAmount: Number
});

const Customer = mongoose.model("Customer", customerSchema);
const Order = mongoose.model("Order", orderSchema);

async function generateReport() {

    const orders = await Order.find()
        .populate("customerId");

    console.log("\n===== BILLING REPORT =====\n");

    orders.forEach(order => {
        console.log(`
Customer : ${order.customerId.customerName}
City     : ${order.customerId.city}
Product  : ${order.productName}
Quantity : ${order.quantity}
Price    : ${order.price}
Total    : ${order.totalAmount}
--------------------------------
`);
    });

    process.exit();
}

generateReport();
