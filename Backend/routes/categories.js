const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { validate, sanitizeInput } = require('../middleware/validation');

// Validation rules
const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, and hyphens'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, and hyphens'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters')
];

// Routes
router.get('/', authenticate, categoryController.getCategories);
router.get('/stats', authenticate, categoryController.getCategoryStats);
router.post('/', authenticate, sanitizeInput, createCategoryValidation, validate, categoryController.createCategory);
router.put('/:id', authenticate, sanitizeInput, updateCategoryValidation, validate, categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);

module.exports = router;
