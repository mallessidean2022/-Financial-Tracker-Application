const Category = require('../models/Category');
const Expense = require('../models/Expense');

/**
 * Get all categories for the authenticated user
 */
const getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let categories = await Category.find({ userId }).sort({ name: 1 });
    
    // If user has no categories, initialize default ones
    if (categories.length === 0) {
      await Category.initializeForUser(userId);
      categories = await Category.find({ userId }).sort({ name: 1 });
    }
    
    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

/**
 * Create a new category
 */
const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    const userId = req.user._id;
    
    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ 
      userId, 
      name: name.toLowerCase() 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    const category = new Category({
      userId,
      name: name.toLowerCase(),
      description: description || '',
      color: color || '#3B82F6',
      icon: icon || 'category',
      isDefault: false
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

/**
 * Update a category
 */
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;
    const { name, description, color, icon } = req.body;
    
    const category = await Category.findOne({ _id: categoryId, userId });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if trying to rename to an existing category
    if (name && name.toLowerCase() !== category.name) {
      const existingCategory = await Category.findOne({ 
        userId, 
        name: name.toLowerCase(),
        _id: { $ne: categoryId }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
    }
    
    // Update fields
    if (name) category.name = name.toLowerCase();
    if (description !== undefined) category.description = description;
    if (color) category.color = color;
    if (icon) category.icon = icon;
    
    await category.save();
    
    // If name changed, update all expenses with this category
    if (name && name.toLowerCase() !== category.name) {
      await Expense.updateMany(
        { userId, category: category.name },
        { category: name.toLowerCase() }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

/**
 * Delete a category
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;
    
    const category = await Category.findOne({ _id: categoryId, userId });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Prevent deletion of default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default categories'
      });
    }
    
    // Check if category is in use
    const expenseCount = await Expense.countDocuments({ 
      userId, 
      category: category.name 
    });
    
    if (expenseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${expenseCount} expense(s) are using this category.`,
        data: { expenseCount }
      });
    }
    
    await Category.findByIdAndDelete(categoryId);
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

/**
 * Get category statistics
 */
const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const categories = await Category.find({ userId });
    
    const stats = await Promise.all(
      categories.map(async (category) => {
        const expenseCount = await Expense.countDocuments({
          userId,
          category: category.name
        });
        
        const totalAmount = await Expense.aggregate([
          { $match: { userId, category: category.name } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        return {
          category: category.name,
          color: category.color,
          icon: category.icon,
          isDefault: category.isDefault,
          expenseCount,
          totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
};
