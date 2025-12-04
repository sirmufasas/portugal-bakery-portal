/**
 * Portugal Bakery Backend Server
 * Deploy this on Render.com
 * 
 * Environment Variables Required:
 * - PORT (optional, defaults to 3001)
 * - STRIPE_SECRET_KEY (your Stripe secret key)
 * - RESEND_API_KEY (for email notifications)
 * - FRONTEND_URL (your frontend URL for CORS)
 * - DATABASE_URL (PostgreSQL connection string - Render provides this)
 */

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { Resend } = require('resend');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// DATABASE INITIALIZATION
// ============================================
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_intent_id VARCHAR(255),
        payment_status VARCHAR(50) DEFAULT 'pending',
        special_instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(order_id),
        sender_type VARCHAR(20) NOT NULL, -- 'customer' or 'admin'
        sender_name VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// ============================================
// PAYMENT ENDPOINTS
// ============================================

// Create payment intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', customerEmail, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        order_id: orderId,
        customer_email: customerEmail
      },
      receipt_email: customerEmail
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment (webhook alternative for testing)
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      await pool.query(
        'UPDATE orders SET payment_status = $1, payment_intent_id = $2, updated_at = CURRENT_TIMESTAMP WHERE order_id = $3',
        ['paid', paymentIntentId, orderId]
      );

      res.json({ success: true, status: paymentIntent.status });
    } else {
      res.json({ success: false, status: paymentIntent.status });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.order_id;

      await pool.query(
        'UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2',
        ['paid', orderId]
      );

      // Send confirmation email
      const order = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
      if (order.rows[0]) {
        await sendOrderConfirmationEmail(order.rows[0]);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// ORDER ENDPOINTS
// ============================================

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerEmail, customerName, items, total, specialInstructions } = req.body;
    const orderId = `PB-${Date.now().toString(36).toUpperCase()}`;

    const result = await pool.query(
      `INSERT INTO orders (order_id, customer_email, customer_name, items, total, special_instructions)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [orderId, customerEmail, customerName, JSON.stringify(items), total, specialInstructions]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM orders';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send status update email
    await sendOrderStatusEmail(result.rows[0]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// MESSAGING ENDPOINTS
// ============================================

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const { orderId, senderType, senderName, message } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (order_id, sender_type, sender_name, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderId, senderType, senderName, message]
    );

    // Send email notification
    const order = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (order.rows[0]) {
      await sendMessageNotificationEmail(order.rows[0], senderType, message);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for order
app.get('/api/messages/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      'SELECT * FROM messages WHERE order_id = $1 ORDER BY created_at ASC',
      [orderId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EMAIL FUNCTIONS
// ============================================

async function sendOrderConfirmationEmail(order) {
  try {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const itemsList = items.map(item => `• ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`).join('<br>');

    await resend.emails.send({
      from: 'Portugal Bakery <orders@yourdomain.com>',
      to: [order.customer_email],
      subject: `Order Confirmed - ${order.order_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B4513;">Order Confirmed! 🥐</h1>
          <p>Dear ${order.customer_name || 'Valued Customer'},</p>
          <p>Thank you for your order at Portugal Bakery!</p>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Order Details</h2>
            <p><strong>Order ID:</strong> ${order.order_id}</p>
            <p><strong>Items:</strong></p>
            <p>${itemsList}</p>
            <p style="font-size: 18px; font-weight: bold;">Total: €${parseFloat(order.total).toFixed(2)}</p>
          </div>
          
          ${order.special_instructions ? `<p><strong>Special Instructions:</strong> ${order.special_instructions}</p>` : ''}
          
          <p>We'll notify you when your order is ready for pickup!</p>
          
          <p>Track your order: <a href="${process.env.FRONTEND_URL}/track-order?id=${order.order_id}">Click here</a></p>
          
          <p>Best regards,<br>Portugal Bakery Team</p>
        </div>
      `
    });
    console.log('Order confirmation email sent to:', order.customer_email);
  } catch (error) {
    console.error('Email send error:', error);
  }
}

async function sendOrderStatusEmail(order) {
  try {
    const statusMessages = {
      'pending': 'Your order has been received.',
      'confirmed': 'Your order has been confirmed and we are preparing it.',
      'preparing': 'Our bakers are now preparing your delicious order!',
      'ready': 'Great news! Your order is ready for pickup!',
      'completed': 'Thank you for picking up your order. Enjoy!',
      'cancelled': 'Your order has been cancelled. Please contact us if you have questions.'
    };

    await resend.emails.send({
      from: 'Portugal Bakery <orders@yourdomain.com>',
      to: [order.customer_email],
      subject: `Order Update - ${order.order_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B4513;">Order Update 📦</h1>
          <p>Dear ${order.customer_name || 'Valued Customer'},</p>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order.order_id}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            <p>${statusMessages[order.status] || 'Your order status has been updated.'}</p>
          </div>
          
          <p>Track your order: <a href="${process.env.FRONTEND_URL}/track-order?id=${order.order_id}">Click here</a></p>
          
          <p>Best regards,<br>Portugal Bakery Team</p>
        </div>
      `
    });
    console.log('Status update email sent to:', order.customer_email);
  } catch (error) {
    console.error('Email send error:', error);
  }
}

async function sendMessageNotificationEmail(order, senderType, message) {
  try {
    const isFromAdmin = senderType === 'admin';
    const recipient = isFromAdmin ? order.customer_email : process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
    const subject = isFromAdmin 
      ? `Message from Portugal Bakery - Order ${order.order_id}`
      : `New Customer Message - Order ${order.order_id}`;

    await resend.emails.send({
      from: 'Portugal Bakery <messages@yourdomain.com>',
      to: [recipient],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B4513;">New Message 💬</h1>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order.order_id}</p>
            <p><strong>From:</strong> ${isFromAdmin ? 'Portugal Bakery' : order.customer_name || 'Customer'}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
          
          <p>Reply: <a href="${process.env.FRONTEND_URL}/track-order?id=${order.order_id}">Click here</a></p>
          
          <p>Best regards,<br>Portugal Bakery Team</p>
        </div>
      `
    });
    console.log('Message notification email sent');
  } catch (error) {
    console.error('Email send error:', error);
  }
}

// ============================================
// START SERVER
// ============================================

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Portugal Bakery API running on port ${PORT}`);
  });
});

module.exports = app;
