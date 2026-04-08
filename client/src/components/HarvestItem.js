import React, { useState } from 'react';
import api from '../utils/api';

const HarvestItem = ({ addNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    price: '',
    quantity: '',
    quality: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastHarvestedId, setLastHarvestedId] = useState(null);

  const qualityOptions = [
    'Premium', 'Grade A', 'Grade B', 'Organic', 'Fair Trade', 'Local Grown'
  ];

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const totalPrice = (parseFloat(formData.price) || 0) * (parseFloat(formData.quantity) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submissionData = new FormData();
      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
      });
      if (imageFile) {
        submissionData.append('image', imageFile);
      }

      const response = await api.post('/harvest', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        const newItemId = response.data.item?._id || response.data._id || response.data.id;
        setLastHarvestedId(newItemId);
        addNotification(`🌾 Item harvested successfully!`, 'success');
        // Reset form
        setFormData({
          name: '',
          origin: '',
          price: '',
          quantity: '',
          quality: '',
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      addNotification(`❌ Error: ${error.response?.data?.message || error.response?.data?.error || error.message}`, 'error');
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
              <label htmlFor="price">Price per Kg (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                className="form-input"
                min="1"
                step="0.01"
                required
              />
              <small className="form-help">Set the price per kilogram for the harvested item.</small>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity (Kgs) *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 200"
                className="form-input"
                min="1"
                step="0.1"
                required
              />
              <small className="form-help">Enter the total quantity harvested in kilograms.</small>
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="form-input"
              />
              <small className="form-help">Upload a photo of the product.</small>
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
                <strong>Price/Kg:</strong> {formData.price ? `₹${formData.price}` : 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Quantity:</strong> {formData.quantity ? `${formData.quantity} Kgs` : 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Quality:</strong> {formData.quality || 'Not selected'}
              </div>
              <div className="preview-item" style={{gridColumn: '1 / -1', background: totalPrice > 0 ? '#f0fdf4' : 'transparent', padding: '0.75rem', borderRadius: '8px', border: totalPrice > 0 ? '1px solid #bbf7d0' : 'none'}}>
                <strong>💰 Total Price:</strong>{' '}
                <span style={{fontSize: '1.2rem', fontWeight: '700', color: totalPrice > 0 ? '#059669' : '#94a3b8'}}>
                  {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : 'Enter price & quantity'}
                </span>
                {totalPrice > 0 && (
                  <small style={{display: 'block', marginTop: '0.25rem', color: '#6b7280'}}>
                    (₹{formData.price} × {formData.quantity} Kgs)
                  </small>
                )}
              </div>
              {imagePreview && (
                <div className="preview-image-container" style={{gridColumn: '1 / -1', marginTop: '0.5rem', textAlign: 'center'}}>
                  <strong>Image Preview:</strong>
                  <div style={{marginTop: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center'}}>
                    <img src={imagePreview} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px', objectFit: 'cover'}} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !formData.name || !formData.origin || !formData.price || !formData.quantity || !formData.quality}
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
