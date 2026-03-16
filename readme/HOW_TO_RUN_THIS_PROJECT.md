# 🚀 How to Run AgriChain Project

This guide provides quick steps to get the AgriChain supply chain management system running on your local machine.

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Truffle Suite** - Install globally: `npm install -g truffle`
- **Ganache** - Local blockchain for Ethereum development - [Download here](https://trufflesuite.com/ganache/)

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Start Local Blockchain

1. Open **Ganache** application
2. Create a new workspace or use the default Quickstart
3. Note the RPC Server URL (usually `http://127.0.0.1:7545`)
4. Keep Ganache running in the background

### 3. Deploy Smart Contracts

```bash
# Compile contracts
npm run compile

# Deploy to local blockchain
npm run migrate
```

### 4. Start the Application

```bash
# This starts both backend (port 5000) and frontend (port 3000)
npm start
```

### 5. Access the Application

- **Frontend**: Open `http://localhost:3000` in your browser
- **Backend API**: Available at `http://localhost:5000`

## 🔧 Manual Start (Alternative)

If you prefer to run services separately:

```bash
# Terminal 1: Start backend server
npm run start:server

# Terminal 2: Start React frontend
npm run start:client
```

## 🌐 Connect MetaMask (Optional)

For full blockchain interaction:

1. Install [MetaMask browser extension](https://metamask.io/)
2. Connect to Localhost 7545 network
3. Import accounts from Ganache (use private keys)

## 🧪 Testing the Application

1. Open `http://localhost:3000` in your browser
2. Select a role: **Farmer**, **Distributor**, **Retailer**, or **Consumer**
3. Follow the supply chain flow:
   - **Farmer**: Harvest items
   - **Distributor**: Purchase and ship items
   - **Retailer**: Receive and sell items
   - **Consumer**: Purchase final products

## 📚 Additional Resources

- [Detailed README](./readme/README.md) - Complete project documentation
- [Supply Chain Guide](./SUPPLY_CHAIN_GUIDE.md) - Step-by-step workflow
- [Price Tracking Guide](./PRICE_TRACKING_GUIDE.md) - Margin and pricing features

## 🐛 Troubleshooting

### Common Issues:

1. **"Contract not deployed" error**
   - Ensure Ganache is running
   - Run `npm run migrate` again

2. **Port already in use**
   - Kill processes on ports 3000 and 5000
   - Or use different ports in config

3. **MetaMask connection issues**
   - Ensure connected to localhost:7545
   - Check network settings

### Debug Scripts

The project includes various debug scripts in the root directory:
- `start-agrichain.bat` - Windows batch file to start everything
- `auto-setup.js` - Automated setup script
- Various test scripts for different functionalities

## 🎉 You're Ready!

Once running, you can start testing the complete agricultural supply chain from farm to consumer with full blockchain transparency! 🌾🚀

---

**Need help?** Check the detailed guides or open an issue in the repository.
