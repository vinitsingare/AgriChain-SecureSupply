import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api, { API_URL } from '../utils/api';

const TrackItem = ({ addNotification }) => {
  const [itemId, setItemId] = useState('');
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stateNames = {
    'Harvested': 'Harvested',
    'PurchasedByDistributor': 'Purchased by Distributor',
    'ShippedByDistributor': 'Shipped by Distributor',
    'ReceivedByRetailer': 'Received by Retailer',
    'ForSaleByRetailer': 'For Sale by Retailer',
    'PurchasedByConsumer': 'Purchased by Consumer'
  };

  const handleTrackItem = async (e) => {
    e.preventDefault();
    if (!itemId) return;

    setIsLoading(true);
    setItem(null);

    try {
      // Find exactly 24 hex characters anywhere in the input string
      const match = itemId.match(/[0-9a-fA-F]{24}/);
      if (!match) {
        addNotification('❌ Invalid Item ID format. Must be 24 characters.', 'error');
        setIsLoading(false);
        return;
      }
      const cleanId = match[0];
      const response = await api.get(`/items/${cleanId}`);
      
      if (response.status === 200) {
        setItem(response.data);
        addNotification(`📦 Item found: ${response.data.name}`, 'success');
      }
    } catch (error) {
      addNotification(`❌ Item not found or error occurred`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatUser = (user) => {
    if (!user) return 'Not yet reached';
    return user.name || 'Anonymous';
  };

  return (
    <div className="track-item modern-page">
      <div className="page-header modern-header">
        <h2 className="modern-title">🔍 Track Your Product</h2>
        <p className="modern-subtitle">Verify the journey and authenticity of your agricultural products</p>
      </div>

      <div className="search-section modern-search">
        <form onSubmit={handleTrackItem} className="search-form modern-form">
          <div className="search-input-group modern-input-group">
            <input
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Enter Item ID (e.g., 65f...)"
              className="search-input modern-input"
              required
            />
            <button 
              type="submit" 
              className={`search-btn modern-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !itemId}
            >
              {isLoading ? (
                <span className="spinner-small modern-spinner"></span>
              ) : (
                <>🔍 Track</>
              )}
            </button>
          </div>
        </form>
      </div>

      {item && (
        <div className="track-result-wrapper modern-details">
          <div className="item-header modern-header">
            <h4 className="modern-product-title">
              <div className="item-title-row">
                <span>📦 {item.name}</span>
                <span className={`status-badge modern-badge state-${item.state}`}>
                  {stateNames[item.state] || 'Unknown State'}
                </span>
              </div>
              <div className="item-id modern-id" style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600', background: 'white', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                ID: {item._id}
              </div>
            </h4>
          </div>

          {item.imageUrl && (
            <div className="track-image-container" style={{marginBottom: '2rem', textAlign: 'center', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', padding: '10px'}}>
              <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}`} alt={item.name} style={{maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px'}} />
            </div>
          )}

          <div className="supply-chain-section modern-supply-section">
            <h4 className="modern-card-title" style={{textAlign: 'center', marginBottom: '2rem'}}>🛤️ Journey History</h4>
            <div className="supply-chain modern-timeline">
              <div className={`chain-step modern-step ${item.state ? 'completed' : ''}`}>
                <div className="step-icon modern-icon">👨‍🌾</div>
                <div className="modern-step-info">
                  <strong className="modern-step-title">Farmer</strong>
                  <span className="modern-step-value">{formatUser(item.farmer)}</span>
                </div>
              </div>

              <div className={`chain-step modern-step ${['PurchasedByDistributor', 'ShippedByDistributor', 'ReceivedByRetailer', 'ForSaleByRetailer', 'PurchasedByConsumer'].includes(item.state) ? 'completed' : 'pending'}`}>
                <div className="step-icon modern-icon" style={{filter: ['PurchasedByDistributor', 'ShippedByDistributor', 'ReceivedByRetailer', 'ForSaleByRetailer', 'PurchasedByConsumer'].includes(item.state) ? 'none' : 'grayscale(1)'}}>🚚</div>
                <div className="modern-step-info">
                  <strong className="modern-step-title">Distributor</strong>
                  <span className="modern-step-value">{formatUser(item.distributor)}</span>
                </div>
              </div>

              <div className={`chain-step modern-step ${['ReceivedByRetailer', 'ForSaleByRetailer', 'PurchasedByConsumer'].includes(item.state) ? 'completed' : 'pending'}`}>
                <div className="step-icon modern-icon" style={{filter: ['ReceivedByRetailer', 'ForSaleByRetailer', 'PurchasedByConsumer'].includes(item.state) ? 'none' : 'grayscale(1)'}}>🏪</div>
                <div className="modern-step-info">
                  <strong className="modern-step-title">Retailer</strong>
                  <span className="modern-step-value">{formatUser(item.retailer)}</span>
                </div>
              </div>

              <div className={`chain-step modern-step ${['PurchasedByConsumer'].includes(item.state) ? 'completed' : 'pending'}`}>
                <div className="step-icon modern-icon" style={{filter: ['PurchasedByConsumer'].includes(item.state) ? 'none' : 'grayscale(1)'}}>👤</div>
                <div className="modern-step-info">
                  <strong className="modern-step-title">Consumer</strong>
                  <span className="modern-step-value">{formatUser(item.consumer)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-qr-row modern-info-qr">
            <div className="detail-card modern-card">
              <h4 className="modern-card-title">🌍 Product Information</h4>
              <div className="detail-list modern-list">
                <div className="detail-item modern-item">
                  <strong className="modern-label">Name:</strong>
                  <span className="modern-value">{item.name}</span>
                </div>
                <div className="detail-item modern-item">
                  <strong className="modern-label">Origin:</strong>
                  <span className="modern-value">{item.origin}</span>
                </div>
                <div className="detail-item modern-item">
                  <strong className="modern-label">Quality:</strong>
                  <span className="quality-badge modern-quality">{item.quality}</span>
                </div>
                <div className="detail-item modern-item">
                  <strong className="modern-label">Quantity:</strong>
                  <span className="modern-value">{item.quantity || 'N/A'} {item.unit || 'Kgs'}</span>
                </div>
                <div className="detail-item modern-item">
                  <strong className="modern-label">Remaining:</strong>
                  <span className="modern-value" style={{color: '#059669', fontWeight: '700'}}>{item.remainingQuantity != null ? item.remainingQuantity : item.quantity || 'N/A'} {item.unit || 'Kgs'}</span>
                </div>
                <div className="detail-item modern-item">
                  <strong className="modern-label">Price/Kg:</strong>
                  <span className="modern-value">₹{item.retailerPrice || item.distributorPrice || item.farmerPrice}</span>
                </div>
                <div className="detail-item modern-item">
                  <strong className="modern-label">Total Value:</strong>
                  <span className="modern-value" style={{fontWeight: '700', color: '#059669'}}>₹{((item.retailerPrice || item.distributorPrice || item.farmerPrice) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="detail-card modern-card qr-card modern-qr">
              <h4 className="modern-card-title">📱 QR Code</h4>
              <div className="qr-section modern-qr-section">
                <QRCodeSVG 
                   value={JSON.stringify({ id: item._id, name: item.name, origin: item.origin })}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#2d5a87"
                  level="M"
                />
                <p className="qr-text modern-qr-text">Scan to verify authenticity</p>
              </div>
            </div>
          </div>

          <div className="verification-badge modern-verification">
            <div className="verification-icon modern-icon">✅</div>
            <div className="verification-text modern-verification-text">
              <strong className="modern-verified-title">AgriChain Verified</strong>
              <p className="modern-verified-desc">This product has been securely tracked through our end-to-end supply chain management system.</p>
            </div>
          </div>
        </div>
      )}

      {!item && !isLoading && (
        <div className="empty-state modern-empty">
          <div className="empty-icon modern-icon">🔍</div>
          <h3 className="modern-empty-title">Ready to Track</h3>
          <p className="modern-empty-desc">Enter an item ID above to view its complete journey from farm to fork.</p>
        </div>
      )}
    </div>
  );
};

export default TrackItem;
