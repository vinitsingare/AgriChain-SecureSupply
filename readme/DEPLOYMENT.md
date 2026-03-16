# Deployment Guide for AgriChain

This document provides instructions for deploying the AgriChain project to a production environment.

## Prerequisites

- Node.js (v16 or higher)
- Truffle Suite
- Ethereum node or provider (e.g., Infura, Alchemy)
- Hosting platform (e.g., AWS, Heroku, DigitalOcean)
- Domain and SSL certificate (optional but recommended)

## Steps

### 1. Configure Environment

- Set environment variables for production blockchain network (e.g., Ethereum mainnet or testnet)
- Update `truffle-config.js` with production network details
- Secure private keys and sensitive data using environment variables or secret managers

### 2. Compile and Migrate Smart Contracts

```bash
truffle compile
truffle migrate --network <production-network>
```

### 3. Backend Deployment

- Ensure backend server connects to the production Ethereum node
- Install dependencies:

```bash
npm install
```

- Start backend server:

```bash
npm start
```

- Consider using process managers like PM2 for production

### 4. Frontend Deployment

- Build React app:

```bash
cd client
npm run build
```

- Serve static files using a web server (e.g., Nginx, Apache) or deploy to platforms like Netlify, Vercel

### 5. Configure Reverse Proxy and SSL

- Set up reverse proxy to route API requests to backend server
- Enable HTTPS with SSL certificates

### 6. Testing in Production

- Test all user flows on the deployed environment
- Monitor logs and performance

## Additional Tips

- Use CI/CD pipelines for automated deployment
- Backup blockchain data and contract addresses
- Monitor smart contract events for anomalies

## References

- [Truffle Deployment Docs](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations)
- [Ethereum Network Providers](https://infura.io/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---
