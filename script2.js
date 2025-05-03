let web3;
let connectedAccount = null;

if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  const savedAddress = localStorage.getItem('connectedAddress');
  if (savedAddress) {
    connectWallet(savedAddress);
  }
}

document.getElementById('connect-wallet').addEventListener('click', async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedAccount = accounts[0];
    localStorage.setItem('connectedAddress', connectedAccount);
    connectWallet(connectedAccount);
  } catch (error) {
    console.error('Error connecting to wallet:', error);
  }
});

async function connectWallet(address) {
  connectedAccount = address;
  document.getElementById('wallet-address').textContent = `Connected Wallet Address: ${address}`;
  const balance = await web3.eth.getBalance(address);
  document.getElementById('balance').textContent = `Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
  document.getElementById('connect-wallet').classList.add('hidden');
  document.getElementById('disconnect-wallet').classList.remove('hidden');
}

document.getElementById('disconnect-wallet').addEventListener('click', () => {
  connectedAccount = null;
  localStorage.removeItem('connectedAddress');
  document.getElementById('wallet-address').textContent = '';
  document.getElementById('balance').textContent = 'Balance:';
  document.getElementById('connect-wallet').classList.remove('hidden');
  document.getElementById('disconnect-wallet').classList.add('hidden');
});

document.getElementById('send-button').addEventListener('click', () => {
  // Implement send functionality
});

document.getElementById('receive-button').addEventListener('click', () => {
  // Implement receive functionality
});

document.getElementById('history-button').addEventListener('click', () => {
  // Implement history functionality
});

let miningInterval = null;
const miningRate = 0.0007; // SA Points per second

document.getElementById('start-mining').addEventListener('click', () => {
  if (!connectedAccount) {
    alert('Connect your wallet to start mining.');
    return;
  }
  miningInterval = setInterval(() => {
    const currentBalance = parseFloat(document.getElementById('balance').textContent.split(' ')[1]);
    const newBalance = currentBalance + miningRate;
    document.getElementById('balance').textContent = `Balance: ${newBalance} SA`;
  }, 1000);
});
