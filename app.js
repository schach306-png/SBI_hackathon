// SBI Digital Adoption Hub - Pillar 2 (Agentic AI) Simulation Logic

// Mock Data Profiles
const personas = {
    first_time: {
        name: "Ramesh Kumar",
        age: 55,
        income: "4.8 Lacs",
        incomeVal: "2.5 - 5",
        level: "Low",
        levelClass: "trend-down",
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
        levelClass: "level-high",
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
        levelClass: "level-high",
        fname: "Vikram",
        lname: "Singh",
        dob: "04/04/1984",
        risk: "Moderate (Balanced)",
        aiAdvice: "Vikram, to secure your shop earnings, we recommend an SBI Equity Hybrid Fund SIP of ₹ 3,000. It balances safety and equity growth with easy mobile monitoring.",
        paymentSetup: { upi: false, autopay: false }
    }
};

let currentPersonaId = "young_pro";
let activeJourney = "insurance";
let voiceListening = false;
let adminInterventionsCount = 1842;
let formFrictionTimer = null;

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    // Switch to default persona values
    loadPersona(currentPersonaId);
    
    // Auto-update SIP Planner
    updateSipCalculation();
    
    // Set up hover tracking for form friction simulation
    setupFrictionTracking();

    // Log startup
    addCopilotLog("Agentic AI engine standing by. Hover over inputs to trigger context analysis.", "system");
});

// Switch Persona
function changePersona() {
    const select = document.getElementById("persona-select");
    currentPersonaId = select.value;
    loadPersona(currentPersonaId);
}

function loadPersona(id) {
    const profile = personas[id];
    
    // Update Sidebar Profile Info
    document.getElementById("user-profile-name").textContent = profile.name;
    document.getElementById("user-profile-age").textContent = profile.age;
    document.getElementById("user-profile-income").textContent = profile.income;
    
    const levelSpan = document.getElementById("user-profile-level");
    levelSpan.textContent = profile.level;
    levelSpan.className = ""; // clear
    if (profile.level === "Low") {
        levelSpan.classList.add("trend-down");
    } else {
        levelSpan.classList.add("level-high");
    }

    // Reset Forms to empty first
    resetInsuranceForm();

    // Update SIP Recommendations text
    const recText = document.getElementById("sip-ai-recommendation");
    if (recText) recText.textContent = profile.aiAdvice;

    // Log AI behavior adjustment
    addCopilotLog(`[AI] Behavior profile updated for ${profile.name}. Adaptive guidance strategy adjusted to: ${profile.level} digital confidence.`, "info");

    // Close any open mock simulator modal
    closePhoneSimulation();
}

// Mode Switching (Customer Simulator vs Admin Analytics)
function switchMode(mode) {
    const btnSim = document.getElementById("btn-mode-simulator");
    const btnAdmin = document.getElementById("btn-mode-admin");
    const secSim = document.getElementById("section-simulator");
    const secAdmin = document.getElementById("section-admin");

    if (mode === "simulator") {
        btnSim.classList.add("active");
        btnAdmin.classList.remove("active");
        secSim.classList.add("active");
        secAdmin.classList.remove("active");
        addCopilotLog("[SYS] Switched to Customer Journey Experience Simulator.", "system");
    } else {
        btnSim.classList.remove("active");
        btnAdmin.classList.add("active");
        secSim.classList.remove("active");
        secAdmin.classList.add("active");
        addCopilotLog("[SYS] Switched to Admin Digital Adoption Analytics View.", "system");
    }
}

