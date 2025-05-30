const express = require('express');
const app = express();
app.use(express.json());

// Example: GET endpoint to serve airdrop info
app.get('/airdrop', (req, res) => {
  res.json({
    status: 'active',
    description: 'Welcome to the SupremeAmer Coin Airdrop!',
    instructions: 'Follow the steps on the homepage to participate.'
  });
});

// Example: POST endpoint to accept airdrop entries
app.post('/airdrop/enter', (req, res) => {
  const { walletAddress, email } = req.body;

  if (!walletAddress || !email) {
    return res.status(400).json({ error: 'walletAddress and email are required.' });
  }

  // Here you would add logic to save the entry, e.g., to a database or Appwrite collection

  res.json({
    success: true,
    message: 'Entry received. Good luck!'
  });
});

// For Appwrite Functions, export the app (or handler) as a module
module.exports = app;
