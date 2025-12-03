# 💰 Financial Tracker Application

Full-stack expense tracking application with admin dashboard and analytics.

## 🎯 Project Overview

Financial Tracker is a comprehensive web application designed for personal expense management with advanced administrative features. Built for CEN4010 - Prin Software Engineering.

## ✨ Features

### User Features
- 🔐 Secure authentication (JWT)
- 💳 Complete expense management (CRUD)
- 📊 Advanced reporting with interactive charts
- 🏷️ Custom category management
- 🔍 Filtering and search
- 👤 User profile management

### Admin Features
- 📈 System-wide statistics dashboard
- 👥 User management (create, modify, delete)
- 🔑 Role-based access control
- 📊 Activity monitoring
- ⚡ Real-time data updates

## 🛠️ Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js for data visualization

## 📋 Prerequisites

- Node.js 14+ ([Download](https://nodejs.org/))
- Modern web browser (Chrome, Edge, Firefox)
- Internet connection (for MongoDB Atlas)

## 🚀 Quick Start

### 1. Download Repository

Click the green "Code" button → "Download ZIP"

Extract to `C:\FinancialTracker\`

### 2. Backend Setup

```bash
cd C:\FinancialTracker\Financial-Tracker-Application-main\Backend
npm install
```

Create `.env` file (copy from `.env.example`):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 3000
```

### 3. Frontend Setup

Open `Frontend/index.html` in your browser.

### 4. Create Admin User

After registering an admin account (`admin@demo.com`), run:
```bash
node setAdmin.js
```

This will upgrade the admin account to have administrator privileges.

## 📖 Complete Documentation

See the `Documentation/` folder for detailed guides:
- **TEAM_SETUP_GUIDE.md** - Complete installation guide (step-by-step)
- **DEMO_SCRIPT.md** - Demo recording script with dialogue
- **QUICK_REFERENCE.md** - Quick reference card
- **FILE_CHECKLIST.md** - File verification checklist

## 👥 Demo Accounts

After completing setup, use these credentials for testing:

**Regular User:**
- Email: `regularuser@demo.com`
- Password: `Regular2025`
- Access: Personal expense tracking only

**Admin User:**
- Email: `admin@demo.com`
- Password: `Admin2025`
- Access: Full system access + Admin Panel

## 🎬 Demo Recording

To record your demo:
1. Follow the complete setup guide
2. Add demo data (instructions in setup guide)
3. Use the demo script in `Documentation/DEMO_SCRIPT.md`
4. Record a 20-25 minute walkthrough

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get all user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/category-stats` - Category breakdown
- `GET /api/reports/daily` - Daily report
- `GET /api/reports/monthly` - Monthly report

### Admin (Protected)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - All users list
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id/role` - Change user role
- `DELETE /api/admin/users/:id` - Delete user

## 🏗️ Project Structure

```
Financial-Tracker-Application/
├── Backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js   # Admin operations
│   │   ├── authController.js    # Authentication
│   │   ├── categoryController.js # Category management
│   │   ├── expenseController.js  # Expense CRUD
│   │   └── reportController.js   # Reports & analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── authorizeAdmin.js    # Admin authorization
│   ├── models/
│   │   ├── Category.js          # Category schema
│   │   ├── Expense.js           # Expense schema
│   │   ├── Session.js           # Session schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── admin.js             # Admin routes
│   │   ├── auth.js              # Auth routes
│   │   ├── categories.js        # Category routes
│   │   ├── expenses.js          # Expense routes
│   │   └── reports.js           # Report routes
│   ├── .env.example             # Environment template
│   ├── package.json             # Dependencies
│   ├── server.js                # Main server file
│   ├── createAdmin.js           # Admin creation script
│   └── setAdmin.js              # Set admin role script
├── Frontend/
│   ├── admin-dashboard.html     # Admin overview
│   ├── admin-users.html         # User management
│   ├── api-service.js           # API communication layer
│   ├── categories.html          # Category management
│   ├── dashboard.html           # User dashboard
│   ├── expenses.html            # Expense tracking
│   ├── index.html               # Login page
│   ├── profile.html             # User profile
│   ├── register.html            # User registration
│   ├── reports.html             # Reports & analytics
│   ├── styles.css               # Application styles
│   └── favicon.ico              # Browser icon
└── Documentation/
    ├── TEAM_SETUP_GUIDE.md      # Complete setup instructions
    ├── DEMO_SCRIPT.md           # Recording script
    ├── QUICK_REFERENCE.md       # Quick reference
    └── FILE_CHECKLIST.md        # Verification checklist
```

## 🔒 Security Features

- **Password Hashing:** bcrypt with 10 rounds
- **JWT Authentication:** Secure token-based auth
- **Role-Based Access:** Admin vs Regular user permissions
- **Input Validation:** Server-side validation on all inputs
- **CORS Configuration:** Controlled cross-origin requests
- **Protected Routes:** Authentication required for all protected endpoints
- **Admin Verification:** Dual-layer protection (auth + admin check)

## 🐛 Troubleshooting

### Backend won't start - Port 3000 in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID [PID] /F

# Try starting again
npm run dev
```

### MongoDB connection failed
- Check internet connection
- Verify MongoDB URI in .env file
- Ensure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for testing)

### Admin Panel button not showing
```bash
# Stop backend (Ctrl+C)
# Run admin setup script
node setAdmin.js

# Restart backend
npm run dev

# Clear browser cache and login again
```

### npm install fails
- Delete node_modules folder
- Delete package-lock.json
- Run `npm install` again
- Make sure you have Node.js 14+ installed

## 👨‍💻 Team Members

- **Matheus Allessi** - Full-stack development
- **Abigail Clermont** - Testing and documentation
- **Rhijhaye Robinson** - Frontend development
- **Lillyan Henry** - Testing and documentation

## 📚 Course Information

**Course:** CEN4010 - Software Engineering I  
**Institution:** Florida Atlantic University  
**Semester:** Fall 2025  
**Professor:** Prof. Ankur Agarwal

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- RESTful API design
- Database modeling with MongoDB
- Authentication and authorization
- Role-based access control
- Frontend-backend integration
- Responsive UI design
- Version control with Git
- Software documentation
- Team collaboration

## 📄 License

This project is for educational purposes as part of CEN4010 coursework.

## 🆘 Support

For issues or questions:
- Check the [Documentation](./Documentation/) folder
- Review the troubleshooting section above
- Contact team members
- Open an issue on GitHub

## 🙏 Acknowledgments

- **Chart.js** - Data visualization library
- **MongoDB Atlas** - Cloud database hosting
- **Node.js & Express.js** - Backend framework
- **JWT** - Authentication standard
- **bcrypt** - Password hashing
- **Mongoose** - MongoDB ODM
- **Professor Ankur Agarwal** - Course instruction and guidance
- **CEN4010 Teaching Staff** - Project support

## 📈 Future Enhancements

Potential features for future versions:
- Budget tracking and alerts
- Recurring expense management
- Multi-currency support
- Export to CSV/PDF
- Email notifications
- Mobile responsive design improvements
- Budget vs actual spending comparison
- Expense attachments (receipts)
- Shared expense tracking (household/team)
- API rate limiting
- Two-factor authentication

## 🔗 Useful Links

- **Node.js Documentation:** https://nodejs.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **MongoDB Manual:** https://docs.mongodb.com/
- **JWT Introduction:** https://jwt.io/introduction
- **Chart.js Documentation:** https://www.chartjs.org/docs/

---

**Built with ❤️ for CEN4010 Prin Software Engineering**

*Last Updated: December 2025*
