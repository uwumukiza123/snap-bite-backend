const express = require('express');
const router = express.Router();
const menuModel = require('../models/menus');

router.get('/:restaurantId', async (req, res) => {
  try {
    const menuItems = await menuModel.getMenuItems(req.app.locals.pool, req.params.restaurantId);
    res.json(menuItems);
  } catch (error) {
    res.status(404).json({ error: 'Restaurant not found' });
  }
});

router.post('/:restaurantId', async (req, res) => {
  try {
    const menuItem = await menuModel.addMenuItem(req.app.locals.pool, { ...req.body, restaurantId: req.params.restaurantId });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

module.exports = router;
