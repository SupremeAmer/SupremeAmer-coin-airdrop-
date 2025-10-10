// ================= CONFIGURATION =================
const CONFIG = {
    APPWRITE_ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    APPWRITE_PROJECT: '6839d9640019316a160d',
    APPWRITE_DB_ID: '6839dcca000190bf99f6',
    APPWRITE_COLLECTION_ID: 'users',
    SUPREMEAMER_RECEIVER_BNB: '0xYourBnbAddressHere',
    
    UPGRADE_FEES: {
        "0.05": "0.002",
        "0.1": "0.009"
    },
    UPGRADE_SPEEDS: {
        "0.05": 0.05,
        "0.1": 0.1
    },
    NORMAL_SPEED: 0.0002,
    UPGRADE_DURATION: 360 * 24 * 3600,
    CLAIM_INTERVAL: 30 * 24 * 3600,
    WITHDRAW_ELIGIBILITY_FEE_BNB: "0.0017",
    WITHDRAW_MIN_SA: 50000,
    WITHDRAW_FEE_PERCENT: 6,
    WITHDRAW_DAYS: [9, 13]
};

// ================= STATE MANAGEMENT =================
let minedCoins = parseFloat(localStorage.getItem('minedCoins') || '0');
let miningActive = false;
let miningInterval = null;
let miningUpgrade = JSON.parse(localStorage.getItem('miningUpgrade') || 'null');

// ================= APPWRITE INITIALIZATION =================
const { Client, Account, Databases, Query } = Appwrite;
const client = new Client()
    .setEndpoint(CONFIG.APPWRITE_ENDPOINT)
    .setProject(CONFIG.APPWRITE_PROJECT);
const account = new Account(client);
const databases = new Databases(client);