// Journey Switcher
function switchJourney(journey) {
    activeJourney = journey;
    
    // Update active tab styling in aside nav
    const navItems = document.querySelectorAll(".journey-nav .nav-item");
    navItems.forEach(item => item.classList.remove("active"));
    
    // Find matching button based on click handler
    const targetBtn = Array.from(navItems).find(btn => btn.getAttribute("onclick").includes(journey));
    if (targetBtn) targetBtn.classList.add("active");

    // Show/Hide Journey Cards
    const cards = document.querySelectorAll(".journey-card");
    cards.forEach(card => card.classList.remove("active"));
    
    const activeCard = document.getElementById(`journey-${journey}`);
    if (activeCard) activeCard.classList.add("active");

    addCopilotLog(`[SYS] Switched simulated journey to: ${journey.toUpperCase()}`, "system");

    // Contextual initial nudge based on tab
    if (journey === "insurance") {
        triggerNudge("SBI eWealth Onboarding", 
            "Hover over the annual income options or DOB field. Notice how the AI guides inputs or autocalculates details dynamically. Click 'Auto-fill' at the top to see AI complete the form instantly.",
            `<button class="nudge-btn nudge-btn-primary" onclick="triggerAiAutocomplete()">Simulate Auto-fill</button>`
        );
    } else if (journey === "investments") {
        triggerNudge("SIP & Wealth Advisor", 
            "Move the investment sliders. The dynamic compound calculator uses standard compounding equations to visualize returns. The AI recommends funds based on the active persona profile.",
            `<button class="nudge-btn" onclick="simulateVoiceCommand('What is the interest rate of a 1-year Fixed Deposit?')">Ask interest rate</button>`
        );
    } else if (journey === "payments") {
        triggerNudge("Payments Adoption Helper", 
            "Digital payments can be intimidating for some users. AI Lite provides micro-wizards that simulate the steps in detail. Click 'Activate Now' under UPI Lite to see the guided setup flow.",
            `<button class="nudge-btn nudge-btn-primary" onclick="startUpiActivation()">Activate UPI Lite</button>`
        );
    } else if (journey === "mobile") {
        triggerNudge("Conversational Assistant", 
            "The Agentic Mobile Banking assistant supports voice and text commands to automate customer actions. Select any prompt chip below to see it navigate the app.",
            `<button class="nudge-btn" onclick="simulateVoiceCommand('Compare term insurance plans')">Select Promo Chip</button>`
        );
    }
}

