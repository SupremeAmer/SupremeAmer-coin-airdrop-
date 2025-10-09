// main.js
// ---- CONFIGURATION ----
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT = '6839d9640019316a160d';
const APPWRITE_DB_ID = '6839dcca000190bf99f6';
const APPWRITE_COLLECTION_ID = 'users';
const SUPREMEAMER_RECEIVER_BNB = '0xYourBnbAddressHere'; // CHANGE TO YOURS

const UPGRADE_FEES = {
    "0.05": "0.002",
    "0.1": "0.009"
};
const UPGRADE_SPEEDS = {
    "0.05": 0.05,
    "0.1": 0.1
};
const NORMAL_SPEED = 0.0002;
const UPGRADE_DURATION = 360 * 24 * 3600;
const CLAIM_INTERVAL = 30 * 24 * 3600;
const WITHDRAW_ELIGIBILITY_FEE_BNB = "0.0017";
const WITHDRAW_MIN_SA = 50000;
const WITHDRAW_FEE_PERCENT = 6;
const WITHDRAW_DAYS = [9, 13];

// Appwrite
const { Client, Account, Databases, Query } = Appwrite;
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT);
const account = new Account(client);
const databases = new Databases(client);

// ---- Network Status ----
window.addEventListener('online', () => showNotification('Back online ✅', 'success'));
window.addEventListener('offline', () => showNotification('You are offline ❌', 'error'));

