const express = require('express');
const router = express.Router();
const restaurantModel = require('../models/restaurants');

router.get('/', async (req, res) => {
  try {
    const restaurants = await restaurantModel.getRestaurants(req.app.locals.pool);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

router.post('/', async (req, res) => {
  try {
    const restaurant = await restaurantModel.addRestaurant(req.app.locals.pool, req.body);
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
});

module.exports = router;
