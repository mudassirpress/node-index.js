const mongoose = require('mongoose');

const serviseSchma = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
});

const Servise = mongoose.model('Servise', serviseSchma);
module.exports = Servise;