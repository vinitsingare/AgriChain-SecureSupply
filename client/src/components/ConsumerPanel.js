import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PriceBreakdown from './PriceBreakdown';

const ConsumerPanel = ({ addNotification }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      addNotification('❌ Error fetching items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseItem = async (itemId, price) => {
    setActionLoading(true);
    try {
      const response = await api.post('/purchase-by-consumer', {
        itemId,
        price: price
      });

      if (response.status === 200) {
        addNotification('✅ Item purchased successfully!', 'success');
        fetchItems(); // Refresh items
      }
    } catch (error) {
      addNotification(`❌ Purchase failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStateName = (state) => {
    const states = {
      'Harvested': 'Harvested',
      'PurchasedByDistributor': 'Purchased by Distributor',
      'ShippedByDistributor': 'Shipped by Distributor',
      'ReceivedByRetailer': 'Received by Retailer',
      'ForSaleByRetailer': 'For Sale by Retailer',
      'PurchasedByConsumer': 'Purchased by Consumer'
    };
    return states[state] || state || 'Unknown';
  };

  const getAvailableItems = () => {
    return items.filter(item => 
      item.state === 'ForSaleByRetailer' || // For Sale by Retailer - can purchase
      item.state === 'ReceivedByRetailer' || // Received by Retailer - waiting for retailer to purchase
      item.state === 'ShippedByDistributor'    // Shipped by Distributor - in transit
    );
  };

  const getPurchasedItems = () => {
    // In MERN, we'll check if the state is PurchasedByConsumer
    return items.filter(item => item.state === 'PurchasedByConsumer');
  };

  if (isLoading) {
    return (
      <div className="role-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  const availableItems = getAvailableItems();
  const purchasedItems = getPurchasedItems();

  return (
    <div className="role-panel">
      <div className="panel-header">
        <h2>🛒 Market Place</h2>
        <p>Browse and buy fresh agricultural products</p>
      </div>

      <div className="actions-section">
        <h3>Available for Purchase</h3>
        <div className="supply-chain-info">
          <p><strong>Supply Chain Status:</strong> Items flow from Farmer → Distributor → Retailer → Consumer. You can purchase items that are "For Sale by Retailer".</p>
        </div>
        <div className="items-grid">
          {availableItems.length === 0 ? (
            <div className="no-items">
              <p>No items available for purchase</p>
            </div>
          ) : (
            availableItems.map(item => (
              <div key={item._id} className="item-card">
                <div className="item-header">
                  <h4>{item.name}</h4>
                  <div className="id-label">
                    <div className="copyable-id">
                      <span className="id-text">{item._id.substring(0, 8)}...{item._id.substring(item._id.length - 4)}</span>
                      <button 
                        className="copy-id-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(item._id);
                          addNotification('Item ID copied to clipboard!', 'success');
                        }}
                        title="Copy Full ID"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                  <span className={`status-badge state-${item.state}`}>
                    {getStateName(item.state)}
                  </span>
                </div>
                <div className="item-details">
                  <p><strong>Origin:</strong> {item.origin}</p>
                  <p><strong>Quality:</strong> {item.quality}</p>
                  <p><strong>Final Price:</strong> ₹{item.retailerPrice}</p>
                  <p><strong>Farmer:</strong> {item.farmer?.name || 'Unknown'}</p>
                  <p><strong>Distributor:</strong> {item.distributor?.name || 'Assigned'}</p>
                  <p><strong>Retailer:</strong> {item.retailer?.name || 'Assigned'}</p>
                </div>
                <div className="item-actions">
                  {(item.state === 'ShippedByDistributor') && (
                    <div className="action-info">
                      <span className="waiting-badge">🚚 In Transit</span>
                      <p className="action-help">This item is being shipped by the distributor to the retailer.</p>
                    </div>
                  )}
                  {(item.state === 'ReceivedByRetailer') && (
                    <div className="action-info">
                      <span className="waiting-badge">🏪 At Retailer</span>
                      <p className="action-help">This item has been received by the retailer but not yet put up for sale.</p>
                    </div>
                  )}
                  {(item.state === 'ForSaleByRetailer') && (
                    <button 
                      className="action-button purchase"
                      onClick={() => purchaseItem(item._id, item.retailerPrice)}
                      disabled={actionLoading}
                    >
                      Purchase Item
                    </button>
                  )}
                </div>
                <PriceBreakdown itemId={item._id} addNotification={addNotification} />
              </div>
            ))
          )}
        </div>
      </div>

      {purchasedItems.length > 0 && (
        <div className="purchased-section">
          <h3>Your Purchased Items</h3>
          <div className="items-grid">
            {purchasedItems.map(item => (
              <div key={item._id} className="item-card purchased">
                <div className="item-header">
                  <h4>{item.name}</h4>
                  <span className={`status-badge state-${item.state}`}>
                    {getStateName(item.state)}
                  </span>
                </div>
                <div className="item-details">
                  <p><strong>Origin:</strong> {item.origin}</p>
                  <p><strong>Quality:</strong> {item.quality}</p>
                  <p><strong>Price Paid:</strong> ₹{item.retailerPrice}</p>
                  <p><strong>Farmer:</strong> {item.farmer?.name || 'Unknown'}</p>
                  <p><strong>Distributor:</strong> {item.distributor?.name || 'Assigned'}</p>
                  <p><strong>Retailer:</strong> {item.retailer?.name || 'Assigned'}</p>
                </div>
                <div className="item-actions">
                  <span className="purchased-badge">✅ Purchased</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerPanel;
