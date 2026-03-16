import React, { useState } from 'react';
import api from '../utils/api';

const HarvestItem = ({ addNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    price: '',
    quality: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastHarvestedId, setLastHarvestedId] = useState(null);

  const qualityOptions = [
    'Premium', 'Grade A', 'Grade B', 'Organic', 'Fair Trade', 'Local Grown'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/harvest', formData);

      if (response.status === 201) {
        const newItemId = response.data.item?._id || response.data._id || response.data.id;
        setLastHarvestedId(newItemId);
        addNotification(`🌾 Item harvested successfully!`, 'success');
        // Reset form
        setFormData({
          name: '',
          origin: '',
          price: '',
          quality: '',
        });
      }
    } catch (error) {
      addNotification(`❌ Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="harvest-item">
      <div className="page-header">
        <h2>🌾 Harvest New Item</h2>
        <p>Record a new agricultural product in the supply chain</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="harvest-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Organic Tomatoes"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="origin">Origin Location *</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="e.g., Maharashtra, India"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                className="form-input"
                min="1"
                required
              />
              <small className="form-help">Set the base price for the harvested item.</small>
            </div>

            <div className="form-group">
              <label htmlFor="quality">Quality Grade *</label>
              <select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Quality</option>
                {qualityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="harvest-preview">
            <h4>📋 Harvest Preview</h4>
            <div className="preview-grid">
              <div className="preview-item">
                <strong>Product:</strong> {formData.name || 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Origin:</strong> {formData.origin || 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Price:</strong> {formData.price ? `₹${formData.price}` : 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Quality:</strong> {formData.quality || 'Not selected'}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !formData.name || !formData.origin || !formData.price || !formData.quality}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Recording Harvest...
              </>
            ) : (
              <>
                <span>🌾</span>
                Record Harvest
              </>
            )}
          </button>
        </form>

        {lastHarvestedId && (
          <div className="last-harvest-id" style={{marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center'}}>
            <p style={{color: '#064e3b', fontWeight: '700', marginBottom: '0.75rem'}}>✅ Last Harvest Recorded!</p>
            <div className="id-label" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div className="copyable-id" style={{display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #d1fae5', borderRadius: '8px', padding: '0.5rem 1rem', gap: '0.75rem', maxWidth: 'fit-content'}}>
                <span className="id-text" style={{fontFamily: 'monospace', fontSize: '1rem', color: '#065f46'}}>{lastHarvestedId}</span>
                <button 
                  className="copy-id-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(lastHarvestedId);
                    addNotification('Harvest ID copied to clipboard!', 'success');
                  }}
                  style={{background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', transition: 'background-color 0.2s ease'}}
                >
                  📋 Copy ID
                </button>
              </div>
              <small style={{marginTop: '0.5rem', color: '#059669'}}>Use this ID to track your product.</small>
            </div>
          </div>
        )}
        <div className="harvest-info">
          <h4>✅ System Benefits</h4>
          <ul className="info-list">
            <li>Secure record of harvest data</li>
            <li>Transparent supply chain tracking</li>
            <li>Proof of origin and quality</li>
            <li>Verified farmer identity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HarvestItem;
