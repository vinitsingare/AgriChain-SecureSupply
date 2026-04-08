import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../utils/api';
import PriceBreakdown from './PriceBreakdown';

const RetailerPanel = ({ addNotification }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [marginInputs, setMarginInputs] = useState({});
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

  const processItemByRetailer = async (itemId) => {
    const qty = parseFloat(quantityInputs[itemId]);
    const margin = parseFloat(marginInputs[itemId]);
    const item = items.find(i => i._id === itemId);

    if (!item) return;

    const maxQty = item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity;

    if (isNaN(margin) || margin < 0) {
      addNotification('❌ Please enter a valid margin', 'error');
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      addNotification('❌ Please enter a valid quantity', 'error');
      return;
    }
    if (qty > maxQty) {
      addNotification(`❌ Quantity exceeds limit. Only ${maxQty} ${item.unit || 'Kgs'} available.`, 'error');
      return;
    }

    setActionLoading(true);
    try {
      // 1. Receive item
      await api.post('/receive-by-retailer', { itemId });

      // 2. Set margin on the parent item (required before purchase)
      await api.post('/set-retailer-margin', {
        itemId,
        margin: margin
      });

      // 3. Put specified quantity for sale (splits item)
      await api.post('/purchase-by-retailer', {
        itemId,
        quantity: qty
      });

      addNotification(`✅ Received & Put ${qty} Kgs for sale successfully!`, 'success');
      setQuantityInputs(prev => ({ ...prev, [itemId]: '' }));
      setMarginInputs(prev => ({ ...prev, [itemId]: '' }));
      fetchItems();
    } catch (error) {
      addNotification(`❌ Processing failed: ${error.response?.data?.error || error.response?.data?.message || error.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // For items already received (just in case they got stuck)
  const setMarginAndSell = async (itemId) => {
    const qty = parseFloat(quantityInputs[itemId]);
    const margin = parseFloat(marginInputs[itemId]);
    const item = items.find(i => i._id === itemId);

    if (!item) return;

    const maxQty = item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity;

    if (isNaN(margin) || margin < 0) return addNotification('❌ Invalid margin', 'error');
    if (isNaN(qty) || qty <= 0) return addNotification('❌ Invalid quantity', 'error');
    if (qty > maxQty) return addNotification(`❌ Quantity exceeds limit. Only ${maxQty} ${item.unit || 'Kgs'} available.`, 'error');

    setActionLoading(true);
    try {
      await api.post('/set-retailer-margin', { itemId, margin });
      await api.post('/purchase-by-retailer', { itemId, quantity: qty });
      addNotification(`✅ Put ${qty} Kgs for sale successfully!`, 'success');
      fetchItems();
    } catch (error) {
      addNotification(`❌ Setup failed: ${error.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  }

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
      item.state === 'ShippedByDistributor' ||
      item.state === 'ReceivedByRetailer' ||
      item.state === 'ForSaleByRetailer'
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
        <h2>🏪 Retailer Panel</h2>
        <p>Manage retail inventory and sales</p>
      </div>

      <div className="actions-section">
        <h3>Available Actions</h3>
        <div className="supply-chain-info">
          <p><strong>Supply Chain Flow:</strong> Distributors ship items → Retailers receive → Purchase from distributors (Set Margin) → Sell to consumers</p>
        </div>
        <div className="items-grid">
          {availableItems.length === 0 ? (
            <div className="no-items">
              <p>No items available for your actions</p>
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
                  <p><strong>Distributor Price:</strong> ₹{item.distributorPrice}/Kg</p>
                  <p><strong>Received Quantity:</strong> {item.quantity} {item.unit || 'Kgs'}</p>
                  <p><strong>Available for Sale:</strong> <span style={{color: '#059669', fontWeight: '700'}}>{item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity} {item.unit || 'Kgs'}</span></p>
                  <p><strong>Farmer:</strong> {item.farmer?.name || 'Unknown'}</p>
                  <p><strong>Distributor:</strong> {item.distributor?.name || 'Assigned'}</p>
                </div>
                <div className="item-actions">
                  {(item.state === 'ShippedByDistributor' || item.state === 'ReceivedByRetailer') && (
                    <div className="margin-section">
                      <div className="margin-input-group">
                        <label>1. Set Retail Margin (₹/Kg):</label>
                        <input
                          type="number"
                          placeholder="e.g., 15"
                          value={marginInputs[item._id] || ''}
                          min="0"
                          step="0.01"
                          onChange={(e) => setMarginInputs(prev => ({ 
                            ...prev, 
                            [item._id]: e.target.value 
                          }))}
                        />
                      </div>
                      <div className="margin-input-group" style={{marginTop: '0.75rem'}}>
                        <label>2. Quantity to Put for Sale ({item.unit || 'Kgs'}):</label>
                        <input
                          type="number"
                          placeholder={`Max: ${item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity}`}
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
                          <small style={{color: '#059669', fontWeight: '600'}}>
                            💰 Purchase Cost: ₹{(parseFloat(quantityInputs[item._id]) * (item.distributorPrice || item.farmerPrice)).toFixed(2)}
                          </small>
                          <br/>
                          <small style={{color: '#6b7280'}}>
                            (₹{item.distributorPrice || item.farmerPrice}/Kg × {quantityInputs[item._id]} Kgs)
                          </small>
                        </div>
                      )}
                      {item.state === 'ShippedByDistributor' ? (
                        <button 
                          className="action-button purchase"
                          onClick={() => processItemByRetailer(item._id)}
                          disabled={actionLoading || !marginInputs[item._id] || !quantityInputs[item._id]}
                        >
                          Receive & Put Selected For Sale
                        </button>
                      ) : (
                        <button 
                          className="action-button purchase"
                          onClick={() => setMarginAndSell(item._id)}
                          disabled={actionLoading || !marginInputs[item._id] || !quantityInputs[item._id]}
                        >
                          Put Selected Quantity For Sale
                        </button>
                      )}
                      <button 
                        className="action-button"
                        style={{ marginTop: '0.75rem', width: '100%', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '0.6rem', fontSize: '0.85rem' }}
                        onClick={() => setTransparencyItem(item._id)}
                      >
                        🔍 View Transparency
                      </button>
                    </div>
                  )}
                  {(item.state === 'ForSaleByRetailer') && (
                    <div className="action-info">
                      <span className="for-sale-badge">✅ For Sale</span>
                      <p className="action-help">This item is now available for consumers.</p>
                      <small>Retail Price: ₹{item.retailerPrice}/Kg | Qty: {item.remainingQuantity || item.quantity} {item.unit || 'Kgs'}</small>
                      <br/>
                      <small style={{color: '#059669', fontWeight: '600'}}>Total Value: ₹{((item.retailerPrice || 0) * (item.remainingQuantity || item.quantity)).toFixed(2)}</small>
                      <button 
                        className="action-button"
                        style={{ marginTop: '1rem', width: '100%', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '0.6rem', fontSize: '0.85rem' }}
                        onClick={() => setTransparencyItem(item._id)}
                      >
                        🔍 View Transparency
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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

export default RetailerPanel;