// ---- Loader Functions ----
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// ---- Notification System ----
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = 'notification';
    
    // Add type class
    if (type === 'success') {
        notification.classList.add('success');
        notification.querySelector('i').className = 'fas fa-check-circle';
    } else if (type === 'error') {
        notification.classList.add('error');
        notification.querySelector('i').className = 'fas fa-exclamation-circle';
    } else {
        notification.querySelector('i').className = 'fas fa-info-circle';
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after duration
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// ---- Profile Dropdown ----
document.getElementById('profileDropdownBtn').onclick = function(e) {
    e.stopPropagation();
    let menu = document.getElementById('profileDropdownMenu');
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
};
document.addEventListener('click', function() {
    let menu = document.getElementById('profileDropdownMenu');
    if (menu.style.display === "block") menu.style.display = "none";
});
document.getElementById('profileDropdownMenu').onclick = function(e) { e.stopPropagation(); };
document.getElementById('logoutBtn').onclick = async function(e) {
    e.preventDefault();
    showLoader();
    try { 
        await account.deleteSession('current'); 
        showNotification("Logged out successfully", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    } catch (err) {
        showNotification("Error logging out", "error");
    } finally {
        hideLoader();
    }
};
async function displayUser() {
    try {
        const user = await account.get();
        const res = await databases.listDocuments(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, [Query.equal("userId", user.$id)]);
        if (res.documents.length > 0) {
            const profile = res.documents[0];
            document.getElementById('dropdownUsername').innerHTML = `<span class="emoji-avatar">🧑</span> ${profile.name}`;
            document.getElementById('dropdownEmail').innerHTML = `<span class="emoji-avatar">✉️</span> ${profile.email}`;
        }
    } catch (err) {
        console.error("Error fetching user:", err);
    }
}

// ---- Light/Dark Toggle ----
function setTheme(light) {
    if(light) {
        document.body.classList.add('light');
        localStorage.setItem('theme','light');
        document.getElementById('lightToggleBtn').textContent='🌞';
    } else {
        document.body.classList.remove('light');
        localStorage.setItem('theme','dark');
        document.getElementById('lightToggleBtn').textContent='🌙';
    }
}
document.getElementById('lightToggleBtn').onclick = function() {
    setTheme(!document.body.classList.contains('light'));
};

// ---- Particles Background ----
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 600 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random color
        const colors = ['#ff9800', '#fdc500', '#ff3333', '#4CAF50', '#2196F3'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ---- Confetti Effect ----
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff9800', '#fdc500', '#ff3333', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position
        confetti.style.left = `${Math.random() * 100}vw`;
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random shape
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.borderRadius = '0';
        }
        
        // Random color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration
        const duration = Math.random() * 3 + 2;
        confetti.style.animationDuration = `${duration}s`;
        
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// ---- Mining State ----
let minedCoins = parseFloat(localStorage.getItem('minedCoins')||'0');
let miningActive = false;
let miningSpeed = NORMAL_SPEED;
let miningUpgrade = JSON.parse(localStorage.getItem('miningUpgrade') || 'null');
let miningUpgradeStart = miningUpgrade?.startTime||0;
let miningUpgradeSpeed = miningUpgrade?.upgradeSpeed||0;
let miningUpgradeLastClaim = miningUpgrade?.lastClaim||0;
let miningTimerInterval = null;

function getCurrentSpeed() {
    if (isUpgradeActive()) return miningUpgrade.upgradeSpeed;
    return NORMAL_SPEED;
}
function getUpgradeTimeLeft() {
    if (!isUpgradeActive()) return 0;
    return Math.max((miningUpgrade.startTime+UPGRADE_DURATION)-Math.floor(Date.now()/1000),0);
}
function getNextClaimTime() {
    if (!isUpgradeActive()) return 0;
    return miningUpgrade.lastClaim+CLAIM_INTERVAL;
}
function canClaim() {
    return isUpgradeActive() && Math.floor(Date.now()/1000)>=getNextClaimTime();
}
function isUpgradeActive() {
    return miningUpgrade && miningUpgrade.startTime && miningUpgrade.upgradeSpeed && Date.now()/1000 < miningUpgrade.startTime+UPGRADE_DURATION;
}
function setMiningUpgrade(speed, bnbFee) {
    miningUpgrade = {
        upgradeSpeed: speed,
        bnbFee: bnbFee,
        startTime: Math.floor(Date.now()/1000),
        lastClaim: Math.floor(Date.now()/1000)
    };
    localStorage.setItem('miningUpgrade', JSON.stringify(miningUpgrade));
    showNotification(`Mining speed upgraded to ${speed} SA/sec!`, "success");
}
function endUpgrade() {
    miningUpgrade = null;
    localStorage.removeItem('miningUpgrade');
    showNotification("Your mining upgrade has expired", "info");
}
function addMinedCoins(amount) {
    minedCoins += amount;
    localStorage.setItem('minedCoins', minedCoins);
}
function updateMinedCoinsDisplay() {
    document.getElementById('minedCoins').textContent = `Mined Coins: ${minedCoins.toFixed(4)} SA`;
    
    // Add animation when coins increase
    const coinsElement = document.getElementById('minedCoins');
    coinsElement.classList.add('bounce');
    setTimeout(() => {
        coinsElement.classList.remove('bounce');
    }, 1000);
}
function updateProgressBar() {
    const progressBar = document.getElementById('miningProgress');
    if (isUpgradeActive()) {
        const timeLeft = getUpgradeTimeLeft();
        const progress = 100 - (timeLeft / UPGRADE_DURATION * 100);
        progressBar.style.width = `${progress}%`;
    } else {
        const sessionElapsed = parseInt(localStorage.getItem('miningSessionElapsed')||'0');
        const progress = (sessionElapsed / (7*3600)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}
function updateTimerDisplay() {
    if (isUpgradeActive()) {
        let timeLeft = getUpgradeTimeLeft();
        document.getElementById('timer').textContent = timeLeft>0?formatTime(timeLeft):"00:00:00";
    } else {
        let remaining = 7*3600-(parseInt(localStorage.getItem('miningSessionElapsed')||'0'));
        if(remaining<0) remaining=0;
        document.getElementById('timer').textContent = formatTime(remaining);
    }
}
function formatTime(sec) {
    const d = Math.floor(sec/86400);
    const h = Math.floor((sec%86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return d > 0
      ? `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function updateUpgradeInfo() {
    const claimStatus = document.getElementById('claimStatus');
    if(isUpgradeActive()){
        let nextClaim = getNextClaimTime();
        let canClaimNow = canClaim();
        claimStatus.innerHTML = `Upgrade: <b>${miningUpgrade.upgradeSpeed} SA/sec</b>, ${formatTime(getUpgradeTimeLeft())} left<br>
        Next claim: <b>${new Date(nextClaim*1000).toLocaleDateString()}</b> ${canClaimNow?'<span style="color:#00ffb3;">Ready!</span>':''}`;
    } else {
        claimStatus.innerHTML = "";
    }
}

// ---- Upgrade Modal ----
function showUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'flex';
}
function hideUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'none';
}
document.getElementById('showUpgradeBtn').onclick = showUpgradeModal;
window.upgradeMining = async function(speedKey){
    hideUpgradeModal();
    if(isUpgradeActive()){ 
        showNotification("You already have an active upgrade!", "error");
        return; 
    }
    if(!window.ethereum) {
        showNotification("Please connect a BNB wallet first", "error");
        return;
    }
    
    showLoader();
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddr = await signer.getAddress();
        
        // Show confirmation with more details
        const confirmed = confirm(`Upgrade mining speed to ${UPGRADE_SPEEDS[speedKey]} SA/sec for 360 days?\n\nCost: ${UPGRADE_FEES[speedKey]} BNB\n\nWallet: ${userAddr.substring(0,6)}...${userAddr.substring(38)}`);
        if(!confirmed) return;
        
        showNotification("Processing upgrade transaction...", "info");
        
        const tx = await signer.sendTransaction({
            to: SUPREMEAMER_RECEIVER_BNB,
            value: ethers.utils.parseEther(UPGRADE_FEES[speedKey])
        });
        
        showNotification("Transaction sent! Waiting for confirmation...", "info");
        await tx.wait();
        
        setMiningUpgrade(UPGRADE_SPEEDS[speedKey], UPGRADE_FEES[speedKey]);
        updateUpgradeInfo();
        updateMinedCoinsDisplay();
        createConfetti();
        
        showNotification("Upgrade successful! Mining speed increased.", "success");
    } catch (e) {
        console.error("Upgrade error:", e);
        showNotification("Upgrade cancelled or failed", "error");
    } finally {
        hideLoader();
    }
};

// ---- Mining Logic ----
document.getElementById('mineBtn').onclick = function() {
    if (miningActive) { return; }
    miningActive = true;
    let sessionStart = Date.now();
    let sessionElapsed = parseInt(localStorage.getItem('miningSessionElapsed')||'0');
    
    // Start mining animation
    document.getElementById('mineBtn').innerHTML = '<i class="fas fa-cog fa-spin" style="margin-right: 8px;"></i> Mining...';
    
    let sessionInterval = setInterval(function(){
        let speed = getCurrentSpeed();
        minedCoins += speed;
        localStorage.setItem('minedCoins', minedCoins);
        updateMinedCoinsDisplay();
        updateProgressBar();

        if(!isUpgradeActive()){
            let elapsed = Math.floor((Date.now()-sessionStart)/1000)+sessionElapsed;
            if(elapsed>=7*3600){
                miningActive = false;
                clearInterval(sessionInterval);
                localStorage.setItem('miningSessionElapsed','0');
                document.getElementById('mineBtn').disabled = false;
                document.getElementById('mineBtn').innerHTML = '<span id="mineBtnText">Start Mining</span>';
                updateTimerDisplay();
                showNotification("Mining session completed! Start again to continue.", "info");
                return;
            }
            localStorage.setItem('miningSessionElapsed',elapsed);
            document.getElementById('timer').textContent = formatTime(7*3600-elapsed);
        } else {
            document.getElementById('timer').textContent = formatTime(getUpgradeTimeLeft());
        }
    }, 1000);
    
    document.getElementById('mineBtn').disabled = true;
};

// ---- Withdraw Logic ----
function isWithdrawDay() {
    const today = new Date().getDate();
    return WITHDRAW_DAYS.includes(today);
}

document.getElementById('withdrawBtn').onclick = async function() {
    const status = document.getElementById('withdrawStatus');
    status.textContent = "";
    
    // Check withdrawal day
    if (!isWithdrawDay()) {
        status.textContent = `Withdrawals only on ${WITHDRAW_DAYS.join('th and ')}th each month!`;
        status.classList.add('error-message');
        return;
    }
    
    // Check minimum balance
    if (minedCoins < WITHDRAW_MIN_SA) {
        status.textContent = `Need at least ${WITHDRAW_MIN_SA} SA to withdraw.`;
        status.classList.add('error-message');
        return;
    }
    
    // Check wallet connection
    if(!window.ethereum) {
        status.textContent = "Please connect a BNB wallet first.";
        status.classList.add('error-message');
        return;
    }
    
    showLoader();
    // Get connected wallet address
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddr = await signer.getAddress();
    
    // Eligibility fee
    if (localStorage.getItem('withdrawEligible')!=='true') {
        const confirmed = confirm(`To withdraw, you need to pay a one-time eligibility fee of ${WITHDRAW_ELIGIBILITY_FEE_BNB} BNB.\n\nThis fee helps prevent abuse of the system.\n\nWallet: ${userAddr.substring(0,6)}...${userAddr.substring(38)}`);
        if (!confirmed) {
            status.textContent = "Withdrawal cancelled";
            status.classList.add('error-message');
            hideLoader();
            return;
        }
        
        try {
            showNotification("Processing eligibility fee payment...", "info");
            const tx = await signer.sendTransaction({
                to: SUPREMEAMER_RECEIVER_BNB,
                value: ethers.utils.parseEther(WITHDRAW_ELIGIBILITY_FEE_BNB)
            });
            
            showNotification("Transaction sent! Waiting for confirmation...", "info");
            await tx.wait();
            
            localStorage.setItem('withdrawEligible','true');
            showNotification("Eligibility fee paid successfully!", "success");
        } catch(e) {
            status.textContent = "Fee payment failed. Please try again.";
            status.classList.add('error-message');
            showNotification("Fee payment failed", "error");
            hideLoader();
            return;
        }
    }
    
    // Confirm withdrawal
    const withdrawAmount = minedCoins;
    const feeAmount = withdrawAmount * (WITHDRAW_FEE_PERCENT/100);
    const sendAmount = withdrawAmount - feeAmount;
    
    const confirmed = confirm(`Confirm withdrawal of ${withdrawAmount.toFixed(2)} SA?\n\nYou will receive: ${sendAmount.toFixed(2)} SA (${WITHDRAW_FEE_PERCENT}% fee)\n\nWallet: ${userAddr.substring(0,6)}...${userAddr.substring(38)}`);
    if (!confirmed) {
        status.textContent = "Withdrawal cancelled";
        status.classList.add('error-message');
        hideLoader();
        return;
    }
    
    status.textContent = "Processing withdrawal...";
    status.classList.remove('error-message');
    showNotification("Processing withdrawal transaction...", "info");
    
    // Simulate withdrawal processing
    setTimeout(() => {
        minedCoins = 0;
        localStorage.setItem('minedCoins', minedCoins);
        updateMinedCoinsDisplay();
        status.textContent = "";
        
        createConfetti();
        showNotification(`Withdrawal successful! ${sendAmount.toFixed(2)} SA sent to your wallet.`, "success");
        
        alert(`Withdrawal completed!\n\nSent: ${sendAmount.toFixed(2)} SA to ${userAddr}\nFee: ${feeAmount.toFixed(2)} SA (${WITHDRAW_FEE_PERCENT}%)\n\nThank you for using SupremeAmer Coin!`);
        hideLoader();
    }, 3000);
};

// --- Claim logic (click timer to claim if ready) ---
document.getElementById('timer').onclick = function() {
    if(isUpgradeActive() && canClaim()) {
        // Calculate claimable
        const now = Math.floor(Date.now()/1000);
        let seconds = now - miningUpgrade.lastClaim;
        let claimAmount = seconds * miningUpgrade.upgradeSpeed;
        
        minedCoins += claimAmount;
        miningUpgrade.lastClaim = now;
        localStorage.setItem('minedCoins', minedCoins);
        localStorage.setItem('miningUpgrade', JSON.stringify(miningUpgrade));
        
        updateMinedCoinsDisplay();
        updateUpgradeInfo();
        
        createConfetti();
        showNotification(`You claimed ${claimAmount.toFixed(4)} SA!`, "success");
    } else if (isUpgradeActive()) {
        const nextClaim = getNextClaimTime();
        const now = Math.floor(Date.now()/1000);
        const timeLeft = nextClaim - now;
        
        showNotification(`Next claim available in ${formatTime(timeLeft)}`, "info");
    }
};

// --- On load ---
window.onload = function() {
    // Set initial theme based on user preference or system preference
    if (localStorage.getItem('theme') === 'light') {
        setTheme(true);
    } else if (localStorage.getItem('theme') === 'dark') {
        setTheme(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme(true);
    }
    
    createParticles();
    updateMinedCoinsDisplay();
    updateTimerDisplay();
    updateUpgradeInfo();
    updateProgressBar();
    document.getElementById('mineBtn').disabled = false;
    
    // Check if upgrade expired
    if (isUpgradeActive() && getUpgradeTimeLeft() <= 0) {
        endUpgrade();
    }
    
    // Show welcome message
    setTimeout(() => {
        showNotification("Welcome to SupremeAmer Coin Mining!", "info");
    }, 1000);
    
    displayUser();
};