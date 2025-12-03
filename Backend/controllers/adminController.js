const User = require('../models/User');
const Expense = require('../models/Expense');
const Category = require('../models/Category');

/**
 * Get system statistics
 */
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    const totalExpenses = await Expense.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get total spending across all users
    const totalSpending = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get user registration trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get most active users (by expense count)
    const mostActiveUsers = await Expense.aggregate([
      {
        $group: {
          _id: '$userId',
          expenseCount: { $sum: 1 },
          totalSpent: { $sum: '$amount' }
        }
      },
      { $sort: { expenseCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          userId: '$_id',
          username: '$userInfo.username',
          email: '$userInfo.email',
          expenseCount: 1,
          totalSpent: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalAdmins,
          totalRegularUsers,
          totalExpenses,
          totalCategories,
          totalSpending: totalSpending.length > 0 ? totalSpending[0].total : 0,
          recentUsers
        },
        mostActiveUsers
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system statistics',
      error: error.message
    });
  }
};

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Get expense count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const expenseCount = await Expense.countDocuments({ userId: user._id });
        const totalSpent = await Expense.aggregate([
          { $match: { userId: user._id } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        return {
          ...user.toObject(),
          expenseCount,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { users: usersWithStats }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Get single user by ID
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's expenses
    const expenses = await Expense.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(10);

    const expenseCount = await Expense.countDocuments({ userId: user._id });
    
    const totalSpent = await Expense.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const categoriesUsed = await Expense.distinct('category', { userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          expenseCount,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
          categoriesUsed: categoriesUsed.length
        },
        recentExpenses: expenses
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role (user or admin) is required'
      });
    }

    // Prevent admin from demoting themselves
    if (req.params.id === req.user._id.toString() && role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own admin status'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's expenses
    await Expense.deleteMany({ userId: user._id });

    // Delete user's categories
    await Category.deleteMany({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * Get all expenses (across all users)
 */
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ date: -1 })
      .limit(100)
      .populate('userId', 'username email');

    const totalExpenses = await Expense.countDocuments();
    
    const totalAmount = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        totalExpenses,
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
      }
    });
  } catch (error) {
    console.error('Get all expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
};

/**
 * Create user (admin can create users with specific roles)
 */
const createUser = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, username, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create user with specified role or default to 'user'
    const user = await User.create({
      email,
      username,
      password,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

module.exports = {
  getSystemStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllExpenses,
  createUser
};
