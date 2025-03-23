const mongoose = require('mongoose');

const categorySchma = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
});

const Category = mongoose.model('Category', categorySchma);
module.exports = Category;