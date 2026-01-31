const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const seedDatabase = require('./utils/seed');
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Run Seed
seedDatabase();

// Routes
const router = express.Router();

// Auth
router.post('/auth/login', authController.login);
router.post('/auth/register-tenant', authController.registerTenant);
router.get('/auth/me', authMiddleware, authController.getMe);

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});