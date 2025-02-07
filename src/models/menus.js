exports.getMenuItems = async (pool, restaurantId) => {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY id ASC',
      [restaurantId]
    );
    return result.rows;
  };
  
  exports.addMenuItem = async (pool, menuItemData) => {
    const { name, price, restaurantId } = menuItemData;
    const result = await pool.query(
      'INSERT INTO menu_items (name, price, restaurant_id) VALUES ($1, $2, $3) RETURNING *',
      [name, price, restaurantId]
    );
    return result.rows[0];
  };
  