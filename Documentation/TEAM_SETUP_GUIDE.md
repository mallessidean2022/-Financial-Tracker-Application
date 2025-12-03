# 🚀 FINANCIAL TRACKER - COMPLETE SETUP GUIDE FOR TEAM

## 📋 **TABLE OF CONTENTS**
1. System Requirements
2. Installation Steps (Backend)
3. Installation Steps (Frontend)
4. Creating Demo Accounts
5. Adding Demo Data
6. Verification Checklist
7. Troubleshooting
8. Ready to Record!

---

## 💻 **SYSTEM REQUIREMENTS**

Before you start, make sure you have:

- [ ] **Node.js 14+** installed
  - Download: https://nodejs.org/
  - To check: Open Command Prompt and type `node --version`
  - Should show: v14.x.x or higher

- [ ] **Modern Web Browser**
  - Chrome (recommended) or Edge

- [ ] **Internet Connection**
  - Required for MongoDB Atlas connection

- [ ] **At least 500MB free disk space**

---

## 📥 **STEP 1: DOWNLOAD THE PROJECT FILES**

You should have received a ZIP file containing:
```
Financial-Tracker-Demo-Package.zip
├── Backend/           (Backend server files)
├── Frontend/          (Web interface files)
└── Documentation/     (Setup guides and demo script)
```

**Extract this ZIP file to:**
```
C:\FinancialTracker\
```

After extraction, you should have:
```
C:\FinancialTracker\
├── Backend\
└── Frontend\
```

---

## 🔧 **STEP 2: BACKEND SETUP (10 MINUTES)**

### **2.1: Open Command Prompt**

1. Press `Windows Key + R`
2. Type `cmd`
3. Press Enter

### **2.2: Navigate to Backend Folder**

Type this command and press Enter:
```bash
cd C:\FinancialTracker\Backend
```

### **2.3: Install Dependencies**

Type this command and press Enter:
```bash
npm install
```

**What you'll see:**
- Lots of text scrolling
- Progress bars
- "added XXX packages"
- This takes 2-3 minutes

**Wait until you see the command prompt again!**

### **2.4: Start the Backend Server**

Type this command and press Enter:
```bash
npm run dev
```

**✅ SUCCESS - You should see:**
```
[nodemon] starting `node server.js`
✓ MongoDB connected successfully
✓ Server running on port 3000
```

**🎉 Backend is now running!**

**⚠️ IMPORTANT: KEEP THIS WINDOW OPEN!**
- Do NOT close this Command Prompt window
- If you close it, the backend stops working
- You need this running during the entire demo

**❌ IF YOU SEE ERRORS:**
- See Troubleshooting section at the end
- Most common: Port 3000 already in use

---

## 🌐 **STEP 3: FRONTEND SETUP (2 MINUTES)**

### **3.1: Open File Explorer**

1. Press `Windows Key + E`
2. Navigate to: `C:\FinancialTracker\Frontend`

### **3.2: Verify Files Are Present**

You should see these files:
```
✓ admin-dashboard.html
✓ admin-users.html
✓ api-service.js
✓ categories.html
✓ dashboard.html
✓ expenses.html
✓ index.html          ← This is the login page
✓ profile.html
✓ register.html
✓ reports.html
✓ styles.css
✓ favicon.ico
```

**If any files are missing, contact the team immediately!**

### **3.3: Open the Application**

**Double-click:** `index.html`

**✅ SUCCESS - You should see:**
- Login page with FinTrack logo
- Email field
- Password field
- "Login" button
- "Don't have an account? Register here" link

**🎉 Frontend is working!**

---

## 👥 **STEP 4: CREATE DEMO ACCOUNTS (5 MINUTES)**

You need to create TWO types of users for the demo:
1. **Regular User** (normal expense tracking)
2. **Admin User** (system management)

### **4.1: Create Regular User Account**

**On the login page:**

1. Click **"Register here"**

2. Fill in the form:
   - **Email:** `regularuser@demo.com`
   - **Username:** `regularuser`
   - **Password:** `Regular2025`

3. Click **"Register"**

**✅ You should see:**
- Green message: "Account created! Redirecting..."
- Automatically goes to Dashboard
- Welcome message: "Welcome, regularuser@demo.com!"
- Navigation shows: Dashboard, Expenses, Reports, Categories, Profile, Logout
- **NO "Admin Panel" button** (this is correct!)

4. Click **"Logout"** button

### **4.2: Create Admin User Account**

**You're back at the login page:**

1. Click **"Register here"** again

