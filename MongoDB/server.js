const express = require("express");
const mongoose = require("./database");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const customerSchema = new mongoose.Schema({
    customerName: String,
    city: String,
    mobile: String,
    email: String
});

const Customer = mongoose.model("Customer", customerSchema);

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    productName: String,
    quantity: Number,
    price: Number,
    totalAmount: Number
});

const Order = mongoose.model("Order", orderSchema);

app.post("/customer", async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.json(customer);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post("/order", async (req, res) => {
    try {
        const total = req.body.quantity * req.body.price;

        const order = await Order.create({
            customerId: req.body.customerId,
            productName: req.body.productName,
            quantity: req.body.quantity,
            price: req.body.price,
            totalAmount: total
        });

        res.json(order);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/orders-last5days", async (req, res) => {
    const date = new Date();
    date.setDate(date.getDate() - 5);

    const orders = await Order.find({
        orderDate: {
            $gte: date
        }
    }).populate("customerId");

    res.json(orders);
});

app.get("/ahmedabad-orders", async (req, res) => {
    const data = await Order.find().populate({
        path: "customerId",
        match: { city: "Ahmedabad" }
    });

    const result = data.filter(item => item.customerId != null);

    res.json(result);
});

app.get("/billing-report", async (req, res) => {
    const orders = await Order.find().populate("customerId");

    let grandTotal = 0;

    orders.forEach(order => {
        grandTotal += order.totalAmount;
    });

    res.json({
        totalOrders: orders.length,
        grandTotal
    });
});

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});
