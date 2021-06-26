const express = require('express');
let router = express.Router();

var {product} = require("../../models/product");
const validateProduct = require('../../middlewares/validateProducts');
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");


//Model ka faida yeh kay mango db py kuch bhi chalana ap ki zindagi asaan kr de ga

// get all products 
router.get("/",async(req,res) =>{//,auth
    console.log(req.user);
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let products = await product.find().skip(skipRecords).limit(perPage);
   let total = await product.countDocuments();
  return res.send({total,products});
});
// get single products
router.get("/:id",async(req,res) =>{
    try {
        let single_prod = await product.findById(req.params.id);
        if(!single_prod) return res.status(400).send("product with given id is not present");//will execute when id not present in db
        return res.send(single_prod);
    } catch (err) {
        return res.status(400).send("invalid id"); // execute if id format is wrong
    }
});

router.put("/:id",validateProduct,auth, admin, async(req,res)=>{
    let updated_product  = await product.findById(req.params.id);
    updated_product.name = req.body.name;
    updated_product.price = req.body.price;
    updated_product.description = req.body.description;
    await updated_product.save();
    return res.send(updated_product);
});
router.delete("/:id", auth, admin,async(req,res)=>{
    let del_product  = await product.findByIdAndDelete(req.params.id);
    return res.send("product deleted");
});

router.post("/",validateProduct ,auth, async(req,res)=>{
    
    let new_product = new product();
    new_product.name = req.body.name;
    new_product.price = req.body.price;
    new_product.description = req.body.description;
   
    await new_product.save();
    return res.status(200).send(new_product);
});

module.exports = router;