// ================= UTILITY FUNCTIONS =================
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = 'notification';
    
    if (type === 'success') {
        notification.classList.add('success');
        notification.querySelector('i').className = 'fas fa-check-circle';
    } else if (type === 'error') {
        notification.classList.add('error');
        notification.querySelector('i').className = 'fas fa-exclamation-circle';
    } else {
        notification.querySelector('i').className = 'fas fa-info-circle';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function formatTime(sec) {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return d > 0
        ? `${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ================= MINING LOGIC =================
function getCurrentSpeed() {
    if (isUpgradeActive()) return miningUpgrade.upgradeSpeed;
    return CONFIG.NORMAL_SPEED;
}

function getUpgradeTimeLeft() {
    if (!isUpgradeActive()) return 0;
    return Math.max((miningUpgrade.startTime + CONFIG.UPGRADE_DURATION) - Math.floor(Date.now() / 1000), 0);
}

function getNextClaimTime() {
    if (!isUpgradeActive()) return 0;
    return miningUpgrade.lastClaim + CONFIG.CLAIM_INTERVAL;
}

function canClaim() {
    return isUpgradeActive() && Math.floor(Date.now() / 1000) >= getNextClaimTime();
}

function isUpgradeActive() {
    return miningUpgrade && 
           miningUpgrade.startTime && 
           miningUpgrade.upgradeSpeed && 
           Date.now() / 1000 < miningUpgrade.startTime + CONFIG.UPGRADE_DURATION;
}

function setMiningUpgrade(speed, bnbFee) {
    miningUpgrade = {
        upgradeSpeed: speed,
        bnbFee: bnbFee,
        startTime: Math.floor(Date.now() / 1000),
        lastClaim: Math.floor(Date.now() / 1000)
    };
    localStorage.setItem('miningUpgrade', JSON.stringify(miningUpgrade));
}

function endUpgrade() {
    miningUpgrade = null;
    localStorage.removeItem('miningUpgrade');
}

function addMinedCoins(amount) {
    minedCoins += amount;
    localStorage.setItem('minedCoins', minedCoins.toString());
}

function resetMinedCoins() {
    minedCoins = 0;
    localStorage.setItem('minedCoins', '0');
}

// ================= UI UPDATES =================
function updateMinedCoinsDisplay() {
    document.getElementById('minedCoins').textContent = `Mined Coins: ${minedCoins.toFixed(4)} SA`;
    
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
        const progress = 100 - (timeLeft / CONFIG.UPGRADE_DURATION * 100);
        progressBar.style.width = `${progress}%`;
    } else {
        const sessionElapsed = parseInt(localStorage.getItem('miningSessionElapsed') || '0');
        const progress = (sessionElapsed / (7 * 3600)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function updateTimerDisplay() {
    if (isUpgradeActive()) {
        let timeLeft = getUpgradeTimeLeft();
        document.getElementById('timer').textContent = timeLeft > 0 ? formatTime(timeLeft) : "00:00:00";
    } else {
        let remaining = 7 * 3600 - (parseInt(localStorage.getItem('miningSessionElapsed') || '0'));
        if (remaining < 0) remaining = 0;
        document.getElementById('timer').textContent = formatTime(remaining);
    }
}

function updateUpgradeInfo() {
    const claimStatus = document.getElementById('claimStatus');
    if (isUpgradeActive()) {
        let nextClaim = getNextClaimTime();
        let canClaimNow = canClaim();
        claimStatus.innerHTML = `Upgrade: <b>${miningUpgrade.upgradeSpeed} SA/sec</b>, ${formatTime(getUpgradeTimeLeft())} left<br>
        Next claim: <b>${new Date(nextClaim * 1000).toLocaleDateString()}</b> ${canClaimNow ? '<span style="color:#00ffb3;">Ready!</span>' : ''}`;
    } else {
        claimStatus.innerHTML = "";
    }
}

// ================= EVENT HANDLERS =================
function toggleProfileDropdown(e) {
    e.stopPropagation();
    const menu = document.getElementById('profileDropdownMenu');
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function closeProfileDropdown() {
    const menu = document.getElementById('profileDropdownMenu');
    if (menu.style.display === "block") menu.style.display = "none";
}

async function handleLogout(e) {
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
}

async function displayUser() {
    try {
        const user = await account.get();
        const res = await databases.listDocuments(
            CONFIG.APPWRITE_DB_ID, 
            CONFIG.APPWRITE_COLLECTION_ID, 
            [Query.equal("userId", user.$id)]
        );
        
        if (res.documents.length > 0) {
            const profile = res.documents[0];
            document.getElementById('dropdownUsername').innerHTML = `<span class="emoji-avatar">🧑</span> ${profile.name}`;
            document.getElementById('dropdownEmail').innerHTML = `<span class="emoji-avatar">✉️</span> ${profile.email}`;
        }
    } catch (err) {
        console.error("Error fetching user:", err);
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light');
    setTheme(!isLight);
}

function setTheme(light) {
    if (light) {
        document.body.classList.add('light');
        localStorage.setItem('theme', 'light');
        document.getElementById('lightToggleBtn').textContent = '🌞';
    } else {
        document.body.classList.remove('light');
        localStorage.setItem('theme', 'dark');
        document.getElementById('lightToggleBtn').textContent = '🌙';
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setTheme(true);
    } else if (savedTheme === 'dark') {
        setTheme(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme(true);
    }
}

function startMining() {
    if (miningActive) return;
    
    miningActive = true;
    let sessionStart = Date.now();
    let sessionElapsed = parseInt(localStorage.getItem('miningSessionElapsed') || '0');
    
    document.getElementById('mineBtn').innerHTML = '<i class="fas fa-cog fa-spin"></i> Mining...';
    
    miningInterval = setInterval(() => {
        let speed = getCurrentSpeed();
        addMinedCoins(speed);
        updateMinedCoinsDisplay();
        updateProgressBar();

        if (!isUpgradeActive()) {
            let elapsed = Math.floor((Date.now() - sessionStart) / 1000) + sessionElapsed;
            if (elapsed >= 7 * 3600) {
                stopMining();
                localStorage.setItem('miningSessionElapsed', '0');
                updateTimerDisplay();
                showNotification("Mining session completed! Start again to continue.", "info");
                return;
            }
            localStorage.setItem('miningSessionElapsed', elapsed);
            document.getElementById('timer').textContent = formatTime(7 * 3600 - elapsed);
        } else {
            document.getElementById('timer').textContent = formatTime(getUpgradeTimeLeft());
        }
    }, 1000);
    
    document.getElementById('mineBtn').disabled = true;
}

function stopMining() {
    if (miningInterval) {
        clearInterval(miningInterval);
        miningActive = false;
        miningInterval = null;
    }
    document.getElementById('mineBtn').disabled = false;
    document.getElementById('mineBtn').innerHTML = '<span id="mineBtnText">Start Mining</span>';
}

function showUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'flex';
}

function hideUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'none';
}

async function upgradeMining(speedKey) {
    hideUpgradeModal();
    
    if (isUpgradeActive()) {
        showNotification("You already have an active upgrade!", "error");
        return;
    }
    
    if (!window.ethereum) {
        showNotification("Please connect a BNB wallet first", "error");
        return;
    }
    
    showLoader();
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddr = await signer.getAddress();
        
        const confirmed = confirm(`Upgrade mining speed to ${CONFIG.UPGRADE_SPEEDS[speedKey]} SA/sec for 360 days?\n\nCost: ${CONFIG.UPGRADE_FEES[speedKey]} BNB\n\nWallet: ${userAddr.substring(0, 6)}...${userAddr.substring(38)}`);
        if (!confirmed) return;
        
        showNotification("Processing upgrade transaction...", "info");
        
        const tx = await signer.sendTransaction({
            to: CONFIG.SUPREMEAMER_RECEIVER_BNB,
            value: ethers.utils.parseEther(CONFIG.UPGRADE_FEES[speedKey])
        });
        
        showNotification("Transaction sent! Waiting for confirmation...", "info");
        await tx.wait();
        
        setMiningUpgrade(CONFIG.UPGRADE_SPEEDS[speedKey], CONFIG.UPGRADE_FEES[speedKey]);
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
}

function isWithdrawDay() {
    const today = new Date().getDate();
    return CONFIG.WITHDRAW_DAYS.includes(today);
}

async function handleWithdraw() {
    const status = document.getElementById('withdrawStatus');
    status.textContent = "";
    
    if (!isWithdrawDay()) {
        status.textContent = `Withdrawals only on ${CONFIG.WITHDRAW_DAYS.join('th and ')}th each month!`;
        status.classList.add('error-message');
        return;
    }
    
    if (minedCoins < CONFIG.WITHDRAW_MIN_SA) {
        status.textContent = `Need at least ${CONFIG.WITHDRAW_MIN_SA} SA to withdraw.`;
        status.classList.add('error-message');
        return;
    }
    
    if (!window.ethereum) {
        status.textContent = "Please connect a BNB wallet first.";
        status.classList.add('error-message');
        return;
    }
    
    showLoader();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddr = await signer.getAddress();
    
    if (localStorage.getItem('withdrawEligible') !== 'true') {
        const confirmed = confirm(`To withdraw, you need to pay a one-time eligibility fee of ${CONFIG.WITHDRAW_ELIGIBILITY_FEE_BNB} BNB.\n\nThis fee helps prevent abuse of the system.\n\nWallet: ${userAddr.substring(0, 6)}...${userAddr.substring(38)}`);
        if (!confirmed) {
            status.textContent = "Withdrawal cancelled";
            status.classList.add('error-message');
            hideLoader();
            return;
        }
        
        try {
            showNotification("Processing eligibility fee payment...", "info");
            const tx = await signer.sendTransaction({
                to: CONFIG.SUPREMEAMER_RECEIVER_BNB,
                value: ethers.utils.parseEther(CONFIG.WITHDRAW_ELIGIBILITY_FEE_BNB)
            });
            
            showNotification("Transaction sent! Waiting for confirmation...", "info");
            await tx.wait();
            
            localStorage.setItem('withdrawEligible', 'true');
            showNotification("Eligibility fee paid successfully!", "success");
        } catch (e) {
            status.textContent = "Fee payment failed. Please try again.";
            status.classList.add('error-message');
            showNotification("Fee payment failed", "error");
            hideLoader();
            return;
        }
    }
    
    const withdrawAmount = minedCoins;
    const feeAmount = withdrawAmount * (CONFIG.WITHDRAW_FEE_PERCENT / 100);
    const sendAmount = withdrawAmount - feeAmount;
    
    const confirmed = confirm(`Confirm withdrawal of ${withdrawAmount.toFixed(2)} SA?\n\nYou will receive: ${sendAmount.toFixed(2)} SA (${CONFIG.WITHDRAW_FEE_PERCENT}% fee)\n\nWallet: ${userAddr.substring(0, 6)}...${userAddr.substring(38)}`);
    if (!confirmed) {
        status.textContent = "Withdrawal cancelled";
        status.classList.add('error-message');
        hideLoader();
        return;
    }
    
    status.textContent = "Processing withdrawal...";
    status.classList.remove('error-message');
    showNotification("Processing withdrawal transaction...", "info");
    
    setTimeout(() => {
        resetMinedCoins();
        updateMinedCoinsDisplay();
        status.textContent = "";
        
        createConfetti();
        showNotification(`Withdrawal successful! ${sendAmount.toFixed(2)} SA sent to your wallet.`, "success");
        
        alert(`Withdrawal completed!\n\nSent: ${sendAmount.toFixed(2)} SA to ${userAddr}\nFee: ${feeAmount.toFixed(2)} SA (${CONFIG.WITHDRAW_FEE_PERCENT}%)\n\nThank you for using SupremeAmer Coin!`);
        hideLoader();
    }, 3000);
}

function handleTimerClick() {
    if (isUpgradeActive() && canClaim()) {
        const now = Math.floor(Date.now() / 1000);
        let seconds = now - miningUpgrade.lastClaim;
        let claimAmount = seconds * miningUpgrade.upgradeSpeed;
        
        addMinedCoins(claimAmount);
        miningUpgrade.lastClaim = now;
        localStorage.setItem('miningUpgrade', JSON.stringify(miningUpgrade));
        
        updateMinedCoinsDisplay();
        updateUpgradeInfo();
        
        createConfetti();
        showNotification(`You claimed ${claimAmount.toFixed(4)} SA!`, "success");
    } else if (isUpgradeActive()) {
        const nextClaim = getNextClaimTime();
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = nextClaim - now;
        
        showNotification(`Next claim available in ${formatTime(timeLeft)}`, "info");
    }
}

// ================= VISUAL EFFECTS =================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 600 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        const colors = ['#ff9800', '#fdc500', '#ff3333', '#4CAF50', '#2196F3'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff9800', '#fdc500', '#ff3333', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        confetti.style.left = `${Math.random() * 100}vw`;
        
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.borderRadius = '0';
        }
        
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const duration = Math.random() * 3 + 2;
        confetti.style.animationDuration = `${duration}s`;
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// ================= EVENT LISTENERS =================
function initializeEventListeners() {
    // Profile dropdown
    document.getElementById('profileDropdownBtn').addEventListener('click', toggleProfileDropdown);
    document.addEventListener('click', closeProfileDropdown);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Theme toggle
    document.getElementById('lightToggleBtn').addEventListener('click', toggleTheme);

    // Mining controls
    document.getElementById('mineBtn').addEventListener('click', startMining);
    document.getElementById('showUpgradeBtn').addEventListener('click', showUpgradeModal);
    document.getElementById('withdrawBtn').addEventListener('click', handleWithdraw);

    // Timer click for claiming
    document.getElementById('timer').addEventListener('click', handleTimerClick);

    // Modal controls
    document.getElementById('closeUpgradeModal').addEventListener('click', hideUpgradeModal);
    document.querySelectorAll('.upgrade-plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            upgradeMining(e.currentTarget.dataset.speed);
        });
    });

    // Footer navigation
    document.querySelectorAll('.footer button[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.location.href = e.currentTarget.dataset.page;
        });
    });

    // Network status
    window.addEventListener('online', () => showNotification('Back online ✅', 'success'));
    window.addEventListener('offline', () => showNotification('You are offline ❌', 'error'));
}

// ================= INITIALIZATION =================
function initialize() {
    initializeTheme();
    createParticles();
    updateMinedCoinsDisplay();
    updateTimerDisplay();
    updateUpgradeInfo();
    updateProgressBar();
    document.getElementById('mineBtn').disabled = false;
    
    if (isUpgradeActive() && getUpgradeTimeLeft() <= 0) {
        endUpgrade();
        showNotification("Your mining upgrade has expired", "info");
    }
    
    setTimeout(() => {
        showNotification("Welcome to SupremeAmer Coin Mining!", "info");
    }, 1000);
    
    displayUser();
    initializeEventListeners();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);