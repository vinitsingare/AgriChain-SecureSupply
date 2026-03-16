# AgriChain System Architecture

## Overview

AgriChain is a decentralized agricultural supply chain management system built on the Ethereum blockchain. It enables transparent tracking of agricultural products from farmers to consumers, ensuring trust and traceability.

## Components

### 1. Smart Contract (Solidity)

- **Location:** `contracts/AgriSupplyChain.sol`
- **Purpose:** Implements the core supply chain logic, including item lifecycle, roles (farmer, distributor, retailer, consumer), and price/margin tracking.
- **Key Features:**
  - Item struct with state and pricing details
  - Role-based access control
  - Events for state changes
  - Functions for harvesting, purchasing, shipping, receiving, and margin setting

### 2. Backend Server (Node.js / Express)

- **Location:** `server/index.js`
- **Purpose:** Acts as an API gateway between the frontend and the blockchain.
- **Responsibilities:**
  - Connects to Ethereum node (Ganache)
  - Loads and interacts with smart contract
  - Provides RESTful API endpoints for supply chain operations
  - Handles user registration and item transactions
  - Manages CORS and JSON parsing

### 3. Frontend Application (React)

- **Location:** `client/src/`
- **Purpose:** User interface for interacting with the supply chain.
- **Features:**
  - Role selection (Farmer, Distributor, Retailer, Consumer)
  - Forms for harvesting, purchasing, shipping, receiving
  - Price breakdown and margin display
  - Real-time updates and blockchain interaction via Web3.js

### 4. Development Tools

- **Truffle:** Smart contract compilation, migration, and testing
- **Ganache:** Local Ethereum blockchain for development and testing
- **MetaMask:** Browser wallet for blockchain account management

## Data Flow

1. User interacts with the frontend UI.
2. Frontend sends requests to backend API.
3. Backend calls smart contract functions on the blockchain.
4. Smart contract updates item states and emits events.
5. Backend returns transaction results to frontend.
6. Frontend updates UI based on blockchain state.

## Deployment Diagram

```
+----------------+       +----------------+       +----------------+
|   Frontend     | <---> |   Backend API  | <---> |  Ethereum Node |
|  (React App)   |       | (Express.js)   |       |  (Ganache)     |
+----------------+       +----------------+       +----------------+
```

## Role-Based Access Control

- **Farmers:** Can harvest items.
- **Distributors:** Can purchase, set margins, and ship items.
- **Retailers:** Can receive, set margins, and sell items.
- **Consumers:** Can purchase final products.

## State Machine for Items

| State                  | Description                      | Allowed Actions                |
|------------------------|--------------------------------|-------------------------------|
| Harvested              | Item created by farmer          | Purchase by distributor       |
| PurchasedByDistributor | Bought by distributor           | Set margin, ship              |
| ShippedByDistributor   | Shipped to retailer             | Receive by retailer           |
| ReceivedByRetailer     | Received by retailer            | Set margin, purchase          |
| ForSaleByRetailer      | Available for consumer purchase | Purchase by consumer          |
| PurchasedByConsumer    | Final purchase complete         | None                         |

## Summary

AgriChain leverages blockchain immutability and transparency to build trust in agricultural supply chains. The modular architecture separates concerns between smart contracts, backend API, and frontend UI, enabling scalability and maintainability.

---