// AI Co-Pilot Log Manager
function addCopilotLog(message, type = "info") {
    const logsContainer = document.getElementById("copilot-logs");
    if (!logsContainer) return;

    const time = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${time}] ${message}`;

    logsContainer.appendChild(entry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Trigger Nudge Box Update
function triggerNudge(title, content, actionsHtml = "") {
    const box = document.getElementById("copilot-nudge-box");
    const nudgeTitle = document.getElementById("nudge-title");
    const nudgeContent = document.getElementById("nudge-content");
    const nudgeActions = document.getElementById("nudge-actions-area");

    if (!box) return;

    // Reset animation
    box.classList.remove("active");
    void box.offsetWidth; // trigger reflow
    box.classList.add("active");

    nudgeTitle.textContent = title;
    nudgeContent.textContent = content;
    nudgeActions.innerHTML = actionsHtml || "";

    // Update pulse indicator status
    const pulse = document.getElementById("copilot-pulse");
    const pulseText = document.getElementById("copilot-status-text");
    pulse.className = "pulse-indicator status-nudge";
    pulseText.textContent = "Active nudge shown to user";
}

// Reset pulse to scanning
function setAiScanning() {
    const pulse = document.getElementById("copilot-pulse");
    const pulseText = document.getElementById("copilot-status-text");
    if (pulse) {
        pulse.className = "pulse-indicator status-scanning";
        pulseText.textContent = "Scanning for user friction...";
    }
}

// Friction Tracking Simulation (Hover / Inactivity listeners)
function setupFrictionTracking() {
    // Track DOB focus and entry
    const dobInput = document.getElementById("input-dob");
    if (dobInput) {
        dobInput.addEventListener("mouseenter", () => {
            addCopilotLog("[AI] Checking user's date of birth field interaction...", "thought");
            triggerNudge("DOB Guidance Helper", 
                "Entering DOB determines policy pricing and eligibility. Ensure format is DD/MM/YYYY. The AI autocalculates your exact banking age in real-time.",
                `<button class="nudge-btn nudge-btn-primary" onclick="simulateDobFill()">Auto-fill DOB</button>`
            );
        });
    }

    // Track income group selection
    const incomeGroup = document.getElementById("group-income");
    if (incomeGroup) {
        incomeGroup.addEventListener("mouseenter", () => {
            const profile = personas[currentPersonaId];
            addCopilotLog(`[AI] User is evaluating income group options. Matching against verified persona ${profile.name}...`, "thought");
            triggerNudge("Income Documentation", 
                `Based on tax filing records, your annual income bracket is estimated in the "${profile.income}" range. Select this bracket to skip verification documents.`,
                `<button class="nudge-btn nudge-btn-primary" onclick="selectProfileIncome()">Select Recommended Bracket</button>`
            );
        });
    }
}

// Select Recommended Profile Income
function selectProfileIncome() {
    const profile = personas[currentPersonaId];
    const value = profile.incomeVal;
    const btn = Array.from(document.querySelectorAll(".income-btn")).find(b => b.getAttribute("data-value") === value);
    if (btn) {
        selectIncome(btn);
        addCopilotLog(`[AI] Autoselected annual income bracket '${value} Lacs' matching user tax history.`, "success");
    }
}

// Simulated DOB Auto-fill
function simulateDobFill() {
    const profile = personas[currentPersonaId];
    const input = document.getElementById("input-dob");
    if (input) {
        input.value = profile.dob;
        onDobInput(input);
        addCopilotLog(`[AI] Autocompleted Date of Birth to '${profile.dob}' based on official ID registry.`, "success");
    }
}

// Interactive Insurance Form Functions
function selectIncome(btn) {
    const buttons = document.querySelectorAll(".income-btn");
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const val = btn.getAttribute("data-value");
    addCopilotLog(`[AI] User selected income tier: ${val} Lacs`, "info");
    
    // Log in admin panel
    logAdminIntervention(personas[currentPersonaId].name, "Insurance", `Selected Income bracket ${val} Lacs`, "Verified and stored");
}

function selectBeneficiary(btn) {
    const buttons = document.querySelectorAll(".beneficiary-btn");
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const val = btn.getAttribute("data-value");
    addCopilotLog(`[AI] Policy beneficiary selected: ${val}`, "info");
}

// DOB Input event
function onDobInput(input) {
    const val = input.value;
    const ageCalcSpan = document.getElementById("span-age-calc");
    
    if (val.length === 10) {
        // Calculate age
        const parts = val.split("/");
        if (parts.length === 3) {
            const birthYear = parseInt(parts[2]);
            const currentYear = new Date().getFullYear();
            const calculatedAge = currentYear - birthYear;
            
            if (!isNaN(calculatedAge)) {
                ageCalcSpan.textContent = calculatedAge;
                
                // Adaptive AI response if age is non-standard
                if (calculatedAge > 50) {
                    addCopilotLog(`[WARNING] Calculated age is ${calculatedAge} years. Core eWealth Plus standard plans are optimized for ages below 50.`, "warning");
                    triggerNudge("Senior Citizen Adaptive Nudge",
                        "We detected your calculated age is over 50. Standard digital onboarding plans might require physical medical screening. Would you like the AI to attach an online diagnostic waiver?",
                        `<button class="nudge-btn nudge-btn-primary" onclick="addMedicalWaiver()">Attach AI Diagnostic Waiver</button>`
                    );
                } else {
                    addCopilotLog(`[AI] Verified age: ${calculatedAge} (Eligible for instant digital sign-off).`, "success");
                }
                
                logAdminIntervention(personas[currentPersonaId].name, "Insurance", `Entered DOB (${val}, Age: ${calculatedAge})`, "Dynamic plan eligibility check");
                return;
            }
        }
    }
    ageCalcSpan.textContent = "--";
}

function addMedicalWaiver() {
    addCopilotLog("[AI] Attached Digital Diagnostic Waiver successfully. Bypassed physical documentation requirement (Pillar 2 Digital Adoption feature).", "success");
    triggerNudge("Waiver Added", 
        "Diagnostic waiver attached. Your digital onboarding will proceed seamlessly without physical medical records.",
        `<button class="nudge-btn" onclick="setAiScanning()">Proceed Form</button>`
    );
}

function focusField(fieldName) {
    addCopilotLog(`[AI] User focused on: ${fieldName.toUpperCase()} field. Monitoring keyboard input confidence...`, "thought");
    
    if (fieldName === "fname" || fieldName === "lname") {
        triggerNudge("Full Name Requirement", 
            "Ensure the name entered matches the spelling on your PAN card exactly. Small discrepancies cause 12% of digital bank onboarding dropouts.",
            `<button class="nudge-btn" onclick="triggerAiAutocomplete()">Use Profile Name</button>`
        );
    }
}

function checkInputFname(input) {
    // If they stop typing or clear it
    if (input.value.length > 0) {
        setAiScanning();
    }
}

// Reset Insurance Form
function resetInsuranceForm() {
    const form = document.getElementById("insurance-form");
    if (form) form.reset();
    
    document.getElementById("span-age-calc").textContent = "--";
    
    // Reset buttons to default
    const incButtons = document.querySelectorAll(".income-btn");
    incButtons.forEach(b => b.classList.remove("active"));
    
    const benButtons = document.querySelectorAll(".beneficiary-btn");
    benButtons.forEach(b => b.classList.remove("active"));
    
    // Set default active based on young_pro persona
    const profile = personas[currentPersonaId];
    const defaultIncomeBtn = Array.from(incButtons).find(b => b.getAttribute("data-value") === profile.incomeVal);
    if (defaultIncomeBtn) defaultIncomeBtn.classList.add("active");
    
    const defaultBenBtn = Array.from(benButtons).find(b => b.getAttribute("data-value") === "Self");
    if (defaultBenBtn) defaultBenBtn.classList.add("active");

    // Remove pulse highlights
    const fields = ["group-income", "group-dob", "group-beneficiary", "group-fname", "group-lname"];
    fields.forEach(f => {
        const el = document.getElementById(f);
        if (el) el.classList.remove("highlight-border-pulse");
    });
}

// Submit Insurance Form
function submitInsuranceForm() {
    const dob = document.getElementById("input-dob").value;
    const fname = document.getElementById("input-fname").value;
    const lname = document.getElementById("input-lname").value;

    if (!dob || !fname || !lname) {
        addCopilotLog("[WARNING] Attempted form submission with incomplete inputs.", "warning");
        triggerNudge("Missing Information", "Please enter all fields to proceed with your eWealth Plus setup. Click 'Auto-fill' if you are testing the flow.",
            `<button class="nudge-btn nudge-btn-primary" onclick="triggerAiAutocomplete()">Auto-fill Form</button>`
        );
        return;
    }

    addCopilotLog(`[AI] Core validation successful. Digital onboarding policy generated for ${fname} ${lname}. Onboarding complete in 12s!`, "success");
    triggerNudge("Onboarding Complete!", 
        "Congratulations! Your digital policy setup is fully complete. The bank adoption rate has increased for this profile.",
        `<button class="nudge-btn nudge-btn-primary" onclick="switchJourney('investments')">Try Investments next</button>`
    );
    
    logAdminIntervention(personas[currentPersonaId].name, "Insurance", "Form submitted successfully", "Completed eWealth Plus flow digital onboarding");
}

// Form AI Autocomplete Engine
function triggerAiAutocomplete() {
    const profile = personas[currentPersonaId];
    
    // AI starts reasoning
    addCopilotLog("[AI] Triggering adaptive auto-completion routine...", "thought");
    
    const pulse = document.getElementById("copilot-pulse");
    const pulseText = document.getElementById("copilot-status-text");
    pulse.className = "pulse-indicator status-thinking";
    pulseText.textContent = "AI Autocompleting...";

    // 1. Income bracket highlight and autoselect
    setTimeout(() => {
        const groupInc = document.getElementById("group-income");
        if (groupInc) groupInc.classList.add("highlight-border-pulse");
        
        const incButtons = document.querySelectorAll(".income-btn");
        incButtons.forEach(b => b.classList.remove("active"));
        const targetBtn = Array.from(incButtons).find(b => b.getAttribute("data-value") === profile.incomeVal);
        if (targetBtn) targetBtn.classList.add("active");
        
        addCopilotLog(`[AI] Retrieved tax-income statement: Estimated at ${profile.income}. Select value matches: ${profile.incomeVal}`, "info");
    }, 400);

    // 2. DOB auto-fill
    setTimeout(() => {
        const groupDob = document.getElementById("group-dob");
        if (groupDob) groupDob.classList.add("highlight-border-pulse");
        
        const dobInput = document.getElementById("input-dob");
        if (dobInput) {
            dobInput.value = profile.dob;
            onDobInput(dobInput);
        }
        addCopilotLog("[AI] Matching national secure registry: Extracted DOB " + profile.dob, "info");
    }, 1000);

    // 3. Name auto-fill
    setTimeout(() => {
        const groupFname = document.getElementById("group-fname");
        const groupLname = document.getElementById("group-lname");
        if (groupFname) groupFname.classList.add("highlight-border-pulse");
        if (groupLname) groupLname.classList.add("highlight-border-pulse");
        
        document.getElementById("input-fname").value = profile.fname;
        document.getElementById("input-lname").value = profile.lname;
        
        addCopilotLog(`[AI] Fills verified KYC details: Name '${profile.fname} ${profile.lname}' matched.`, "info");
    }, 1600);

    // 4. Verification & Clean-up
    setTimeout(() => {
        // Remove highlights
        const fields = ["group-income", "group-dob", "group-beneficiary", "group-fname", "group-lname"];
        fields.forEach(f => {
            const el = document.getElementById(f);
            if (el) el.classList.remove("highlight-border-pulse");
        });

        addCopilotLog("[AI] Form auto-completion routine finished. Onboarding ready with high confidence.", "success");
        setAiScanning();

        triggerNudge("Form Auto-filled", 
            "The AI Agent successfully pre-populated the forms using verified central KYC links. Review the fields and click 'Proceed'.",
            `<button class="nudge-btn nudge-btn-primary" onclick="submitInsuranceForm()">Submit Policy Form</button>`
        );

        logAdminIntervention(profile.name, "Insurance", "AI Auto-fill triggered", "Autocompleted 5 form inputs instantly");
    }, 2200);
}

// SIP Investment planner calculations
function updateSipCalculation() {
    const monthlyRange = document.getElementById("sip-monthly-range");
    const returnRange = document.getElementById("sip-return-range");
    const periodRange = document.getElementById("sip-period-range");

    if (!monthlyRange) return;

    const monthlyInput = parseFloat(monthlyRange.value);
    const returnRate = parseFloat(returnRange.value);
    const years = parseFloat(periodRange.value);

    // Update Slider text
    document.getElementById("sip-monthly-val").textContent = "₹ " + monthlyInput.toLocaleString("en-IN");
    document.getElementById("sip-return-val").textContent = returnRate + "%";
    document.getElementById("sip-period-val").textContent = years + " Years";

    // SIP compounding calculations
    // Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    const i = (returnRate / 12) / 100;
    const n = years * 12;
    
    const investedAmount = monthlyInput * n;
    const totalValue = monthlyInput * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const estReturns = totalValue - investedAmount;

    // Set UI results
    document.getElementById("sip-invested").textContent = "₹ " + Math.round(investedAmount).toLocaleString("en-IN");
    document.getElementById("sip-returns").textContent = "₹ " + Math.round(estReturns).toLocaleString("en-IN");
    document.getElementById("sip-total").textContent = "₹ " + Math.round(totalValue).toLocaleString("en-IN");

    // Update SVG Circle Ring (radius 50 has circumference of 314.16)
    // We compute return percentage to fill the green ring
    const ring = document.getElementById("sip-chart-ring");
    if (ring) {
        const circumference = 314.16;
        const returnRatio = estReturns / totalValue;
        const offset = circumference - (circumference * returnRatio);
        ring.style.strokeDashoffset = offset;
    }
}

// Adopt product button action
function adoptProduct(productName) {
    addCopilotLog(`[AI] Product adoption request initiated: ${productName.toUpperCase()}. Creating digital auto-debit credentials.`, "thought");
    
    // Simulate setup
    setTimeout(() => {
        addCopilotLog(`[AI] Setup successful. SIP registered successfully with your bank mandate. Auto-adoption completed.`, "success");
        triggerNudge("SIP Adoption Success", 
            `Congratulations! You have adopted the Smart SIP investment plan. The first ₹ 5,000 auto-debit will occur on the 5th of next month.`,
            `<button class="nudge-btn nudge-btn-primary" onclick="switchJourney('payments')">Go to Payments</button>`
        );
        logAdminIntervention(personas[currentPersonaId].name, "Investments", `Adopted SIP Plan`, "Setup auto-debit SIP investment mandate");
    }, 1000);
}

// Payments journeys (UPI & Autopay simulation inside simulated phone)
function startUpiActivation() {
    const modal = document.getElementById("phone-modal");
    modal.classList.remove("hidden");

    const container = document.getElementById("phone-app-content");
    container.innerHTML = `
        <div class="phone-title-center"><i class="fa-solid fa-qrcode"></i> UPI Lite Setup</div>
        <div class="phone-card">
            <h4>Select Bank Account</h4>
            <p>Select your primary bank to link with UPI Lite:</p>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 11px; display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="phone-bank" checked> State Bank of India (*4839)
                </label>
                <label style="font-size: 11px; display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="phone-bank"> SBI Savings A/C (*9231)
                </label>
            </div>
        </div>
        <div class="phone-card">
            <h4>Load Money</h4>
            <p>Add initial balance to your UPI Lite wallet (Max ₹2,000):</p>
            <input type="number" id="upi-load-amt" value="500" style="width: 100%; border: 1px solid var(--border-purple); padding: 6px; font-size: 11px; border-radius: 4px; margin-top: 6px;">
        </div>
        <button class="btn btn-primary btn-sm w-100" style="margin-top: 10px;" onclick="executePhoneUpiLink()">Link & Load Wallet</button>
    `;
    
    addCopilotLog("[AI] UPI setup wizard initialized. Phone screen mock overlay rendered.", "info");
}

function executePhoneUpiLink() {
    const amt = document.getElementById("upi-load-amt").value;
    const container = document.getElementById("phone-app-content");
    
    addCopilotLog(`[AI] Requesting secure SMS binding validation for UPI Lite. Loading amount ₹${amt}...`, "thought");
    
    container.innerHTML = `
        <div class="phone-title-center"><i class="fa-solid fa-spinner fa-spin"></i> Securing SMS...</div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px; text-align: center; padding: 20px;">
            <p style="font-size: 12px; color: var(--text-dark);">Binding your mobile number with State Bank of India network.</p>
            <div style="font-size: 24px; color: var(--primary-purple);"><i class="fa-solid fa-mobile-screen-button"></i> <i class="fa-solid fa-ellipsis fa-fade"></i> <i class="fa-solid fa-server"></i></div>
            <p style="font-size: 10px; color: var(--text-muted);">Please do not close this window.</p>
        </div>
    `;

    setTimeout(() => {
        addCopilotLog("[AI] UPI Lite binding validated. Activating wallet account.", "success");
        
        container.innerHTML = `
            <div class="phone-title-center"><i class="fa-solid fa-circle-check" style="color: var(--success-green);"></i> Activation Success</div>
            <div style="text-align: center; padding: 20px 10px; display: flex; flex-direction: column; gap: 12px;">
                <p style="font-size: 12px; color: var(--text-dark); font-weight: 600;">UPI Lite is now active!</p>
                <div style="background-color: var(--white); border: 1px solid var(--border-purple); padding: 12px; border-radius: 8px; font-size: 11px;">
                    <p style="margin-bottom: 4px;"><strong>Balance:</strong> ₹ ${amt}</p>
                    <p><strong>Status:</strong> Ready for pinless transfers</p>
                </div>
                <p style="font-size: 10px; color: var(--text-muted);">Enjoy seamless transaction below ₹500 instantly.</p>
                <button class="btn btn-secondary btn-sm w-100" onclick="closePhoneSimulation()">Close Screen</button>
            </div>
        `;
        
        // Update original payment activation card state to adopted
        const actionArea = document.getElementById("upi-action-area");
        if (actionArea) {
            actionArea.innerHTML = `<span class="badge badge-green w-100 text-center" style="display:block; padding:10px;"><i class="fa-solid fa-check"></i> UPI Lite Active</span>`;
        }

        triggerNudge("UPI Lite Activated", 
            `Awesome! You have successfully activated UPI Lite with ₹ ${amt}. You are now ready for one-tap payments without PINs.`,
            `<button class="nudge-btn nudge-btn-primary" onclick="switchJourney('mobile')">Go to Voice assistant</button>`
        );

        logAdminIntervention(personas[currentPersonaId].name, "Payments", "Activated UPI Lite wallet", `Loaded ₹${amt} via SMS binding`);
    }, 2000);
}

function startAutopayActivation() {
    const modal = document.getElementById("phone-modal");
    modal.classList.remove("hidden");

    const container = document.getElementById("phone-app-content");
    container.innerHTML = `
        <div class="phone-title-center"><i class="fa-solid fa-repeat"></i> Setup Autopay</div>
        <div class="phone-card">
            <h4>Select Billing Provider</h4>
            <select id="bill-provider" style="width:100%; padding:6px; font-size: 11px; border: 1px solid var(--border-purple); border-radius:4px;">
                <option value="electricity">MSEB Maharashtra Electricity</option>
                <option value="broadband">Jio Broadband Services</option>
                <option value="insurance">SBI Life Monthly Premiums</option>
            </select>
        </div>
        <div class="phone-card">
            <h4>Autopay Maximum Limit</h4>
            <p>Protects your account by capping maximum payment limits:</p>
            <input type="number" id="autopay-limit" value="5000" style="width: 100%; border: 1px solid var(--border-purple); padding: 6px; font-size: 11px; border-radius: 4px; margin-top: 6px;">
        </div>
        <button class="btn btn-primary btn-sm w-100" style="margin-top: 10px;" onclick="executeAutopayLink()">Confirm Autopay Mandate</button>
    `;
    
    addCopilotLog("[AI] Bill Autopay wizard initialized. Mandate form rendered.", "info");
}

function executeAutopayLink() {
    const providerSel = document.getElementById("bill-provider");
    const provider = providerSel.options[providerSel.selectedIndex].text;
    const limit = document.getElementById("autopay-limit").value;
    const container = document.getElementById("phone-app-content");
    
    addCopilotLog(`[AI] Setting up auto-debit mandate with '${provider}'. Limit capped at ₹${limit}.`, "thought");

    container.innerHTML = `
        <div class="phone-title-center"><i class="fa-solid fa-spinner fa-spin"></i> Securing Mandate...</div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px; text-align: center; padding: 20px;">
            <p style="font-size: 12px; color: var(--text-dark);">Registering standing instruction under NACH regulations.</p>
            <div style="font-size: 24px; color: var(--primary-purple);"><i class="fa-solid fa-file-signature"></i> <i class="fa-solid fa-arrow-right fa-fade"></i> <i class="fa-solid fa-shield-halved"></i></div>
        </div>
    `;

    setTimeout(() => {
        addCopilotLog("[AI] Standing instruction approved by Central Payments mandate.", "success");
        
        container.innerHTML = `
            <div class="phone-title-center"><i class="fa-solid fa-circle-check" style="color: var(--success-green);"></i> Mandate Active</div>
            <div style="text-align: center; padding: 20px 10px; display: flex; flex-direction: column; gap: 12px;">
                <p style="font-size: 12px; color: var(--text-dark); font-weight: 600;">Autopay Configured!</p>
                <div style="background-color: var(--white); border: 1px solid var(--border-purple); padding: 12px; border-radius: 8px; font-size: 10px; text-align:left;">
                    <p style="margin-bottom: 4px;"><strong>Biller:</strong> ${provider}</p>
                    <p style="margin-bottom: 4px;"><strong>Limit:</strong> ₹ ${limit}</p>
                    <p><strong>Status:</strong> Active / Verified</p>
                </div>
                <button class="btn btn-secondary btn-sm w-100" onclick="closePhoneSimulation()">Close Screen</button>
            </div>
        `;
        
        // Update original payment activation card state to adopted
        const actionArea = document.getElementById("autopay-action-area");
        if (actionArea) {
            actionArea.innerHTML = `<span class="badge badge-green w-100 text-center" style="display:block; padding:10px;"><i class="fa-solid fa-check"></i> Autopay Active</span>`;
        }

        triggerNudge("Autopay Set Up", 
            `Standing instruction registered with ${provider}. Future bills will be paid automatically below your capped limit of ₹ ${limit}.`,
            `<button class="nudge-btn nudge-btn-primary" onclick="switchJourney('mobile')">Go to Voice assistant</button>`
        );

        logAdminIntervention(personas[currentPersonaId].name, "Payments", "Set up Autopay mandate", `Biller: ${provider}, Limit: ₹${limit}`);
    }, 2000);
}

function closePhoneSimulation() {
    const modal = document.getElementById("phone-modal");
    if (modal) modal.classList.add("hidden");
}

// Voice assistant simulations
function toggleVoiceListening() {
    const mic = document.getElementById("mic-icon");
    const circle = document.querySelector(".assistant-circle");
    const waves = document.getElementById("voice-waves");
    const textStatus = document.getElementById("assistant-status");

    if (!voiceListening) {
        // Start listening
        voiceListening = true;
        circle.classList.add("listening");
        waves.classList.add("active");
        textStatus.textContent = "Listening closely...";
        addCopilotLog("[AI] Listening for microphone voice input channel...", "info");

        // After 2.5s simulate receipt of speech
        setTimeout(() => {
            const promptOptions = [
                "Show my current savings balance",
                "Send ₹1,500 to my mom via UPI",
                "Compare term insurance plans",
                "What is the interest rate of a 1-year Fixed Deposit?"
            ];
            // choose a prompt
            const randPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)];
            executeVoiceTextCommand(randPrompt);
        }, 2500);
    } else {
        // Stop listening manually
        stopListeningState();
    }
}

function stopListeningState() {
    const circle = document.querySelector(".assistant-circle");
    const waves = document.getElementById("voice-waves");
    const textStatus = document.getElementById("assistant-status");

    voiceListening = false;
    if (circle) circle.classList.remove("listening");
    if (waves) waves.classList.remove("active");
    if (textStatus) textStatus.textContent = "Tap the Mic to Speak";
}

function simulateVoiceCommand(cmdText) {
    addCopilotLog(`[SYS] User clicked voice simulation shortcut prompt: "${cmdText}"`, "system");
    executeVoiceTextCommand(cmdText);
}

function executeVoiceTextCommand(text) {
    stopListeningState();
    
    // Add user question to log
    addVoiceMessage(text, "user");
    addCopilotLog(`[AI] Processing voice query: "${text}"`, "thought");

    // Dynamic responses based on command query
    setTimeout(() => {
        let answer = "";
        let actionTriggered = "";

        if (text.toLowerCase().includes("balance")) {
            answer = "Sure, Ananya. I have queried your accounts. Your State Bank of India Savings Account (*4839) balance is ₹ 42,910.45.";
            actionTriggered = "Savings Account balance query";
        } else if (text.toLowerCase().includes("send") || text.toLowerCase().includes("upi")) {
            answer = "I will launch the UPI mobile portal. Let's send ₹1,500 to your mother. Opening the secure authentication panel.";
            actionTriggered = "Initiated UPI Transfer to 'Mom' (₹1,500)";
            // Simulate navigation action
            setTimeout(() => {
                switchJourney("payments");
                startUpiActivation();
            }, 1000);
        } else if (text.toLowerCase().includes("insurance") || text.toLowerCase().includes("wealth")) {
            answer = "Opening the SBI Life eWealth Plus Onboarding module. This is our premium plan with zero entry charges.";
            actionTriggered = "Navigated to Insurance eWealth form";
            setTimeout(() => {
                switchJourney("insurance");
            }, 1000);
        } else if (text.toLowerCase().includes("deposit") || text.toLowerCase().includes("fd")) {
            answer = "The current SBI annual interest rate for a 1-Year Fixed Deposit is 6.80% p.a. for standard accounts and 7.30% p.a. for Senior Citizens.";
            actionTriggered = "FD interest rates query";
        } else {
            answer = "I understand you need help with digital banking. I can navigate to insurance forms, compound SIP calculators, or UPI activation pages. Let me know what you'd like to do!";
            actionTriggered = "General help assistant advice";
        }

        addVoiceMessage(answer, "system");
        addCopilotLog(`[AI] Voice execution result: "${actionTriggered}"`, "success");
        
        logAdminIntervention(personas[currentPersonaId].name, "Mobile Banking", `Voice query: "${text}"`, `Resolved with response: "${actionTriggered}"`);
    }, 1500);
}

function addVoiceMessage(text, sender) {
    const box = document.getElementById("voice-chat-box");
    if (!box) return;

    const msg = document.createElement("div");
    msg.className = `voice-msg ${sender}-msg`;

    const icon = sender === "user" ? "fa-solid fa-user" : "fa-solid fa-robot";
    msg.innerHTML = `
        <div class="msg-avatar"><i class="${icon}"></i></div>
        <div class="msg-text">${text}</div>
    `;

    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

// Chat Box Input at bottom of Co-pilot panel
function sendCopilotChatMessage() {
    const input = document.getElementById("copilot-chat-input");
    const text = input.value.trim();
    if (!text) return;

    addCopilotLog(`[USER] ${text}`, "info");
    input.value = "";

    // Simulated quick reasoning response
    addCopilotLog("[AI] Checking knowledge base for response...", "thought");

    setTimeout(() => {
        let aiReply = "";
        
        if (text.toLowerCase().includes("why self") || text.toLowerCase().includes("self")) {
            aiReply = "Selecting 'Self' establishes that you are the life assured. If you select 'Child', we request legal guardian details and school records.";
        } else if (text.toLowerCase().includes("pan") || text.toLowerCase().includes("kyc")) {
            aiReply = "PAN verification is standard under RBI KYC regulations to prevent tax evasion and verify identity. Our Agentic AI retrieves this automatically to save you time.";
        } else if (text.toLowerCase().includes("rate") || text.toLowerCase().includes("sip")) {
            aiReply = "SIP returns are calculated on average CAGR (Compound Annual Growth Rate). Equities average 12-15% over a 10-year period.";
        } else {
            aiReply = "I can guide you through these forms, check your DOB verification, auto-fill standard fields, or outline details on insurance rates. Ask me about specific fields!";
        }

        addCopilotLog(`[AI] Response: ${aiReply}`, "success");
        
        // Show in nudge area
        triggerNudge("AI Co-Pilot Answer", aiReply, 
            `<button class="nudge-btn nudge-btn-primary" onclick="setAiScanning()">Done</button>`
        );
    }, 1000);
}

// Admin Logs & Dashboard Dynamic updates
function logAdminIntervention(profileName, product, friction, action) {
    const tbody = document.getElementById("admin-logs-tbody");
    if (!tbody) return;

    // Increment active interventions counter in stats
    adminInterventionsCount++;
    const labelCount = document.getElementById("admin-active-interventions");
    if (labelCount) labelCount.textContent = adminInterventionsCount.toLocaleString();

    const time = new Date().toLocaleTimeString();
    
    // Choose product tag styling
    let prodTag = "tag-ins";
    if (product.toLowerCase().includes("pay")) prodTag = "tag-pay";
    else if (product.toLowerCase().includes("inv")) prodTag = "tag-inv";
    else if (product.toLowerCase().includes("mob")) prodTag = "tag-mob";

    // Choose action color
    let actionColor = "blue";
    if (action.toLowerCase().includes("complete") || action.toLowerCase().includes("success")) actionColor = "green";
    else if (action.toLowerCase().includes("warn") || action.toLowerCase().includes("eligibility")) actionColor = "orange";

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="log-time">${time}</td>
        <td><span class="log-profile">${profileName.split(" ")[0]}</span></td>
        <td><span class="badge-tag ${prodTag}">${product}</span></td>
        <td class="log-friction">${friction}</td>
        <td class="log-action"><span class="badge-action ${actionColor}">${action}</span></td>
    `;

    // Insert at top of log table
    tbody.insertBefore(tr, tbody.firstChild);

    // Keep log max size 15 entries
    if (tbody.children.length > 15) {
        tbody.removeChild(tbody.lastChild);
    }
}

function clearAdminLogs() {
    const tbody = document.getElementById("admin-logs-tbody");
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">No recent interventions logged. Try interacting with the simulator fields.</td></tr>`;
    }
    adminInterventionsCount = 0;
    const labelCount = document.getElementById("admin-active-interventions");
    if (labelCount) labelCount.textContent = "0";
}
