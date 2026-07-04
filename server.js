const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Serve static assets from current folder
app.use(express.static(path.join(__dirname)));

// Helper: Read Database
function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            // write empty template if not exists
            const template = { users: [], transactions: [] };
            fs.writeFileSync(DB_FILE, JSON.stringify(template, null, 2));
            return template;
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return { users: [], transactions: [] };
    }
}

// Helper: Write Database
function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing database:", err);
    }
}

// API: User Sign Up
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, age, incomeGroup } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const db = readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
        return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Map income group value to standard SBI levels
    let incomeText = "2.5 - 5 Lacs";
    let incomeVal = "2.5 - 5";
    if (incomeGroup === "less_2_5") { incomeText = "< 2.5 Lacs"; incomeVal = "< 2.5"; }
    else if (incomeGroup === "5_7") { incomeText = "5 - 7 Lacs"; incomeVal = "5 - 7"; }
    else if (incomeGroup === "7_10") { incomeText = "7 - 10 Lacs"; incomeVal = "7 - 10"; }
    else if (incomeGroup === "more_10") { incomeText = "> 10 Lacs"; incomeVal = "> 10"; }

    const userAge = parseInt(age) || 25;
    let userLevel = "Medium";
    if (userAge > 50) userLevel = "Low";

    const newUser = {
        id: "user_" + Math.floor(100000 + Math.random() * 900000),
        name,
        email,
        password, // stored plain text for simulation simplicity
        age: userAge,
        income: incomeText,
        incomeVal: incomeVal,
        level: userLevel,
        dob: "01/01/" + (new Date().getFullYear() - userAge), // mock dob
        risk: userLevel === "Low" ? "Low (Conservative)" : "High (Aggressive)",
        aiAdvice: `Based on your age (${userAge}) and profile, starting an equity-heavy SIP of ₹ 5,000 for 10+ years is ideal to beat inflation.`,
        paymentSetup: { upi: false, autopay: false }
    };

    db.users.push(newUser);
    writeDB(db);

    res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// API: User Log In
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password. Please try again." });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            income: user.income,
            incomeVal: user.incomeVal,
            level: user.level,
            dob: user.dob,
            risk: user.risk,
            aiAdvice: user.aiAdvice,
            paymentSetup: user.paymentSetup
        }
    });
});

// API: Add Transaction
app.post('/api/transactions', (req, res) => {
    const { email, type, description, amount } = req.body;
    
    if (!email || !type) {
        return res.status(400).json({ error: "Email and transaction type are required." });
    }

    const db = readDB();
    const newTxn = {
        id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
        userEmail: email,
        type,
        description,
        amount: amount || "0",
        timestamp: new Date().toISOString()
    };

    db.transactions.push(newTxn);
    writeDB(db);

    res.json({ success: true, transaction: newTxn });
});

// API: Get Transactions
app.get('/api/transactions', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "User email is required" });
    }
    
    const db = readDB();
    const userTxns = db.transactions.filter(t => t.userEmail.toLowerCase() === email.toLowerCase());
    
    // Sort transactions reverse chronological
    userTxns.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ transactions: userTxns });
});

// Mock In-memory Admin Log states (clears on restart, persistent in memory for the active session)
let adminLogs = [
    {
        time: "14:12:02",
        profileName: "Ramesh",
        product: "Insurance",
        friction: "Form paused on DOB (22s)",
        action: "Calculated Age & Autocompleted",
        actionColor: "green"
    },
    {
        time: "14:10:45",
        profileName: "Ananya",
        product: "Payments",
        friction: "Hesitation on UPI Lite limits",
        action: "Provided Micro-comparison",
        actionColor: "blue"
    }
];

// API: Admin Logs
app.get('/api/admin/logs', (req, res) => {
    res.json({ logs: adminLogs });
});

app.post('/api/admin/logs', (req, res) => {
    const { profileName, product, friction, action, actionColor } = req.body;
    const time = new Date().toLocaleTimeString();
    const newLog = {
        time,
        profileName,
        product,
        friction,
        action,
        actionColor: actionColor || "blue"
    };
    adminLogs.unshift(newLog);
    if (adminLogs.length > 25) {
        adminLogs.pop();
    }
    res.json({ success: true, log: newLog });
});

app.delete('/api/admin/logs', (req, res) => {
    adminLogs = [];
    res.json({ success: true });
});

// Fallback index.html route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
