const Expense = require('../models/Expense');
const moment = require('moment');

/**
 * Get dashboard summary
 */
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    // Get current month data
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get current week data
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    
    // Total spending this month
    const monthlyTotal = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Total spending this week
    const weeklyTotal = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfWeek, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Category breakdown for current month
    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    // Recent expenses (last 5)
    const recentExpenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        monthly: {
          total: monthlyTotal.length > 0 ? monthlyTotal[0].total : 0,
          count: monthlyTotal.length > 0 ? monthlyTotal[0].count : 0
        },
        weekly: {
          total: weeklyTotal.length > 0 ? weeklyTotal[0].total : 0,
          count: weeklyTotal.length > 0 ? weeklyTotal[0].count : 0
        },
        categoryBreakdown,
        recentExpenses
      }
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};

/**
 * Get spending trends over time
 */
const getSpendingTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'month', months = 6 } = req.query;
    
    const now = new Date();
    let startDate;
    let groupFormat;
    
    if (period === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      groupFormat = { year: { $year: '$date' }, month: { $month: '$date' } };
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - (parseInt(months) * 7 * 24 * 60 * 60 * 1000));
      groupFormat = { 
        year: { $year: '$date' }, 
        week: { $week: '$date' } 
      };
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(months), 1);
      groupFormat = { year: { $year: '$date' }, month: { $month: '$date' } };
    }
    
    const trends = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: groupFormat,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: { trends, period }
    });
  } catch (error) {
    console.error('Get spending trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching spending trends',
      error: error.message
    });
  }
};

/**
 * Get weekly report
 */
const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { weekOffset = 0 } = req.query;
    
    const now = new Date();
    const offset = parseInt(weekOffset);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() - (offset * 7));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Total for the week
    const weekTotal = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Daily breakdown
    const dailyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    // Category breakdown
    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        period: {
          start: startOfWeek,
          end: endOfWeek
        },
        total: weekTotal.length > 0 ? weekTotal[0].total : 0,
        count: weekTotal.length > 0 ? weekTotal[0].count : 0,
        dailyBreakdown,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get weekly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating weekly report',
      error: error.message
    });
  }
};

/**
 * Get monthly report
 */
const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    
    const now = new Date();
    const targetYear = year ? parseInt(year) : now.getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
    
    // Total for the month
    const monthTotal = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);
    
    // Weekly breakdown
    const weeklyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { week: { $week: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.week': 1 } }
    ]);
    
    // Category breakdown
    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
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
    
    // Top expenses
    const topExpenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .sort({ amount: -1 })
      .limit(10);
    
    // Compare with previous month
    const prevMonthStart = new Date(targetYear, targetMonth - 1, 1);
    const prevMonthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
    
    const prevMonthTotal = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: prevMonthStart, $lte: prevMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const currentTotal = monthTotal.length > 0 ? monthTotal[0].total : 0;
    const previousTotal = prevMonthTotal.length > 0 ? prevMonthTotal[0].total : 0;
    const changePercent = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(2)
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        period: {
          year: targetYear,
          month: targetMonth + 1,
          start: startOfMonth,
          end: endOfMonth
        },
        total: currentTotal,
        count: monthTotal.length > 0 ? monthTotal[0].count : 0,
        avgAmount: monthTotal.length > 0 ? monthTotal[0].avgAmount.toFixed(2) : 0,
        weeklyBreakdown,
        categoryBreakdown,
        topExpenses,
        comparison: {
          previousMonth: previousTotal,
          changePercent: parseFloat(changePercent),
          trend: changePercent > 0 ? 'increase' : changePercent < 0 ? 'decrease' : 'stable'
        }
      }
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating monthly report',
      error: error.message
    });
  }
};

/**
 * Get yearly report
 */
const getYearlyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;
    
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);
    
    // Total for the year
    const yearTotal = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);
    
    // Monthly breakdown
    const monthlyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
    
    // Category breakdown
    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        total: yearTotal.length > 0 ? yearTotal[0].total : 0,
        count: yearTotal.length > 0 ? yearTotal[0].count : 0,
        avgAmount: yearTotal.length > 0 ? yearTotal[0].avgAmount.toFixed(2) : 0,
        monthlyBreakdown,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get yearly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating yearly report',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardSummary,
  getSpendingTrends,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport
};
