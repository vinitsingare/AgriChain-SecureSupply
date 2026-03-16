# 🌿 TerraFlow: Premium Agri-Supply Chain 🚀

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)

**TerraFlow** is a modern, premium MERN stack application designed to bring complete transparency and traceability to the agricultural supply chain. Built with a stunning **Glassmorphism** design system, it enables a seamless flow of information from the farmer's harvest all the way to the consumer's table.

---

## ✨ Key Features

- **💎 Premium Glassmorphic UI**: A state-of-the-art interface featuring smooth gradients, backdrop blurs, and modern typography (Inter & Poppins).
- **📋 One-Click Traceability**: Integrated "Copy ID" system across all panels to make tracking 24-character product IDs effortless.
- **🛤️ Journey History**: A sleek vertical timeline that visualizes the entire path of a product, including stakeholder details and timestamped transitions.
- **💰 Price Transparency**: Real-time margin tracking and price breakdowns, ensuring consumers know exactly what they are paying for.
- **🔍 QR Code Verification**: Instant authenticity verification using generated QR codes for every product.
- **🤝 Role-Based Access Control**: Tailored dashboards for **Farmers**, **Distributors**, **Retailers**, and **Consumers**.

---

## 🛠️ Tech Stack

- **Frontend**: React.js with Vanilla CSS (Premium Design System)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with Role-based protection
- **Tools**: Context API for state management, Axios for data fetching

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas connection string)

### 2. Configuration
Create a `.env` file in the `server/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 3. Installation
From the root directory, run:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 4. Running the App
Start both the backend and frontend simultaneously:
```bash
npm start
```
The app will be available at `http://localhost:3000`.

---

## 📖 Supply Chain Flow

1.  **🌾 Farmer**: Harvests products with details like origin, price, and quality.
2.  **🚚 Distributor**: Purchases from farmers, sets profit margins, and ships to retailers.
3.  **🏪 Retailer**: Receives shipments, adjusts consumer pricing (margins), and lists for sale.
4.  **🛒 Consumer**: Tracks product history, views price breakdowns, and purchases verified goods.

---

## 📁 Project Structure

```
agrichain-fsd/
├── server/             # Express.js Backend & API
├── client/             # React.js Frontend & Premium Design System
│   └── src/
│       ├── components/ # Role-specific panels & Shared components
│       └── App.css     # Global Glassmorphic branding
├── .env                # Environment variables
└── README.md           # Documentation
```

---

## 🙏 Credits

TerraFlow was built with a focus on visual excellence and supply chain integrity. It aims to empower farmers and inform consumers through modern technology.

**Happy Farming! 🌾✨**
.

## 🙏 Acknowledgments

- Built with Truffle Suite for Ethereum development
- Inspired by the need for transparency in agricultural supply chains
- Thanks to the open-source blockchain community

---

**Happy farming! 🌾🚀**
