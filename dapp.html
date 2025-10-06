<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lucky Spin Wheel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            padding: 20px;
            color: #fff;
        }
        
        .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
        }
        
        h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 30px;
            text-align: center;
            opacity: 0.9;
        }
        
        .game-area {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            width: 100%;
        }
        
        .wheel-container {
            position: relative;
            width: 350px;
            height: 350px;
        }
        
        .wheel {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(
                #ff6b6b 0deg 45deg,
                #4ecdc4 45deg 90deg,
                #45b7d1 90deg 135deg,
                #96ceb4 135deg 180deg,
                #feca57 180deg 225deg,
                #ff9ff3 225deg 270deg,
                #54a0ff 270deg 315deg,
                #5f27cd 315deg 360deg
            );
            position: relative;
            transition: transform 4s cubic-bezier(0.17, 0.67, 0.16, 0.99);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }
        
        .wheel-section {
            position: absolute;
            width: 50%;
            height: 50%;
            transform-origin: bottom right;
            left: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #fff;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .wheel-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: #fff;
            border-radius: 50%;
            z-index: 10;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #333;
        }
        
        .pointer {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 60px;
            background: #ff4757;
            clip-path: polygon(50% 100%, 0 0, 100% 0);
            z-index: 5;
            filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3));
        }
        
        .controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex: 1;
            max-width: 300px;
        }
        
        .btn {
            background: linear-gradient(to bottom, #ff6b6b, #ee5a52);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 0 #c23616;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 0 #c23616;
        }
        
        .btn:active {
            transform: translateY(2px);
            box-shadow: 0 3px 0 #c23616;
        }
        
        .btn-spin {
            background: linear-gradient(to bottom, #ff9f43, #ff7f00);
            box-shadow: 0 5px 0 #cc6600;
        }
        
        .btn-spin:hover {
            box-shadow: 0 8px 0 #cc6600;
        }
        
        .btn-spin:active {
            box-shadow: 0 3px 0 #cc6600;
        }
        
        .btn-reset {
            background: linear-gradient(to bottom, #2ed573, #1dd1a1);
            box-shadow: 0 5px 0 #009432;
        }
        
        .btn-reset:hover {
            box-shadow: 0 8px 0 #009432;
        }
        
        .btn-reset:active {
            box-shadow: 0 3px 0 #009432;
        }
        
        .stats {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 15px;
            padding: 20px;
            width: 100%;
            margin-top: 20px;
        }
        
        .stats h2 {
            text-align: center;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        
        .result {
            margin-top: 20px;
            text-align: center;
            font-size: 1.3rem;
            font-weight: bold;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 15px;
            padding: 15px;
        }
        
        .win-animation {
            animation: winPulse 0.5s infinite alternate;
        }
        
        @keyframes winPulse {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
        }
        
        .history {
            margin-top: 20px;
            width: 100%;
        }
        
        .history h2 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 1.5rem;
        }
        
        .history-list {
            max-height: 150px;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 10px;
        }
        
        .history-item {
            padding: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
        }
        
        .history-item:last-child {
            border-bottom: none;
        }
        
        @media (max-width: 768px) {
            .game-area {
                flex-direction: column;
                align-items: center;
            }
            
            .wheel-container {
                width: 300px;
                height: 300px;
            }
            
            .controls {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Lucky Spin Wheel</h1>
        <p class="subtitle">Spin the wheel and win amazing prizes!</p>
        
        <div class="game-area">
            <div class="wheel-container">
                <div class="pointer"></div>
                <div class="wheel" id="wheel">
                    <!-- Wheel sections will be generated by JavaScript -->
                </div>
                <div class="wheel-center">SPIN</div>
            </div>
            
            <div class="controls">
                <button class="btn btn-spin" id="spinBtn">
                    <i class="fas fa-play"></i> SPIN WHEEL
                </button>
                <button class="btn btn-reset" id="resetBtn">
                    <i class="fas fa-redo"></i> RESET GAME
                </button>
                
                <div class="stats">
                    <h2>Game Stats</h2>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span>Spins:</span>
                            <span id="spinCount">0</span>
                        </div>
                        <div class="stat-item">
                            <span>Points:</span>
                            <span id="points">100</span>
                        </div>
                        <div class="stat-item">
                            <span>Wins:</span>
                            <span id="winCount">0</span>
                        </div>
                        <div class="stat-item">
                            <span>Losses:</span>
                            <span id="lossCount">0</span>
                        </div>
                    </div>
                </div>
                
                <div class="result" id="result">
                    Spin the wheel to play!
                </div>
            </div>
        </div>
        
        <div class="history">
            <h2>Spin History</h2>
            <div class="history-list" id="historyList">
                <!-- History items will be added here -->
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const wheel = document.getElementById('wheel');
            const spinBtn = document.getElementById('spinBtn');
            const resetBtn = document.getElementById('resetBtn');
            const result = document.getElementById('result');
            const spinCount = document.getElementById('spinCount');
            const points = document.getElementById('points');
            const winCount = document.getElementById('winCount');
            const lossCount = document.getElementById('lossCount');
            const historyList = document.getElementById('historyList');
            
            // Wheel sections data
            const sections = [
                { text: "100 Points", value: 100, type: "points" },
                { text: "200 Points", value: 200, type: "points" },
                { text: "Try Again", value: 0, type: "try" },
                { text: "50 Points", value: 50, type: "points" },
                { text: "Lose 50", value: -50, type: "loss" },
                { text: "300 Points", value: 300, type: "points" },
                { text: "Lose 100", value: -100, type: "loss" },
                { text: "500 Points", value: 500, type: "points" }
            ];
            
            // Game state
            let gameState = {
                spins: 0,
                currentPoints: 100,
                wins: 0,
                losses: 0,
                isSpinning: false
            };
            
            // Create wheel sections
            function createWheelSections() {
                wheel.innerHTML = '';
                const anglePerSection = 360 / sections.length;
                
                sections.forEach((section, index) => {
                    const sectionEl = document.createElement('div');
                    sectionEl.className = 'wheel-section';
                    sectionEl.style.transform = `rotate(${index * anglePerSection}deg)`;
                    
                    const textEl = document.createElement('div');
                    textEl.textContent = section.text;
                    textEl.style.transform = `rotate(${anglePerSection/2}deg)`;
                    textEl.style.textAlign = 'center';
                    textEl.style.width = '80px';
                    textEl.style.marginLeft = '30px';
                    
                    sectionEl.appendChild(textEl);
                    wheel.appendChild(sectionEl);
                });
            }
            
            // Spin the wheel
            function spinWheel() {
                if (gameState.isSpinning) return;
                
                // Check if player has enough points to spin
                if (gameState.currentPoints < 10) {
                    result.textContent = "Not enough points to spin!";
                    result.style.color = "#ff6b6b";
                    return;
                }
                
                gameState.isSpinning = true;
                gameState.spins++;
                gameState.currentPoints -= 10; // Cost to spin
                
                // Random rotation between 5 and 10 full rotations plus a random angle
                const spinDegrees = 1800 + Math.floor(Math.random() * 1800);
                const winningIndex = Math.floor(Math.random() * sections.length);
                const anglePerSection = 360 / sections.length;
                const adjustment = (winningIndex * anglePerSection) - (anglePerSection / 2);
                const finalRotation = spinDegrees - adjustment;
                
                // Apply the spin
                wheel.style.transform = `rotate(${finalRotation}deg)`;
                
                // Update UI during spin
                spinBtn.disabled = true;
                result.textContent = "Spinning...";
                result.classList.remove('win-animation');
                
                // After spin completes
                setTimeout(() => {
                    gameState.isSpinning = false;
                    spinBtn.disabled = false;
                    
                    const winningSection = sections[winningIndex];
                    processResult(winningSection);
                    
                    // Update stats
                    updateStats();
                    addToHistory(winningSection);
                }, 4000);
            }
            
            // Process the result of a spin
            function processResult(section) {
                let message = "";
                let color = "#fff";
                
                switch(section.type) {
                    case "points":
                        gameState.currentPoints += section.value;
                        gameState.wins++;
                        message = `Congratulations! You won ${section.value} points!`;
                        color = "#2ed573";
                        result.classList.add('win-animation');
                        break;
                    case "loss":
                        gameState.currentPoints += section.value;
                        gameState.losses++;
                        message = `Oh no! You lost ${Math.abs(section.value)} points!`;
                        color = "#ff6b6b";
                        break;
                    case "try":
                        gameState.losses++;
                        message = "Try again! No points won or lost.";
                        color = "#ffa502";
                        break;
                }
                
                result.textContent = message;
                result.style.color = color;
            }
            
            // Reset the game
            function resetGame() {
                gameState = {
                    spins: 0,
                    currentPoints: 100,
                    wins: 0,
                    losses: 0,
                    isSpinning: false
                };
                
                wheel.style.transform = 'rotate(0deg)';
                result.textContent = "Game reset! Spin the wheel to play!";
                result.style.color = "#fff";
                result.classList.remove('win-animation');
                historyList.innerHTML = '';
                
                updateStats();
            }
            
            // Update game statistics
            function updateStats() {
                spinCount.textContent = gameState.spins;
                points.textContent = gameState.currentPoints;
                winCount.textContent = gameState.wins;
                lossCount.textContent = gameState.losses;
            }
            
            // Add result to history
            function addToHistory(section) {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const date = new Date().toLocaleTimeString();
                historyItem.innerHTML = `
                    <span>${date}</span>
                    <span>${section.text}</span>
                `;
                
                historyList.prepend(historyItem);
            }
            
            // Event listeners
            spinBtn.addEventListener('click', spinWheel);
            resetBtn.addEventListener('click', resetGame);
            
            // Initialize the game
            createWheelSections();
            updateStats();
        });
    </script>
</body>
</html>