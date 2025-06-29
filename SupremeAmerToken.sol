// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title SupremeAmerToken
 * @dev BEP20 token for BNB chain with 6% fee, staking, transparent events
 */
contract SupremeAmerToken is ERC20, Ownable, ERC20Burnable {
    uint256 public constant FEE_PERCENTAGE = 6;
    uint256 public constant TOTAL_SUPPLY = 500_000_000_000 * 10**18; // 500B tokens
    address public feeWallet;
    bool public feeEnabled = true;

    // --- Staking ---
    struct StakeInfo {
        uint256 amount;      // Amount staked
        uint256 rewardDebt;  // For reward calculation
        uint256 timestamp;   // Last stake time
    }
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    uint256 public rewardPerTokenStored;
    uint256 public lastRewardTime;
    uint256 public rewardRatePerSecond; // Example: 100*1e18 per day => 100*1e18/86400 per sec

    // --- Events ---
    event FeeWalletChanged(address indexed oldWallet, address indexed newWallet);
    event FeeStatusChanged(bool enabled);
    event FeeTaken(address indexed from, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardRateChanged(uint256 rate);

    constructor(address _feeWallet) ERC20("SupremeAmer Token", "SA") {
        require(_feeWallet != address(0), "Zero fee wallet");
        feeWallet = _feeWallet;
        _mint(msg.sender, TOTAL_SUPPLY);
        rewardRatePerSecond = 0; // Owner can set later
    }

    // --- FEE LOGIC ---
    function setFeeWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "Zero fee wallet");
        emit FeeWalletChanged(feeWallet, _wallet);
        feeWallet = _wallet;
    }
    function setFeeEnabled(bool _enabled) external onlyOwner {
        feeEnabled = _enabled;
        emit FeeStatusChanged(_enabled);
    }

    // Override transfer/transferFrom for fee
    function _transfer(address from, address to, uint256 amount) internal override {
        if (feeEnabled && from != feeWallet && to != feeWallet && from != owner() && to != owner()) {
            uint256 fee = (amount * FEE_PERCENTAGE) / 100;
            super._transfer(from, feeWallet, fee);
            super._transfer(from, to, amount - fee);
            emit FeeTaken(from, fee);
        } else {
            super._transfer(from, to, amount);
        }
    }

    // --- STAKING LOGIC ---
    function setRewardRatePerSecond(uint256 rate) external onlyOwner {
        _updateReward(address(0));
        rewardRatePerSecond = rate;
        emit RewardRateChanged(rate);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Stake>0");
        _updateReward(msg.sender);

        super._transfer(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(stakes[msg.sender].amount >= amount, "Not enough staked");
        _updateReward(msg.sender);

        uint256 reward = stakes[msg.sender].rewardDebt;
        stakes[msg.sender].amount -= amount;
        stakes[msg.sender].rewardDebt = 0;
        totalStaked -= amount;

        super._transfer(address(this), msg.sender, amount + reward);
        emit Unstaked(msg.sender, amount, reward);
    }

    function pendingReward(address user) public view returns (uint256) {
        if (stakes[user].amount == 0) return 0;
        uint256 delta = block.timestamp - stakes[user].timestamp;
        return (stakes[user].amount * rewardRatePerSecond * delta) / 1e18;
    }

    function _updateReward(address user) internal {
        if (user != address(0) && stakes[user].amount > 0) {
            stakes[user].rewardDebt += pendingReward(user);
            stakes[user].timestamp = block.timestamp;
        }
        lastRewardTime = block.timestamp;
    }

    // --- TRANSPARENCY ---
    function circulatingSupply() public view returns (uint256) {
        return TOTAL_SUPPLY - balanceOf(owner());
    }
}