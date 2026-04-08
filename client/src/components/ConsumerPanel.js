import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../utils/api';
import PriceBreakdown from './PriceBreakdown';

const ConsumerPanel = ({ addNotification }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState({});
  const [transparencyItem, setTransparencyItem] = useState(null);

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

  const purchaseItem = async (itemId, fullQty) => {
    const qty = quantityInputs[itemId] ? parseFloat(quantityInputs[itemId]) : fullQty;
    const item = items.find(i => i._id === itemId);
    
    if (!item) return;

    const maxQty = item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity;

    if (!qty || qty <= 0) {
      addNotification('❌ Please enter a valid quantity', 'error');
      return;
    }
    if (qty > maxQty) {
      addNotification(`❌ Quantity exceeds limit. Only ${maxQty} ${item.unit || 'Kgs'} available.`, 'error');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/purchase-by-consumer', {
        itemId,
        quantity: qty
      });

      if (response.status === 200) {
        addNotification(`✅ Purchased ${qty} Kgs successfully!`, 'success');
        setQuantityInputs(prev => ({ ...prev, [itemId]: '' }));
        fetchItems();
      }
    } catch (error) {
      addNotification(`❌ Purchase failed: ${error.response?.data?.error || error.response?.data?.message || error.message}`, 'error');
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
      item.state === 'ForSaleByRetailer' ||
      item.state === 'ReceivedByRetailer' ||
      item.state === 'ShippedByDistributor'
    );
  };

  const getPurchasedItems = () => {
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
                {item.imageUrl && (
                  <div className="item-card-image">
                    <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}`} alt={item.name} />
                  </div>
                )}
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
                  <p><strong>Price/Kg:</strong> ₹{item.retailerPrice || item.distributorPrice || item.farmerPrice}</p>
                  <p><strong>Total Put for Sale:</strong> {item.quantity} {item.unit || 'Kgs'}</p>
                  <p><strong>Available to Buy:</strong> <span style={{color: '#059669', fontWeight: '700'}}>{item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity} {item.unit || 'Kgs'}</span></p>
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
                    <div className="margin-section">
                      <div className="price-info" style={{marginBottom: '0.75rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                        <small style={{color: '#1d4ed8', fontWeight: '600'}}>
                          📦 Available: {item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity} {item.unit || 'Kgs'}
                        </small>
                        <br/>
                        <small style={{color: '#6b7280'}}>
                          Price: ₹{item.retailerPrice}/Kg
                        </small>
                      </div>
                      <div className="margin-input-group">
                        <label>Select Quantity ({item.unit || 'Kgs'}):</label>
                        <input
                          type="number"
                          placeholder={`Max: ${item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity} (leave empty for all)`}
                          value={quantityInputs[item._id] || ''}
                          min="0.1"
                          max={item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity}
                          step="0.1"
                          onChange={(e) => setQuantityInputs(prev => ({ 
                            ...prev, 
                            [item._id]: e.target.value 
                          }))}
                        />
                      </div>
                      {quantityInputs[item._id] && parseFloat(quantityInputs[item._id]) > 0 && (
                        <div className="price-info" style={{marginTop: '0.5rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
                          <small style={{color: '#059669', fontWeight: '600', fontSize: '1rem'}}>
                            💰 Total: ₹{(parseFloat(quantityInputs[item._id]) * item.retailerPrice).toFixed(2)}
                          </small>
                          <br/>
                          <small style={{color: '#6b7280'}}>
                            (₹{item.retailerPrice}/Kg × {quantityInputs[item._id]} Kgs)
                          </small>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button 
                          className="action-button purchase"
                          style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                          onClick={() => purchaseItem(item._id, item.remainingQuantity || item.quantity)}
                          disabled={actionLoading}
                        >
                          🛒 Purchase
                        </button>
                        <button 
                          className="action-button"
                          style={{ flex: 1, backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '0.6rem', fontSize: '0.85rem' }}
                          onClick={() => setTransparencyItem(item._id)}
                        >
                          🔍 Transparency
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                {item.imageUrl && (
                  <div className="item-card-image" style={{height: '140px'}}>
                    <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}`} alt={item.name} />
                  </div>
                )}
                <div className="item-header">
                  <h4>{item.name}</h4>
                  <span className={`status-badge state-${item.state}`}>
                    {getStateName(item.state)}
                  </span>
                </div>
                <div className="item-details">
                  <p><strong>Origin:</strong> {item.origin}</p>
                  <p><strong>Quality:</strong> {item.quality}</p>
                  <p><strong>Price/Kg:</strong> ₹{item.retailerPrice}</p>
                  <p><strong>Quantity:</strong> {item.quantity} {item.unit || 'Kgs'}</p>
                  <p><strong>Total Paid:</strong> <span style={{color: '#059669', fontWeight: '700'}}>₹{((item.retailerPrice || 0) * (item.quantity || 0)).toFixed(2)}</span></p>
                  <p><strong>Farmer:</strong> {item.farmer?.name || 'Unknown'}</p>
                  <p><strong>Distributor:</strong> {item.distributor?.name || 'Assigned'}</p>
                  <p><strong>Retailer:</strong> {item.retailer?.name || 'Assigned'}</p>
                </div>
                <div className="item-actions">
                  <span className="purchased-badge">✅ Purchased</span>
                  <button 
                    className="action-button"
                    style={{ marginTop: '1rem', width: '100%', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '0.6rem', fontSize: '0.85rem' }}
                    onClick={() => setTransparencyItem(item._id)}
                  >
                    🔍 View Supply Chain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {transparencyItem && (
        <div className="modal-overlay" onClick={() => setTransparencyItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTransparencyItem(null)}>✖</button>
            <PriceBreakdown itemId={transparencyItem} addNotification={addNotification} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerPanel;