2. Fill in the form:
   - **Email:** `admin@demo.com`
   - **Username:** `adminuser`
   - **Password:** `Admin2025`

3. Click **"Register"**

**✅ You should see:**
- Dashboard appears
- Welcome message

4. **KEEP THIS WINDOW OPEN - You need to do one more step!**

### **4.3: Make Admin User an Administrator**

**⚠️ CRITICAL STEP - Admin privileges are set in the database**

**Go back to your Command Prompt (where backend is running):**

1. Press `Ctrl + C` to stop the server (type `Y` if asked)

2. Type this command:
```bash
node createAdmin.js
```

**Wait... this will fail because admin@demo.com already exists. That's OK!**

**Instead, we need to manually update the database:**

**EASIER METHOD - Use MongoDB Directly:**

1. Keep backend stopped
2. We'll update it through a script

**Create a file:** `C:\FinancialTracker\Backend\setAdmin.js`

**Paste this code:**
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: 'admin@demo.com' },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log('✓ User updated to admin!');
      console.log('Email:', user.email);
      console.log('Role:', user.role);
    } else {
      console.log('❌ User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setAdmin();
```

3. Save the file

4. In Command Prompt (still in Backend folder), run:
```bash
node setAdmin.js
```

**✅ You should see:**
```
✓ Connected to MongoDB
✓ User updated to admin!
Email: admin@demo.com
Role: admin
```

5. **Restart the backend:**
```bash
npm run dev
```

**Wait for:**
```
✓ MongoDB connected successfully
✓ Server running on port 3000
```

### **4.4: Verify Admin Access**

**Go back to your browser:**

1. If still logged in, **Logout**

2. **Login again with:**
   - Email: `admin@demo.com`
   - Password: `Admin2025`

3. **✅ SUCCESS - You should see:**
   - Dashboard loads
   - **Orange "⚙️ Admin Panel" button** appears in navigation!

**🎉 Admin user is ready!**

---

## 📊 **STEP 5: ADD DEMO DATA (15 MINUTES)**

To make the demo impressive, add realistic expense data.

### **5.1: Login as Regular User**

1. **Logout** if currently logged in
2. **Login with:**
   - Email: `regularuser@demo.com`
   - Password: `Regular2025`

### **5.2: Add Expenses (Week 1: December 1-7)**

**Click "Expenses" in navigation**

**Add these expenses one by one:**

| Amount | Description | Category | Date |
|--------|-------------|----------|------|
| $85.50 | Weekly groceries | Grocery | Dec 1, 2025 |
| $45.00 | Gas station fill-up | Gas | Dec 2, 2025 |
| $120.00 | Internet bill | Bills | Dec 3, 2025 |
| $35.75 | Lunch at restaurant | Dining | Dec 4, 2025 |
| $65.00 | Pharmacy visit | Healthcare | Dec 5, 2025 |

**How to add each expense:**
1. Enter amount (without $)
2. Enter description
3. Select category from dropdown
4. **Change the date** to the date in the table above
5. Click "Add Expense"
6. Wait for success message
7. Repeat for next expense

### **5.3: Add More Expenses (Week 2: December 8-14)**

**Continue adding:**

| Amount | Description | Category | Date |
|--------|-------------|----------|------|
| $95.00 | Grocery shopping | Grocery | Dec 8, 2025 |
| $50.00 | Gas fill-up | Gas | Dec 10, 2025 |
| $200.00 | Electric bill | Bills | Dec 12, 2025 |
| $75.50 | New shoes | Shopping | Dec 13, 2025 |

### **5.4: Add Custom Category**

**Click "Categories" in navigation**

**Add a new category:**
1. Scroll to "Add New Category" form
2. Category Name: `Entertainment`
3. Description: `Movies, games, and fun activities`
4. Click "Add Category"

**✅ Should see:**
- Success message
- Entertainment appears in list with $0.00

**Go back to Expenses and add:**

| Amount | Description | Category | Date |
|--------|-------------|----------|------|
| $40.00 | Movie tickets | Entertainment | Dec 15, 2025 |
| $25.00 | Coffee with friends | Dining | Dec 17, 2025 |

### **5.5: Add Expenses as Admin User**

1. **Logout**
2. **Login as admin:**
   - Email: `admin@demo.com`
   - Password: `Admin2025`

3. **Add a few admin expenses:**

**Click "Expenses"**

| Amount | Description | Category | Date |
|--------|-------------|----------|------|
| $150.00 | Office supplies | Shopping | Dec 10, 2025 |
| $200.00 | Team lunch | Dining | Dec 12, 2025 |
| $300.00 | Software subscription | Bills | Dec 15, 2025 |

**Why add admin expenses?**
- Shows that admins also track personal expenses
- Makes system statistics more interesting
- Demonstrates data separation

---

## ✅ **STEP 6: VERIFICATION CHECKLIST**

Before recording, verify everything works:

### **6.1: Backend Running**
- [ ] Command Prompt window open
- [ ] Shows "Server running on port 3000"
- [ ] No error messages

### **6.2: Regular User Account**
- [ ] Can login as regularuser@demo.com
- [ ] Dashboard shows expenses
- [ ] **NO Admin Panel button** visible
- [ ] Has 11 expenses totaling $836.75
- [ ] Categories page shows all categories with amounts

### **6.3: Admin User Account**
- [ ] Can login as admin@demo.com
- [ ] Dashboard shows admin's expenses
- [ ] **Admin Panel button IS visible** (orange with gear icon)
- [ ] Can click Admin Panel and access admin dashboard
- [ ] Admin dashboard shows system statistics:
  - Total Users: 2
  - Administrators: 1
  - Total Expenses: 14+ (both users combined)

### **6.4: Admin Features**
- [ ] Admin Dashboard shows statistics
- [ ] User Management shows both users
- [ ] Can switch between "User View" and "Admin Panel"

### **6.5: Reports Work**
- [ ] Daily report generates
- [ ] Monthly report generates
- [ ] Charts display correctly
- [ ] Tables show data

**🎉 IF ALL CHECKBOXES ARE CHECKED, YOU'RE READY TO RECORD!**

---

## 🐛 **TROUBLESHOOTING**

### **Problem 1: Backend Won't Start - Port Already in Use**

**Error message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. Something else is using port 3000
2. Stop the other program OR
3. Find what's using it:
   ```bash
   netstat -ano | findstr :3000
   ```
4. Kill that process:
   ```bash
   taskkill /PID [number] /F
   ```
5. Try starting backend again

### **Problem 2: MongoDB Connection Failed**

**Error message:**
```
MongoServerError: bad auth
```

**Solution:**
1. Check your internet connection
2. MongoDB Atlas credentials are built-in
3. If still fails, contact team lead

### **Problem 3: Admin Panel Button Not Showing**

**Solutions to try:**
1. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "All time"
   - Clear all data
   - Close browser completely
   - Open again and login

2. **Verify admin role was set:**
   - Run `node setAdmin.js` again
   - Should confirm role is admin

3. **Hard refresh:**
   - Press `Ctrl + Shift + R`

### **Problem 4: "npm: command not found"**

**Solution:**
1. Node.js is not installed
2. Download from: https://nodejs.org/
3. Install and restart Command Prompt

### **Problem 5: Files Missing**

**Solution:**
1. Re-extract the ZIP file
2. Make sure you extract to `C:\FinancialTracker\`
3. Check both Backend and Frontend folders exist

### **Problem 6: Login Doesn't Work**

**Solutions:**
1. Make sure backend is running (check Command Prompt)
2. Try different browser
3. Clear browser cache
4. Check for typos in email/password

### **Problem 7: Expenses Not Showing in Reports**

**Solution:**
1. Make sure you entered dates correctly
2. Try Monthly Report for December 2025
3. Check that expenses were actually saved (go to Expenses page)

---

## 📞 **EMERGENCY CONTACT**

If you cannot resolve an issue:

**Contact:** [Your Name]
**Email:** [Your Email]
**Phone/WhatsApp:** [Your Number]

**Include in your message:**
1. Screenshot of the error
2. What step you were on
3. What you've already tried

---

## 🎬 **NEXT STEP: DEMO SCRIPT**

Once everything is set up and verified, proceed to the **DEMO_SCRIPT.md** document for step-by-step recording instructions.

**Estimated Setup Time:** 30-45 minutes
**Estimated Demo Recording:** 20-25 minutes

---

## 🎯 **QUICK START SUMMARY**

For someone in a hurry:

1. Extract files to `C:\FinancialTracker\`
2. Open CMD in Backend folder
3. Run: `npm install` then `npm run dev`
4. Open `Frontend/index.html` in browser
5. Register two users: regularuser@demo.com and admin@demo.com
6. Run: `node setAdmin.js` to make admin user an administrator
7. Add demo expenses (see Step 5)
8. Verify everything (see Step 6)
9. Start recording demo (use DEMO_SCRIPT.md)

---

**YOU'RE ALL SET! PROCEED TO DEMO_SCRIPT.MD FOR RECORDING INSTRUCTIONS** 🎥
