# 🌾 AgriChain Supply Chain Flow Guide

## Complete Supply Chain Process

The AgriChain system follows this flow from farm to consumer:

```
🌾 Farmer → 🚚 Distributor → 🏪 Retailer → 🛒 Consumer
```

## Step-by-Step Process

### 1. 👨‍🌾 **Farmer Role**
- **Action**: Harvest items
- **State Change**: Creates items in state 0 (Harvested)
- **What to do**: 
  1. Select "Farmer" role
  2. Choose your account
  3. Fill out harvest form (name, origin, price, quality)
  4. Click "Record Harvest"

### 2. 🚚 **Distributor Role**
- **Action 1**: Purchase items from farmers
- **State Change**: 0 (Harvested) → 2 (Purchased by Distributor)
- **Action 2**: Ship items to retailers
- **State Change**: 2 (Purchased by Distributor) → 3 (Shipped by Distributor)
- **What to do**:
  1. Select "Distributor" role
  2. Choose your account
  3. Purchase available harvested items
  4. Ship the purchased items

### 3. 🏪 **Retailer Role**
- **Action 1**: Receive shipments from distributors
- **State Change**: 3 (Shipped by Distributor) → 4 (Received by Retailer)
- **Action 2**: Purchase items from distributors
- **State Change**: 4 (Received by Retailer) → 5 (For Sale by Retailer)
- **What to do**:
  1. Select "Retailer" role
  2. Choose your account
  3. Receive shipped items
  4. Purchase received items to make them available for consumers

### 4. 🛒 **Consumer Role**
- **Action**: Purchase final products
- **State Change**: 5 (For Sale by Retailer) → 6 (Purchased by Consumer)
- **What to do**:
  1. Select "Consumer" role
  2. Choose your account
  3. Purchase items that are "For Sale by Retailer"

## Item States Reference

| State | Name | Description | Who Can Act |
|-------|------|-------------|-------------|
| 0 | Harvested | Item harvested by farmer | Distributor (purchase) |
| 1 | For Sale by Farmer | *(Not used in current flow)* | - |
| 2 | Purchased by Distributor | Distributor bought from farmer | Distributor (ship) |
| 3 | Shipped by Distributor | Item shipped to retailer | Retailer (receive) |
| 4 | Received by Retailer | Item received by retailer | Retailer (purchase) |
| 5 | For Sale by Retailer | Available for consumers | Consumer (purchase) |
| 6 | Purchased by Consumer | Final purchase complete | - |

## Common Issues & Solutions

### ❌ "No items available for action"
- **Retailer**: Items might be in state 2 (waiting for distributor to ship) or state 4 (need to purchase from distributor)
- **Consumer**: Items might be in state 3-4 (not yet available for sale)

### ❌ "Only distributors" error
- **Solution**: Make sure you're registered as a distributor by selecting the distributor role first

### ❌ "Only farmers can harvest" error
- **Solution**: Make sure you're registered as a farmer by selecting the farmer role first

## Testing the Complete Flow

1. **Start the system**: Use `start-agrichain.bat` or run manually
2. **Farmer**: Harvest an item (e.g., "Organic Tomatoes", "Maharashtra", 1000 wei, "Premium")
3. **Distributor**: Purchase the item, then ship it
4. **Retailer**: Receive the item, then purchase it from distributor
5. **Consumer**: Purchase the final product

## Current Test Data

Based on the current blockchain state:
- **Item 1**: Mango (State 2 - needs distributor to ship)
- **Item 2**: Apple (State 5 - available for consumers!)
- **Item 3**: Test Apple (State 0 - needs distributor to purchase)

## Tips for Testing

1. **Use different accounts** for each role to simulate real supply chain
2. **Follow the complete flow** - don't skip steps
3. **Check item states** using the dashboard or track item feature
4. **Refresh the page** if items don't appear immediately

## API Endpoints

- `POST /addfarmer` - Register farmer
- `POST /adddistributor` - Register distributor  
- `POST /addretailer` - Register retailer
- `POST /harvest` - Harvest item
- `POST /purchase-by-distributor` - Distributor purchase
- `POST /ship-by-distributor` - Distributor shipping
- `POST /receive-by-retailer` - Retailer receiving
- `POST /purchase-by-retailer` - Retailer purchase
- `POST /purchase-by-consumer` - Consumer purchase
- `GET /items` - Get all items
- `GET /item/:id` - Get specific item

