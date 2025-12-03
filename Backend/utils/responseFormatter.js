/**
 * Standard success response format
 */
const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Standard error response format
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Pagination helper
 */
const getPaginationData = (page, limit, total) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / parseInt(limit)),
    hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
    hasPrevPage: parseInt(page) > 1
  };
};

module.exports = {
  successResponse,
  errorResponse,
  getPaginationData
};
