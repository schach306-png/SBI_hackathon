const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static assets from current folder
app.use(express.static(path.join(__dirname)));

// Mock In-memory Database
let activePersonaId = "young_pro";

const profiles = {
    first_time: {
        name: "Ramesh Kumar",
        age: 55,
        income: "4.8 Lacs",
        incomeVal: "2.5 - 5",
        level: "Low",
        fname: "Ramesh",
        lname: "Kumar",
        dob: "15/08/1971",
        risk: "Low (Conservative)",
        aiAdvice: "Ramesh, at age 55, capital safety is priority. The SBI Conservative Hybrid Mutual Fund is ideal. Starting an autopay SIP of ₹ 2,000 ensures disciplined growth with minimum digital friction.",
        paymentSetup: { upi: false, autopay: false }
    },
    young_pro: {
        name: "Ananya Sharma",
        age: 24,
        income: "8.5 Lacs",
        incomeVal: "7 - 10",
        level: "Medium",
        fname: "Ananya",
        lname: "Sharma",
        dob: "22/11/2002",
        risk: "High (Aggressive)",
        aiAdvice: "Based on your age (24) and high growth window, starting an equity-heavy SIP in SBI Bluechip Fund or Small Cap Fund of ₹ 5,000 for 10+ years is ideal to beat inflation.",
        paymentSetup: { upi: false, autopay: false }
    },
    rural_merchant: {
        name: "Vikram Singh",
        age: 42,
        income: "6.2 Lacs",
        incomeVal: "5 - 7",
        level: "Medium",
        fname: "Vikram",
        lname: "Singh",
        dob: "04/04/1984",
        risk: "Moderate (Balanced)",
        aiAdvice: "Vikram, to secure your shop earnings, we recommend an SBI Equity Hybrid Fund SIP of ₹ 3,000. It balances safety and equity growth with easy mobile monitoring.",
        paymentSetup: { upi: false, autopay: false }
    }
};

let submittedOnboarding = [];
let activeMandates = [];
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
    },
    {
        time: "14:08:15",
        profileName: "Vikram",
        product: "Investments",
        friction: "Confused by compound interest SIP math",
        action: "Triggered SVG return planner tooltip",
        actionColor: "orange"
    }
];

// API: Get Active Profile
app.get('/api/persona', (req, res) => {
    res.json({
        activeId: activePersonaId,
        profile: profiles[activePersonaId]
    });
});

// API: Set Active Profile
app.post('/api/persona', (req, res) => {
    const { id } = req.body;
    if (profiles[id]) {
        activePersonaId = id;
        res.json({ success: true, activeId: activePersonaId, profile: profiles[activePersonaId] });
    } else {
        res.status(400).json({ error: "Invalid profile ID" });
    }
});

// API: Submit Onboarding details (Insurance form)
app.post('/api/insurance/onboard', (req, res) => {
    const { fname, lname, dob, income, beneficiary, medicalWaiver } = req.body;
    const application = {
        id: "INS-" + Math.floor(100000 + Math.random() * 900000),
        persona: activePersonaId,
        fname,
        lname,
        dob,
        income,
        beneficiary,
        medicalWaiver: !!medicalWaiver,
        timestamp: new Date().toISOString()
    };
    submittedOnboarding.push(application);
    res.json({ success: true, application });
});

// API: Setup UPI Lite wallet
app.post('/api/payments/upi', (req, res) => {
    const { amount, bankAccount } = req.body;
    profiles[activePersonaId].paymentSetup.upi = true;
    const mandate = {
        type: "UPI Lite",
        amount,
        bankAccount,
        timestamp: new Date().toISOString()
    };
    activeMandates.push(mandate);
    res.json({ success: true, mandate });
});

// API: Setup Autopay
app.post('/api/payments/autopay', (req, res) => {
    const { biller, limit } = req.body;
    profiles[activePersonaId].paymentSetup.autopay = true;
    const mandate = {
        type: "Autopay",
        biller,
        limit,
        timestamp: new Date().toISOString()
    };
    activeMandates.push(mandate);
    res.json({ success: true, mandate });
});

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
