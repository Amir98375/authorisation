const express = require("express");

const Product = require("../models/product.model");

const authenticate = require("../middlewares/authenticate");
const authorise = require("../middlewares/authorise");

const router = express.Router();

router.post("", authenticate,authorise(["seller","admin"]), async (req, res) => {
  try {
    req.body.user_id = req.user._id;
    const product = await Product.create(req.body);

    return res.send(product);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.patch(
  "/:id",
  authenticate,
  authorise(["seller", "admin"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      return res.send(product);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }
);

router.get("", async (req, res) => {
  try {
    const products = await Product.find().lean().exec();

    return res.send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
