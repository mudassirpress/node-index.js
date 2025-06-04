    const express = require('express');
    const orderRouter = express.Router();
    const Order = require('../models/orders');
    const stripe = require("stripe")("sk_test_51QvvAXEJ2ZE3Q2gnCaZkPdHqZlTKKjUBxNUDPZi8EoaUxQH76DiGU58kTXjVEqpKJn5Ck9ut9NkS98Q0irHr8lZH00XYi4z89M"); 
    const {auth, vendorAuth} = require('../middleware/auth');
    orderRouter.post('/api/orders', async (req, res) => {
        try {
            const {
                fullname,
                email,
                state,
                city,
                locality,
                productName,
                productPrice,
                quantity,
                category,
                image,
                buyerId,
                vendorId,
                paymentStatus,
                paymentIntentId,
                paymentMethod,  // Correct spelling
            } = req.body;

            const createdAt = new Date(); // Store the full date and time
            const order = new Order({
                fullname,
                email,
                state,
                city,
                locality,
                productName,
                productPrice,
                quantity,
                category,
                image,
                buyerId,
                vendorId,
                createdAt,
                paymentStatus,
                paymentIntentId,
                paymentMethod,
            });

            await order.save();
            return res.status(201).json(order);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    orderRouter.post('/api/payment-intent', async (req, res) => {
        try {
            const { amount, currency } = req.body;

            // Ensure Stripe is working properly
            if (!stripe) {
                return res.status(500).json({ error: "Stripe is not initialized properly" });
            }

            // Create Payment Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
            });

            return res.status(200).json(paymentIntent);
        } catch (e) {
            console.error("Stripe Error:", e.message);
            res.status(500).json({ error: e.message });
        }
    });

    orderRouter.get('/api/payment-intent/:id',auth, async (req, res) => {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
            return res.status(200).json(paymentIntent);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });


    orderRouter.get('/api/orders/:buyerId',auth,async(req,res)=>{
        try{
            const {buyerId} = req.params;
            const orders = await Order.find({buyerId});
            if(orders.lenght == 0){
                return res.status(404).json({message:"No Orders found for this buyer"});
            }
            return res.status(200).json(orders);
        } catch (e){
            res.status(500).json({ error: e.message });
        }
    });

    // Delete route for deleting speicfic order id
    orderRouter.delete('/api/orders/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const deletedOrder = await Order.findByIdAndDelete(id); // Fixed method name
            if (!deletedOrder) {
                return res.status(404).json({ message: "Order Not Found" });
            } else {
                return res.status(200).json({ message: "Order was deleted successfully" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    orderRouter.get('/api/orders/vendor/:vendorId',auth,vendorAuth,async(req,res)=>{
        try{
            const {vendorId} = req.params;
            const orders = await Order.find({vendorId});
            if(orders.lenght == 0){
                return res.status(404).json({message:"No Orders found for this vendor"});
            }
            return res.status(200).json(orders);
        } catch (e){
            res.status(500).json({ error: e.message });
        }
    });
    
    orderRouter.patch('/api/orders/:id/delivered',async(req,res)=>{
        try{
            const {id} = req.params;
            const updateOrder = await Order.findByIdAndUpdate(
                id,
                {delivered:true , proccessing:false},
                {new:true},
            );
            if(!updateOrder){
                return res.status(404).json({message:"Order Not Found"});
            } else {
                return res.status(200).json(updateOrder);   
            }
        } catch (e){
            res.status(500).json({ error: e.message });
        }
    });
    orderRouter.patch('/api/orders/:id/proccessing',async(req,res)=>{
        try{
            const {id} = req.params;
            const updateOrder = await Order.findByIdAndUpdate(
                id,
                {proccessing:false , delivered:false},
                {new:true},
            );
            if(!updateOrder){
                return res.status(404).json({message:"Order Not Found"});
            } else {
                return res.status(200).json(updateOrder);   
            }
        } catch (e){
            res.status(500).json({ error: e.message });
        }
    });

    orderRouter.get('/api/orders',async(req,res)=>{
        try{
            const orders = await Order.find();
            return res.status(200).json(orders);

        } catch (e){
            res.status(500).json({error:e.message});
        }
    });

    module.exports = orderRouter;


    // orderRouter.post("/api/payment", async (req, res) => {
    //     try {
    //         const { orderId, paymentMethodId, currency = "usd" } = req.body;

    //         if (!orderId || !paymentMethodId || !currency) {
    //             return res.status(400).json({ message: "Missing required fields" });
    //         }

    //         const order = await Order.findById(orderId);
    //         if (!order) {
    //             console.log("Order not found", orderId);
    //             return res.status(400).json({ message: "Order not found" });
    //         }

    //         const totalAmount = order.productPrice * order.quantity;
    //         const minimumAmount = 0.50;
    //         if (totalAmount < minimumAmount) {
    //             return res.status(400).json({ message: "Amount must be at least $0.50 USD" });
    //         }

    //         const amountInCents = Math.round(totalAmount * 100);
    //         const paymentIntent = await stripe.paymentIntents.create({
    //             amount: amountInCents,
    //             currency: currency,
    //             payment_method: paymentMethodId,
    //             confirm: true,
    //             return_url: "https://dashboard.stripe.com/test/dashboard", // Replace with your actual return URL
    //             automatic_payment_methods: { enabled: true }
    //         });
    //         console.log("payment Status", paymentIntent.status);

    //         return res.json({
    //             status: "success",
    //             paymentIntentId: paymentIntent.id,
    //             amount: paymentIntent.amount / 100,
    //             currency: paymentIntent.currency,
    //         });
    //     } catch (e) {
    //         res.status(500).json({ error: e.message });
    //     }
    // });