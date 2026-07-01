const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

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
app.post('/api/components', async (req, res) => {
  try {
    const { id, name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl } = req.body;
    await execute(
      `INSERT INTO components (id, name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, manufacturer, category, price, stock, image, description, JSON.stringify(specifications || {}), datasheetUrl]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update component
app.put('/api/components/:id', async (req, res) => {
  try {
    const { name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl } = req.body;
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
app.delete('/api/components/:id', async (req, res) => {
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
