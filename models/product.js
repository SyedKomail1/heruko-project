var mongoose = require("mongoose");
const Joi = require('@hapi/joi');
var productSchema  = mongoose.Schema({
    name: String,
    price: Number,
    description: String,

});

var product = mongoose.model("product",productSchema);

function validateProduct(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().min(3).max(300).required(),
    });
    return schema.validate(data,{abortEarly:false});
}

module.exports.product = product;
module.exports.validate = validateProduct;