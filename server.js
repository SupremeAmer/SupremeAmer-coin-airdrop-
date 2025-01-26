const express = require('express');
const app = express();
const port = 3000;

let miningStatus = false;
let startTime;
let supremeAmerCoins = 0;

app.use(express.json());

app.post('/start-mining', (req, res) => {
  if (!miningStatus) {
    miningStatus = true;
    startTime = new Date().getTime();
    console.log('Mining started...');
    mineSupremeAmerCoins();
    res.send('Mining started...');
  } else {
    res.send('Mining already in progress...');
  }
});

app.post('/stop-mining', (req, res) => {
  if (miningStatus) {
    miningStatus = false;
    console.log('Mining stopped...');
    res.send('Mining stopped...');
  } else {
    res.send('Mining not in progress...');
  }
});

app.get('/get-mining-status', (req, res) => {
  res.send({ 
    miningStatus: miningStatus, 
    supremeAmerCoins: supremeAmerCoins 
  });
});

function mineSupremeAmerCoins() {
  setInterval(() => {
    if (miningStatus) {
      supremeAmerCoins += 0.0002;
      console.log(`Mined 0.0002 SupremeAmer Coins. Total: ${supremeAmerCoins.toFixed(4)}`);
    }
  }, 1000);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
