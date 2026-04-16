const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool(
  process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'gatekeeper',
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
    }
);

// Test connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL Database'))
  .catch(err => console.error('Database connection error:', err));

// 1. POST /api/solicitar-acceso
app.post('/api/solicitar-acceso', async (req, res) => {
  const { email, folio } = req.body;
  if (!email || !folio) {
    return res.status(400).json({ error: 'Email and folio are required' });
  }

  try {
    // We insert into solicitudes directly. 
    // The flow implies we request access and the folio will be validated later or immediately.
    // Assuming we insert with 'Procesando' status.
    const result = await pool.query(
      `INSERT INTO solicitudes (email, folio, estatus) 
       VALUES ($1, $2, 'Procesando') RETURNING *`,
      [email, folio]
    );

    const solicitud = result.rows[0];

    // TODO: Trigger n8n webhook here (can be done with fetch/axios)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, folio, solicitud_id: solicitud.id })
        });
      } catch (err) {
        console.error('Failed to trigger n8n webhook:', err);
      }
    }

    res.status(201).json({ message: 'Solicitud recibida', solicitud });
  } catch (err) {
    console.error(err);
    if (err.code === '23503') {
      // Foreign key violation for folio
      return res.status(400).json({ error: 'Folio no es válido o no existe en pagos_referencia' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. GET /api/verificar-estatus/:email
app.get('/api/verificar-estatus/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(
      'SELECT email, estatus, fecha_actualizacion FROM solicitudes WHERE email = $1 ORDER BY fecha_actualizacion DESC LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No solicitudes found for this email' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. PATCH /api/callback
// This endpoint is called by n8n to update the status once validated
app.patch('/api/callback', async (req, res) => {
  const { solicitud_id, estatus } = req.body;
  if (!solicitud_id || !estatus) {
    return res.status(400).json({ error: 'solicitud_id and estatus are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE solicitudes 
       SET estatus = $1, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [estatus, solicitud_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud not found' });
    }

    res.json({ message: 'Estatus actualizado', solicitud: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
