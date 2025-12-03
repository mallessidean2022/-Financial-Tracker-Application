const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code']
  },
  icon: {
    type: String,
    default: 'category'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure unique category names per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Static method to get default categories
categorySchema.statics.getDefaultCategories = function() {
  return [
    { name: 'grocery', color: '#10B981', icon: 'shopping-cart' },
    { name: 'entertainment', color: '#8B5CF6', icon: 'film' },
    { name: 'shopping', color: '#EC4899', icon: 'shopping-bag' },
    { name: 'gas', color: '#F59E0B', icon: 'fuel' },
    { name: 'bills', color: '#EF4444', icon: 'file-text' },
    { name: 'healthcare', color: '#06B6D4', icon: 'heart' },
    { name: 'dining', color: '#F97316', icon: 'utensils' },
    { name: 'transportation', color: '#6366F1', icon: 'car' },
    { name: 'utilities', color: '#14B8A6', icon: 'zap' },
    { name: 'other', color: '#6B7280', icon: 'more-horizontal' }
  ];
};

// Method to initialize default categories for a user
categorySchema.statics.initializeForUser = async function(userId) {
  const defaultCategories = this.getDefaultCategories();
  const categories = defaultCategories.map(cat => ({
    userId,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    isDefault: true
  }));
  
  return await this.insertMany(categories);
};

module.exports = mongoose.model('Category', categorySchema);
