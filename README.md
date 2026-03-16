# 🌾 AgriChain

[![Solidity](https://img.shields.io/badge/Solidity-0.8.0-blue.svg)](https://soliditylang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Truffle](https://img.shields.io/badge/Truffle-5.11.5-orange.svg)](https://trufflesuite.com/)
[![Web3.js](https://img.shields.io/badge/Web3.js-4.16.0-yellow.svg)](https://web3js.readthedocs.io/)

A blockchain-based agricultural supply chain management system that provides complete transparency and traceability from farm to consumer. Built on Ethereum blockchain with smart contracts, this platform enables farmers, distributors, retailers, and consumers to track agricultural products through the entire supply chain with real-time price transparency and margin tracking.

## ✨ Features

- **🔗 Multi-Role Supply Chain**: Complete workflow from Farmer → Distributor → Retailer → Consumer
- **📊 Item State Tracking**: Real-time tracking of product states through the supply chain
- **💰 Price Transparency**: Complete price breakdown showing margins at each stage
- **🔍 Margin Tracking**: Distributors and retailers can set profit margins with full transparency
- **🌐 Web3 Integration**: Direct blockchain interaction via MetaMask or Web3 providers
- **📱 Responsive UI**: Modern React-based interface for all user roles
- **🔒 Smart Contract Security**: Secure Ethereum smart contracts for immutable record-keeping
- **📡 RESTful API**: Comprehensive backend API for supply chain operations

## 🛠️ Tech Stack

### Blockchain Layer
- **Solidity 0.8.0**: Smart contract development
- **Truffle Suite**: Development framework, testing, and asset pipeline
- **Web3.js 4.16.0**: Ethereum JavaScript API

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18.3.1**: User interface library
- **Axios**: HTTP client for API calls
- **QR Code Generation**: For product tracking

### Development Tools
- **Ganache**: Local blockchain development
- **MetaMask**: Browser extension for blockchain interaction

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Truffle Suite](https://trufflesuite.com/) (`npm install -g truffle`)
- [Ganache](https://trufflesuite.com/ganache/) (local blockchain)
- [MetaMask](https://metamask.io/) (browser extension)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AgriChainProject
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start Ganache**
   - Open Ganache application
   - Create a new workspace or use default settings
   - Note the RPC server (usually `http://127.0.0.1:7545`)

5. **Compile and deploy smart contracts**
   ```bash
   npm run compile
   npm run migrate
   ```

6. **Start the application**
   ```bash
   npm start
   ```

This will start both the backend server (port 5000) and React frontend (port 3000).

## 📖 Usage

### Quick Start
1. Open your browser and navigate to `http://localhost:3000`
2. Connect your MetaMask wallet to the local Ganache network
3. Select a role (Farmer, Distributor, Retailer, or Consumer)
4. Follow the supply chain flow as described below

### Supply Chain Flow

```
🌾 Farmer → 🚚 Distributor → 🏪 Retailer → 🛒 Consumer
```

#### 1. Farmer Role
- Register as a farmer
- Harvest items with details (name, origin, price, quality)
- Items become available for distributors to purchase

#### 2. Distributor Role
- Register as a distributor
- Purchase harvested items from farmers
- Set profit margins on purchased items
- Ship items to retailers

#### 3. Retailer Role
- Register as a retailer
- Receive shipped items from distributors
- Set profit margins on received items
- Purchase items to make them available for consumers

#### 4. Consumer Role
- Browse items available for sale
- View complete price breakdowns and margins
- Purchase final products

For detailed usage instructions, see:
- [Supply Chain Guide](./SUPPLY_CHAIN_GUIDE.md)
- [Price Tracking Guide](./PRICE_TRACKING_GUIDE.md)

## 🔌 API Endpoints

### User Management
- `POST /addfarmer` - Register a farmer
- `POST /adddistributor` - Register a distributor
- `POST /addretailer` - Register a retailer
- `GET /accounts` - Get available blockchain accounts

### Supply Chain Operations
- `POST /harvest` - Record item harvest
- `POST /purchase-by-distributor` - Distributor purchases item
- `POST /set-distributor-margin` - Set distributor margin
- `POST /ship-by-distributor` - Ship item to retailer
- `POST /receive-by-retailer` - Retailer receives item
- `POST /set-retailer-margin` - Set retailer margin
- `POST /purchase-by-retailer` - Retailer purchases from distributor
- `POST /purchase-by-consumer` - Consumer purchases final product

### Data Retrieval
- `GET /items` - Get all items in supply chain
- `GET /item/:id` - Get specific item details
- `GET /price-breakdown/:id` - Get price breakdown for item

## 📁 Project Structure

```
AgriChainProject/
├── contracts/                 # Solidity smart contracts
│   └── AgriSupplyChain.sol
├── migrations/               # Truffle migration scripts
│   └── 1_deploy_contract.js
├── server/                   # Backend Node.js/Express server
│   └── index.js
├── client/                   # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── build/                    # Compiled contracts
├── test-scripts/             # Various testing and debug scripts
├── SUPPLY_CHAIN_GUIDE.md     # Detailed supply chain flow guide
├── PRICE_TRACKING_GUIDE.md   # Price tracking features guide
├── package.json
├── truffle-config.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙏 Acknowledgments

- Built with Truffle Suite for Ethereum development
- Inspired by the need for transparency in agricultural supply chains
- Thanks to the open-source blockchain community

---

**Happy farming! 🌾🚀**
