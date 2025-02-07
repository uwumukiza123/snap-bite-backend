exports.getRestaurants = async (pool) => {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY id ASC');
    return result.rows;
  };
  
  exports.addRestaurant = async (pool, restaurantData) => {
    const { name, address } = restaurantData;
    const result = await pool.query(
      'INSERT INTO restaurants (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    );
    return result.rows[0];
  };
  