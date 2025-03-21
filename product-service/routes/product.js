const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    const existingProduct = await Product.findOne({ name, category });

    if (existingProduct) {
      return res.status(409).json({ msg: "Product already exists" });
    }
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ Msg: "Prodct not updated" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(504).send("Server error");
  }
});

router.put("/:id/deduct", async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ msg: "Invalid quantity" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    product.stock -= quantity;
    await product.save();

    res.status(200).json({ msg: "Stock deducted successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
