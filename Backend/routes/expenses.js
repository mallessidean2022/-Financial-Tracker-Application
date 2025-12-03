const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');
const { validate, sanitizeInput } = require('../middleware/validation');

// Validation rules
const createExpenseValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['grocery', 'entertainment', 'shopping', 'gas', 'bills', 'healthcare', 'dining', 'transportation', 'utilities', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

const updateExpenseValidation = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .trim()
    .isIn(['grocery', 'entertainment', 'shopping', 'gas', 'bills', 'healthcare', 'dining', 'transportation', 'utilities', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

const getExpensesValidation = [
  query('category')
    .optional()
    .isIn(['grocery', 'entertainment', 'shopping', 'gas', 'bills', 'healthcare', 'dining', 'transportation', 'utilities', 'other'])
    .withMessage('Invalid category'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be a positive number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'category'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Routes
router.post('/', authenticate, sanitizeInput, createExpenseValidation, validate, expenseController.createExpense);
router.get('/', authenticate, getExpensesValidation, validate, expenseController.getExpenses);
router.get('/total', authenticate, expenseController.getTotalSpending);
router.get('/by-category', authenticate, expenseController.getSpendingByCategory);
router.get('/:id', authenticate, expenseController.getExpenseById);
router.put('/:id', authenticate, sanitizeInput, updateExpenseValidation, validate, expenseController.updateExpense);
router.delete('/:id', authenticate, expenseController.deleteExpense);
router.post('/delete-multiple', authenticate, expenseController.deleteMultipleExpenses);

module.exports = router;
