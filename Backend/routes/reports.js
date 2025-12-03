const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const trendValidation = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('Period must be week, month, or year'),
  query('months')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Months must be between 1 and 24')
];

const weeklyReportValidation = [
  query('weekOffset')
    .optional()
    .isInt({ min: 0, max: 52 })
    .withMessage('Week offset must be between 0 and 52')
];

const monthlyReportValidation = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12')
];

const yearlyReportValidation = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
];

// Routes
router.get('/dashboard', authenticate, reportController.getDashboardSummary);
router.get('/trends', authenticate, trendValidation, validate, reportController.getSpendingTrends);
router.get('/weekly', authenticate, weeklyReportValidation, validate, reportController.getWeeklyReport);
router.get('/monthly', authenticate, monthlyReportValidation, validate, reportController.getMonthlyReport);
router.get('/yearly', authenticate, yearlyReportValidation, validate, reportController.getYearlyReport);

module.exports = router;
