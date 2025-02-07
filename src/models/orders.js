exports.placeOrder = async (pool, orderData) => {
    const { userId, items } = orderData;
    
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *',
      [userId, 'pending']
    );
    const orderId = orderResult.rows[0].id;
  
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.menuItemId, item.quantity]
      );
    }
  
    return orderResult.rows[0];
  };
  