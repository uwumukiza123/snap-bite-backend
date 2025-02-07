const express = require('express');
const router = express.Router();
const orderModel = require('../models/orders');

router.post('/', async (req, res) => {
  try {
    const order = await orderModel.placeOrder(req.app.locals.pool, req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
