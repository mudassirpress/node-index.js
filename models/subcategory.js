const mongoose = require('mongoose');
const Category = require('./category');

const subCategorySchma = mongoose.Schema({
    categoryId:{
        type:String,
        required:true,
    },
    categoryName:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        requried:true,
    },
    subCategoryName:{
        type:String,
        required:true,
    }

});

const subCategory = mongoose.model('subCategory',subCategorySchma);
module.exports = subCategory;