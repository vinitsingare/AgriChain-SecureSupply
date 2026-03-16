import React, { useState, useEffect } from 'react';
import api from '../utils/api';
// import PriceBreakdown from './PriceBreakdown'; // If you still want to use it, ensure it's updated too

const DistributorPanel = ({ addNotification }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [marginInputs, setMarginInputs] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
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

  fetchItems();
}, []);

  const shipItem = async (itemId) => {
    setActionLoading(true);
    try {
      const response = await api.post('/ship-by-distributor', { itemId });

      if (response.status === 200) {
        addNotification('✅ Item shipped successfully!', 'success');
        fetchItems(); // Refresh items
      }
    } catch (error) {
      addNotification(`❌ Shipping failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const setMargin = async (itemId, margin) => {
    setActionLoading(true);
    try {
      const response = await api.post('/set-distributor-margin', {
        itemId,
        margin: parseFloat(margin)
      });

      if (response.status === 200) {
        addNotification('✅ Margin set successfully!', 'success');
        fetchItems(); // Refresh items
        setMarginInputs(prev => ({ ...prev, [itemId]: '' })); // Clear input
      }
    } catch (error) {
      addNotification(`❌ Failed to set margin: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const purchaseItem = async (itemId, price) => {
    setActionLoading(true);
    try {
      const response = await api.post('/purchase-by-distributor', {
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

  // In MERN, the items are filtered by state and potentially by the logged in distributor
  const getAvailableItems = () => {
    return items.filter(item => 
      (item.state === 'Harvested') || // Harvested - any distributor can purchase
      (item.state === 'PurchasedByDistributor') || // Purchased - can set margin and ship
      (item.state === 'ShippedByDistributor')    // Shipped - view status
    );
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

  return (
    <div className="role-panel">
      <div className="panel-header">
        <h2>🏪 Distributor Panel</h2>
        <p>Manage inventory and distribution</p>
      </div>

      <div className="actions-section">
        <h3>Available Actions</h3>
        <div className="supply-chain-info">
          <p><strong>Supply Chain Flow:</strong> Distributors purchase items from farmers → Set Margin & Ship → Retailers receive → Sell to consumers</p>
        </div>
        <div className="items-grid">
          {availableItems.length === 0 ? (
            <div className="no-items">
              <p>No items available for your actions</p>
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
                  <p><strong>Farmer Price:</strong> ₹{item.farmerPrice}</p>
                  <p><strong>Farmer:</strong> {item.farmer?.name || 'Unknown'}</p>
                  {item.distributor && (
                    <p><strong>Distributor:</strong> {item.distributor?.name || 'Assigned'}</p>
                  )}
                </div>
                <div className="item-actions">
                  {(item.state === 'Harvested') && (
                    <button 
                      className="action-button purchase"
                      onClick={() => purchaseItem(item._id, item.farmerPrice)}
                      disabled={actionLoading}
                    >
                      Purchase from Farmer
                    </button>
                  )}
                  {(item.state === 'PurchasedByDistributor') && (
                    <div className="margin-section">
                      <div className="margin-input-group">
                        <label>Set Your Distributor Margin (₹):</label>
                        <input
                          type="number"
                          placeholder="Enter margin (e.g., 50)"
                          value={marginInputs[item._id] || ''}
                          onChange={(e) => setMarginInputs(prev => ({ 
                            ...prev, 
                            [item._id]: e.target.value 
                          }))}
                        />
                        <button 
                          className="action-button margin"
                          onClick={() => setMargin(item._id, marginInputs[item._id])}
                          disabled={actionLoading || !marginInputs[item._id]}
                        >
                          Set Margin
                        </button>
                      </div>
                      <button 
                        className="action-button ship"
                        onClick={() => shipItem(item._id)}
                        disabled={actionLoading}
                      >
                        Ship Item
                      </button>
                      <div className="price-info">
                        <small>Purchase price: ₹{item.farmerPrice}</small>
                      </div>
                    </div>
                  )}
                  {(item.state === 'ShippedByDistributor') && (
                    <div className="action-info">
                      <span className="shipped-badge">✅ Shipped</span>
                      <p className="action-help">This item has been shipped to retailer.</p>
                      <small>Distributor Price: ₹{item.distributorPrice}</small>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributorPanel;
