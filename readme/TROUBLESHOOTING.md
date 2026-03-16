# Troubleshooting Guide for AgriChain

This guide helps resolve common issues encountered while running the AgriChain project.

## Common Issues

### 1. Contract Not Deployed or Not Found

- **Symptom:** Errors like "AgriSupplyChain not deployed for network" or contract address missing.
- **Solution:**
  - Ensure Ganache or your Ethereum node is running.
  - Run `npm run migrate` to deploy contracts.
  - Verify `truffle-config.js` network settings match your blockchain node.

### 2. Port Conflicts

- **Symptom:** Backend or frontend fails to start due to port in use.
- **Solution:**
  - Kill processes using ports 3000 (frontend) or 5000 (backend).
  - Change ports in configuration if needed.

### 3. MetaMask Connection Issues

- **Symptom:** Unable to connect MetaMask to local blockchain.
- **Solution:**
  - Connect MetaMask to `http://127.0.0.1:7545` network.
  - Import Ganache accounts using private keys.
  - Ensure MetaMask network matches Ganache network ID.

### 4. Insufficient Gas or Transaction Failures

- **Symptom:** Transactions fail or revert.
- **Solution:**
  - Increase gas limit in API calls (default is 3,000,000).
  - Check account balances in Ganache.
  - Verify smart contract logic and state.

### 5. CORS Errors

- **Symptom:** Frontend cannot access backend API.
- **Solution:**
  - Ensure backend CORS settings allow `http://localhost:3000`.
  - Restart backend server after changes.

### 6. Data Not Updating or UI Issues

- **Symptom:** UI does not reflect blockchain state changes.
- **Solution:**
  - Refresh the page.
  - Check browser console for errors.
  - Verify backend API responses.

## Debugging Tips

- Use Ganache logs to monitor transactions.
- Check backend server logs for errors.
- Use browser developer tools to inspect network requests.

## Additional Resources

- [Truffle Debugger](https://www.trufflesuite.com/docs/truffle/getting-started/debugging)
- [MetaMask Support](https://metamask.io/faqs.html)

---
