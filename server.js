const express = require('express');
const app = express();
const port = 3000;

let miningStatus = false;
let startTime;

app.use(express.json());

app.post('/start-mining', (req, res) => {
  if (!miningStatus) {
    miningStatus = true;
    startTime = req.body.startTime;
    console.log('Mining started...');
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
  res.send({ miningStatus: miningStatus, startTime: startTime });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
