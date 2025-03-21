const express = require("express")
const Order = require("../models/order")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config()

const router = express.Router()

const PRODUCT_SERVICE_URI =
  process.env.PRODUCT_SERVICE_URI || "http://localhost:5001"


router.post("/:userId", async (req, res) => {
  const { userId } = req.params
  const { items, totalAmount } = req.body

  try {
    const productChecks = await Promise.all(
      items.map(async (item) => {
        const product = await axios.get(
          `${PRODUCT_SERVICE_URI}/api/products/${item.productId}`
        )
        return product.data && product.data.stock >= item.quantity
      })
    )

    if (productChecks.includes(false)) {
      return res.status(400).json({ msg: "One or more items are out of stock" })
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
    })

    await order.save()

    // Deduct product stock
    await Promise.all(
      items.map(async (item) => {
        await axios.put(
          `${PRODUCT_SERVICE_URI}/api/products/${item.productId}/deduct`,
          {
            quantity: item.quantity,
          }
        )
      })
    )

    res.status(201).json(order)
  } catch (err) {
	console.log(err)
    res.status(500).send("Server error")
  }
})


router.get("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const orders = await Order.find({ userId })
    res.json(orders)
  } catch (err) {
    res.status(500).send("Server error")
  }
})


router.get("/:userId/:orderId", async (req, res) => {
  const { userId, orderId } = req.params
  try {
    const order = await Order.findOne({ userId, _id: orderId })
    if (!order) return res.status(404).json({ msg: "Order not found" })
    res.json(order)
  } catch (err) {
    res.status(500).send("Server error")
  }
})


router.put("/:orderId/status", async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  try {
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ msg: "Order not found" })

    order.status = status
    await order.save()

    res.json(order)
  } catch (err) {
    res.status(500).send("Server error")
  }
})

module.exports = router
