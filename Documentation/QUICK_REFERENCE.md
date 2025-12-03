# 📋 QUICK REFERENCE CARD

## 🚀 **QUICK START (5 MINUTES)**

### **Backend Setup:**
```bash
cd C:\FinancialTracker\Backend
npm install
npm run dev
```
✅ Wait for: "Server running on port 3000"

### **Frontend Setup:**
Double-click: `C:\FinancialTracker\Frontend\index.html`

---

## 👥 **DEMO ACCOUNTS**

### **Regular User:**
- Email: `regularuser@demo.com`
- Password: `Regular2025`
- Has: Personal expense tracking
- No: Admin panel access

### **Admin User:**
- Email: `admin@demo.com`
- Password: `Admin2025`
- Has: Everything + Admin Panel
- See: Orange ⚙️ Admin Panel button

**⚠️ IMPORTANT:** After creating admin user, run:
```bash
node setAdmin.js
```

---

## 📊 **DEMO DATA TO ADD**

### **As Regular User (11 expenses):**

**Week 1:**
| Amount | Description | Category | Date |
|--------|-------------|----------|------|
| $85.50 | Weekly groceries | Grocery | Dec 1 |
| $45.00 | Gas fill-up | Gas | Dec 2 |
| $120.00 | Internet bill | Bills | Dec 3 |
| $35.75 | Lunch | Dining | Dec 4 |
| $65.00 | Pharmacy | Healthcare | Dec 5 |

**Week 2:**
| $95.00 | Grocery shopping | Grocery | Dec 8 |
| $50.00 | Gas | Gas | Dec 10 |
| $200.00 | Electric bill | Bills | Dec 12 |
| $75.50 | Shoes | Shopping | Dec 13 |
| $40.00 | Movie tickets | Entertainment* | Dec 15 |
| $25.00 | Coffee | Dining | Dec 17 |

*Create "Entertainment" category first with description "Movies, games, and fun activities"

### **As Admin User (3 expenses):**
| $150.00 | Office supplies | Shopping | Dec 10 |
| $200.00 | Team lunch | Dining | Dec 12 |
| $300.00 | Software subscription | Bills | Dec 15 |

---

## 🎬 **DEMO FLOW (25 MINUTES)**

1. **Introduction** (2 min) - Explain project
2. **Register Regular User** (2 min) - Show registration
3. **Expenses** (4 min) - Add, edit, delete, filter
4. **Reports** (3 min) - Daily, monthly reports
5. **Categories** (2 min) - View, add custom
6. **Profile** (1 min) - Show account info
7. **Admin Login** (2 min) - Show admin button
8. **Admin Dashboard** (3 min) - System stats
9. **User Management** (4 min) - View, create, modify, delete users
10. **Switch Views** (2 min) - Admin ↔ User view
11. **Security Demo** (1 min) - Regular user can't access admin
12. **Conclusion** (1 min) - Summarize features

---

## ✅ **VERIFICATION CHECKLIST**

Before recording:
- [ ] Backend running (no errors)
- [ ] Can login as regular user
- [ ] Can login as admin user
- [ ] Admin sees Admin Panel button
- [ ] Regular user does NOT see Admin Panel button
- [ ] All demo data added
- [ ] Reports generate correctly
- [ ] Charts display properly
- [ ] Browser cache cleared
- [ ] Notifications turned off

---

## 🐛 **QUICK TROUBLESHOOTING**

**Backend won't start:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [number] /F
npm run dev
```

**Admin button not showing:**
1. Run `node setAdmin.js`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Logout and login again

**MongoDB connection failed:**
- Check internet connection
- Restart backend

**Forgot password:**
- Create a new demo account
- Use different email

---

## 📞 **EMERGENCY CONTACTS**

**Technical Issues:** [Your Name]
- Email: [Your Email]
- Phone: [Your Number]

**Include in message:**
- Screenshot of error
- What step you're on
- What you tried

---

## 🎯 **KEY POINTS TO EMPHASIZE**

When recording, make sure to show:
1. ✅ Two user types (regular vs admin)
2. ✅ Admin Panel button only for admins
3. ✅ Complete expense CRUD operations
4. ✅ Visual charts and reports
5. ✅ Real-time updates in admin panel
6. ✅ User creation/deletion
7. ✅ Security (can't access admin as regular user)

---

## 💡 **PRO TIPS**

**Recording:**
- Practice script once before recording
- Speak clearly and slowly
- Show, don't just tell
- Point out important features
- Keep mouse movements smooth

**If you mess up:**
- Pause for 3 seconds
- Back up to last sentence
- Continue from there
- Edit out mistakes later

**Audio:**
- Use good microphone
- Quiet room
- Close windows
- Turn off fans

---

## 📁 **FILE LOCATIONS**

**Backend:** `C:\FinancialTracker\Backend\`
**Frontend:** `C:\FinancialTracker\Frontend\`
**Start:** `Frontend\index.html`

---

## ⏱️ **TIME ESTIMATES**

- Setup: 30-45 minutes
- Add demo data: 15 minutes
- Practice demo: 15 minutes
- Record demo: 25 minutes
- Review & fix: 15 minutes
**Total: ~2 hours**

---

**GOOD LUCK! YOU'VE GOT THIS! 🌟**
