require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'demo-admin-token-12345';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

app.use(helmet());
app.use(cors());
app.use(express.json());

// Helper to wrap db operations in promises
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const execute = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// --- ROUTES ---

// Simple Authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to protect routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET all components
app.get('/api/components', async (req, res) => {
  try {
    const components = await query('SELECT * FROM components');
    // Parse specifications JSON
    components.forEach(c => {
      if (c.specifications) {
        c.specifications = JSON.parse(c.specifications);
      }
    });
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single component
app.get('/api/components/:id', async (req, res) => {
  try {
    const component = await getOne('SELECT * FROM components WHERE id = ?', [req.params.id]);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    
    if (component.specifications) {
      component.specifications = JSON.parse(component.specifications);
    }
    res.json(component);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add component
app.post('/api/components', requireAuth, async (req, res) => {
  try {
    const { id, name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl } = req.body;
    
    // Validation
    if (!id || !name || !manufacturer || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (price <= 0) return res.status(400).json({ error: 'Price must be greater than zero' });
    if (stock < 0) return res.status(400).json({ error: 'Stock cannot be negative' });

    await execute(
      `INSERT INTO components (id, name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, manufacturer, category, price, stock, image, description, JSON.stringify(specifications || {}), datasheetUrl]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'A component with this ID (SKU) already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update component
app.put('/api/components/:id', requireAuth, async (req, res) => {
  try {
    const { name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl } = req.body;
    
    // Validation
    if (!name || !manufacturer || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (price <= 0) return res.status(400).json({ error: 'Price must be greater than zero' });
    if (stock < 0) return res.status(400).json({ error: 'Stock cannot be negative' });

    await execute(
      `UPDATE components SET name=?, manufacturer=?, category=?, price=?, stock=?, image=?, description=?, specifications=?, datasheetUrl=? WHERE id=?`,
      [name, manufacturer, category, price, stock, image, description, JSON.stringify(specifications || {}), datasheetUrl, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE component
app.delete('/api/components/:id', requireAuth, async (req, res) => {
  try {
    await execute(`DELETE FROM components WHERE id=?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await query('SELECT * FROM services');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
