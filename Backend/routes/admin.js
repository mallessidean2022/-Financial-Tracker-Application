const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const {
  getSystemStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllExpenses,
  createUser
} = require('../controllers/adminController');

// All admin routes require authentication AND admin role
router.use(authenticate);
router.use(authorizeAdmin);

// System statistics
router.get('/stats', getSystemStats);

// User management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// All expenses (across all users)
router.get('/expenses', getAllExpenses);

module.exports = router;
