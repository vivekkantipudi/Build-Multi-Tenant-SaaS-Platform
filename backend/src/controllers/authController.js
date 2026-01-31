const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;
  try {
    let tenantId = null;

    if (tenantSubdomain) {
      const tRes = await pool.query('SELECT id, status FROM tenants WHERE subdomain = $1', [tenantSubdomain]);
      if (tRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Tenant not found' });
      tenantId = tRes.rows[0].id;
    }

    let query = 'SELECT * FROM users WHERE email = $1 AND tenant_id ';
    query += tenantId ? '= $2' : 'IS NULL';
    const params = tenantId ? [email, tenantId] : [email];
    
    const uRes = await pool.query(query, params);
    if (uRes.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = uRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, data: { token, user: { id: user.id, role: user.role } } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.registerTenant = async (req, res) => {
  // Simplistic implementation for registration
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const tRes = await client.query(
      `INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING id`,
      [tenantName, subdomain]
    );
    const tenantId = tRes.rows[0].id;
    
    const hash = await bcrypt.hash(adminPassword, 10);
    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, 'tenant_admin', $4)`,
      [adminEmail, hash, adminFullName, tenantId]
    );
    
    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Tenant registered' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

exports.getMe = async (req, res) => {
    res.json({ success: true, data: req.user });
};