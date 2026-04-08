import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../utils/api';

const PriceBreakdown = ({ itemId, addNotification }) => {
  const [breakdown, setBreakdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (itemId) {
      fetchPriceBreakdown();
    }
  }, [itemId]);

  const fetchPriceBreakdown = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/price-breakdown/${itemId}`);
      setBreakdown(response.data);
    } catch (error) {
      addNotification(`❌ Error fetching price breakdown: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  const calculatePercentage = (margin, basePrice) => {
    if (parseFloat(basePrice) === 0) return '0%';
    return `${Math.round((parseFloat(margin) / parseFloat(basePrice)) * 100)}%`;
  };

  if (isLoading) {
    return (
      <div className="price-breakdown">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading price breakdown...</p>
        </div>
      </div>
    );
  }

  if (!breakdown) {
    return (
      <div className="price-breakdown">
        <p>No price breakdown available</p>
      </div>
    );
  }

  return (
    <div className="price-breakdown">
      <div className="modal-header-info" style={{marginBottom: '2rem', textAlign: 'center'}}>
        <h3 style={{marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b'}}>💰 Price Transparency</h3>
        
        {breakdown.imageUrl && (
          <div className="modal-image-container" style={{maxWidth: '100%', height: '180px', margin: '0 auto 1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', padding: '10px'}}>
            <img 
              src={breakdown.imageUrl.startsWith('http') ? breakdown.imageUrl : `${API_URL}${breakdown.imageUrl}`} 
              alt={breakdown.name} 
              style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} 
            />
          </div>
        )}
        <h4 style={{fontSize: '1.2rem', color: '#334155', margin: '0'}}>Product: {breakdown.name || 'Agri Product'}</h4>
      </div>
      <div className="price-flow">
        <div className="price-step farmer">
          <div className="step-header">
            <span className="step-icon">🌾</span>
            <span className="step-label">Farmer</span>
          </div>
          <div className="step-price">
            <span className="price-label">Base Price:</span>
            <span className="price-value">{formatPrice(breakdown.farmerPrice)}</span>
          </div>
        </div>

        <div className="price-arrow">→</div>

        <div className="price-step distributor">
          <div className="step-header">
            <span className="step-icon">🚚</span>
            <span className="step-label">Distributor</span>
          </div>
          <div className="step-details">
            <div className="margin-info">
              <span className="margin-label">Margin:</span>
              <span className="margin-value">{formatPrice(breakdown.distributorMargin)}</span>
              <span className="margin-percentage">
                ({calculatePercentage(breakdown.distributorMargin, breakdown.farmerPrice)})
              </span>
            </div>
            <div className="step-price">
              <span className="price-label">Price:</span>
              <span className="price-value">{formatPrice(breakdown.distributorPrice)}</span>
            </div>
          </div>
        </div>

        <div className="price-arrow">→</div>

        <div className="price-step retailer">
          <div className="step-header">
            <span className="step-icon">🏪</span>
            <span className="step-label">Retailer</span>
          </div>
          <div className="step-details">
            <div className="margin-info">
              <span className="margin-label">Margin:</span>
              <span className="margin-value">{formatPrice(breakdown.retailerMargin)}</span>
              <span className="margin-percentage">
                ({calculatePercentage(breakdown.retailerMargin, breakdown.distributorPrice)})
              </span>
            </div>
            <div className="step-price">
              <span className="price-label">Final Price:</span>
              <span className="price-value final">{formatPrice(breakdown.retailerPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="price-summary">
        <div className="summary-item">
          <span className="summary-label">Total Margins/Kg:</span>
          <span className="summary-value">{formatPrice(breakdown.totalMargin)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Price Increase:</span>
          <span className="summary-value">
            {calculatePercentage(breakdown.totalMargin, breakdown.farmerPrice)}
          </span>
        </div>
        {breakdown.quantity && (
          <>
            <div className="summary-item">
              <span className="summary-label">Quantity:</span>
              <span className="summary-value">{breakdown.quantity} {breakdown.unit || 'Kgs'}</span>
            </div>
            <div className="summary-item" style={{borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem'}}>
              <span className="summary-label" style={{fontWeight: '700'}}>Total Value:</span>
              <span className="summary-value" style={{fontSize: '1.1rem', color: '#059669', fontWeight: '700'}}>{formatPrice(breakdown.totalPrice)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceBreakdown;

