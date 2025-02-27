const express = require('express');
const Product = require('../models/product');
const productRouter = express.Router();
const {auth,vendorAuth} = require('../middleware/auth');

productRouter.post('/api/product',auth,vendorAuth, async (req, res) => {
    try {
        const {
            productName,
            productPrice,
            quantity,
            description,
            category,
            vendorId,
            fullName,
            subCategory,
            images,
        } = req.body;

        const product = new Product({
            productName,
            productPrice,
            quantity,
            description,
            category,
            vendorId,
            fullName,
            subCategory,
            images,
        });

        await product.save();
        res.status(201).send(product);
    } catch (e) {
        console.error(e.message); // Log the error for debugging
        res.status(500).json({ error: e.message });
    }
});

productRouter.get('/api/product', async (req, res) => {
    try {
        const products = await Product.find({popular:true}); // Corrected the variable
        if(!products || products.length == 0){
            return res.status(404).json({message:"products not found"});
        } else{
            return res.status(200).json(products);
        } // Changed status code to 200 (OK)
    } catch (e) {
        console.error(e.message); // Log the error for debugging
        res.status(500).json({ error: e.message });
    }
});
productRouter.get('/api/recommend/product', async (req, res) => {
    try {
        const products = await Product.find({recommend:true}); // Corrected the variable
        if(!products || products.length == 0){
            return res.status(404).json({message:"products not found"});
        } else{
            return res.status(200).json(products);
        } // Changed status code to 200 (OK)
    } catch (e) {
        console.error(e.message); // Log the error for debugging
        res.status(500).json({ error: e.message });
    }
});
// new route for retrieving products by category
productRouter.get('/api/products-by-category/:category',async(req,res)=>{
    try{
      const {category} = req.params;
      const products = await Product.find({category,popular:true})
      if(!products || products.length == 0){
        return res.status(404).json({message:"Products not found"});
      }else{
        return res.status(200).json(products);
      }
    
    } catch (e){
        res.status(500).json({error:e.message});  
    }
});

productRouter.get('/api/related-products-by-subcategory/:productId',async(req,res)=>{
    try{
        const {productId} = req.params;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Products not found"});
        }else{
            const relatedProdut = await Product.find({
                subCategory: product.subCategory,
                _id:{$ne:productId}
            });
            if(!relatedProdut ||relatedProdut.length ==0){
                return res.status(404).json({message:"No releted Product found"});
            }
            return res.status(200).json(relatedProdut);
          }

    } catch (e) {
        return res.status(500).json({error:e.message}); 
    }
});

productRouter.get('/api/top-rated-products',async (req,res)=>{
    try{
        const topRatedProduct = await Product.find({}).sort({averageRating: -1}).limit(10);
        if(!topRatedProduct || topRatedProduct.length == 0){
            return res.status(404).json({message:"No top-rated Product found"}); 
        }
        return res.status(200).json(topRatedProduct);
    } catch (e) {
        return res.status(500).json({error:e.message});
    }
});
productRouter.get('/api/products-by-subcategory/:subCategory',async(req,res)=>{
    try{
        const {subCategory} = req.params;
        const products = await Product.find({subCategory:subCategory});
        if(!products || products.length == 0){
            return res.status(404).json({message:"No Product found in this SubCategory"}); 
        }
        return res.status(200).json(products);
    } catch (e) {
        return res.status(500).json({error:e.message});
    }
});

productRouter.get('/api/search-products', async (req, res) => {
    try {
        const { query } = req.query;  // FIXED: Use req.query instead of req.params
        if (!query) {
            return res.status(400).json({ message: "Query parameter required" }); // FIXED: Corrected typo
        }

        const products = await Product.find({
            $or: [
                { productName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ]
        });

        return res.status(200).json(products); // Return empty array instead of 404

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});


productRouter.put('/api/edit-product/:productId',auth,vendorAuth,async(req,res)=>{
    try{
        const {productId} = req.params;
        const products = await Product.findById(productId);
        if(!products){
            return res.status(404).json({message:"No Product found "}); 
        }
        if(products.vendorId.toString() !== req.user.id){
            return res.status(403).json({message:"Unauthorzied to edit this Product"}); 
        }
        const {vendorId, ...updateData} = req.body;
        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            {$set:updateData},
            {new:true}
        );
        return res.status(200).json(updateProduct);
    } catch (e) {
        return res.status(500).json({error:e.message});
    }
});
productRouter.delete('/api/product/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const productDelete = await Product.findByIdAndDelete(id); 
        if(!productDelete){
            return res.status(404).json({message:"No Product found"});
        } else {
            return res.status(200).json({ message: "Product was deleted successfully" });
        }
    } catch (e) {
        return res.status(500).json({error:e.message});
    }
});

module.exports = productRouter;
 