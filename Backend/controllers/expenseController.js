const Expense = require('../models/Expense');

/**
 * Create a new expense
 */
const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;
    const userId = req.user._id;
    
    const expense = new Expense({
      userId,
      amount,
      description,
      category,
      date: date || new Date()
    });
    
    await expense.save();
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
};

/**
 * Get all expenses for the authenticated user with filters
 */
const getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;
    
    // Build query
    const query = { userId };
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }
    
    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const expenses = await Expense.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Expense.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
};

/**
 * Get a single expense by ID
 */
const getExpenseById = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id;
    
    const expense = await Expense.findOne({ _id: expenseId, userId });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message
    });
  }
};

/**
 * Update an expense
 */
const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id;
    const { amount, description, category, date } = req.body;
    
    const expense = await Expense.findOne({ _id: expenseId, userId });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    // Update fields
    if (amount !== undefined) expense.amount = amount;
    if (description !== undefined) expense.description = description;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    
    await expense.save();
    
    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense }
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message
    });
  }
};

/**
 * Delete an expense
 */
const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id;
    
    const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};

/**
 * Delete multiple expenses
 */
const deleteMultipleExpenses = async (req, res) => {
  try {
    const { expenseIds } = req.body;
    const userId = req.user._id;
    
    if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of expense IDs'
      });
    }
    
    const result = await Expense.deleteMany({
      _id: { $in: expenseIds },
      userId
    });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} expenses deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Delete multiple expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expenses',
      error: error.message
    });
  }
};

/**
 * Get total spending
 */
const getTotalSpending = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    
    const query = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }
    
    const result = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const data = result.length > 0 
      ? { total: result[0].total, count: result[0].count }
      : { total: 0, count: 0 };
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get total spending error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating total spending',
      error: error.message
    });
  }
};

/**
 * Get spending by category
 */
const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    
    const matchStage = { userId };
    
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchStage.date.$lte = end;
      }
    }
    
    const result = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          avgAmount: { $round: ['$avgAmount', 2] },
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: { categories: result }
    });
  } catch (error) {
    console.error('Get spending by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating spending by category',
      error: error.message
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteMultipleExpenses,
  getTotalSpending,
  getSpendingByCategory
};
