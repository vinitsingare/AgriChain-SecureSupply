# API Reference for AgriChain

This document provides detailed information about the backend API endpoints available in the AgriChain project.

## Base URL

```
http://localhost:5000
```

## Endpoints

### User Management

- **POST /addfarmer**

  Register a new farmer.

  **Request Body:**

  ```json
  {
    "account": "0x1234...abcd"
  }
  ```

  **Response:**

  - 200 OK: "Farmer added"
  - 500 Error: Error message

- **POST /adddistributor**

  Register a new distributor.

  **Request Body:**

  ```json
  {
    "account": "0x1234...abcd"
  }
  ```

  **Response:**

  - 200 OK: "Distributor added"
  - 500 Error: Error message

- **POST /addretailer**

  Register a new retailer.

  **Request Body:**

  ```json
  {
    "account": "0x1234...abcd"
  }
  ```

  **Response:**

  - 200 OK: "Retailer added"
  - 500 Error: Error message

- **GET /accounts**

  Get list of blockchain accounts.

  **Response:**

  ```json
  [
    "0x1234...abcd",
    "0x5678...efgh",
    ...
  ]
  ```

### Supply Chain Operations

- **POST /harvest**

  Record a harvested item by a farmer.

  **Request Body:**

  ```json
  {
    "name": "Organic Tomatoes",
    "origin": "Maharashtra",
    "price": 1000,
    "quality": "Premium",
    "account": "0x1234...abcd"
  }
  ```

  **Response:**

  - 200 OK: "Item harvested"
  - 500 Error: Error message

- **POST /purchase-by-distributor**

  Distributor purchases an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0x5678...efgh",
    "price": 1000
  }
  ```

  **Response:**

  - 200 OK: "Item purchased by distributor"
  - 500 Error: Error message

- **POST /set-distributor-margin**

  Set distributor margin for an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0x5678...efgh",
    "margin": 200
  }
  ```

  **Response:**

  - 200 OK: "Distributor margin set successfully"
  - 500 Error: Error message

- **POST /ship-by-distributor**

  Distributor ships an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0x5678...efgh"
  }
  ```

  **Response:**

  - 200 OK: "Item shipped by distributor"
  - 500 Error: Error message

- **POST /receive-by-retailer**

  Retailer receives an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0x9abc...ijkl"
  }
  ```

  **Response:**

  - 200 OK: "Item received by retailer"
  - 500 Error: Error message

- **POST /set-retailer-margin**

  Set retailer margin for an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0x9abc...ijkl",
    "margin": 300
  }
  ```

  **Response:**

  - 200 OK: "Retailer margin set successfully"
  - 500 Error: Error message

- **POST /purchase-by-retailer**

  Retailer purchases an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0x9abc...ijkl",
    "price": 1200
  }
  ```

  **Response:**

  - 200 OK: "Item purchased by retailer"
  - 500 Error: Error message

- **POST /purchase-by-consumer**

  Consumer purchases an item.

  **Request Body:**

  ```json
  {
    "itemId": 1,
    "account": "0xdef0...mnop",
    "price": 1500
  }
  ```

  **Response:**

  - 200 OK: "Item purchased by consumer"
  - 500 Error: Error message

### Data Retrieval

- **GET /items**

  Get all items in the supply chain.

  **Response:**

  ```json
  {
    "totalItems": 3,
    "items": [
      {
        "id": "1",
        "name": "Mango",
        "origin": "India",
        "farmerPrice": "1000",
        "distributorPrice": "1200",
        "retailerPrice": "1500",
        "quality": "Premium",
        "state": "2",
        "farmer": "0x1234...abcd",
        "distributor": "0x5678...efgh",
        "retailer": "0x9abc...ijkl",
        "consumer": "0xdef0...mnop",
        "price": "1500"
      },
      ...
    ]
  }
  ```

- **GET /item/:id**

  Get details of a specific item by ID.

  **Response:**

  ```json
  {
    "id": "1",
    "name": "Mango",
    "origin": "India",
    "farmerPrice": "1000",
    "distributorPrice": "1200",
    "retailerPrice": "1500",
    "quality": "Premium",
    "state": "2",
    "farmer": "0x1234...abcd",
    "distributor": "0x5678...efgh",
    "retailer": "0x9abc...ijkl",
    "consumer": "0xdef0...mnop",
    "distributorMargin": "200",
    "retailerMargin": "300",
    "price": "1500"
  }
  ```

- **GET /price-breakdown/:id**

  Get price breakdown for an item.

  **Response:**

  ```json
  {
    "farmerPrice": "1000",
    "distributorMargin": "200",
    "distributorPrice": "1200",
    "retailerMargin": "300",
    "retailerPrice": "1500",
    "totalMargin": "500"
  }
  ```

## Notes

- All POST requests require JSON bodies.
- All prices and margins are in Wei (smallest Ethereum unit).
- Ensure accounts used are registered for the respective roles.

---
