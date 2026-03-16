import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Dashboard = ({ user, addNotification }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalFarmers: 0,
    recentItems: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/items');
        const { totalItems, items } = response.data;
        
        // Count unique farmers
        const farmers = new Set();
        items.forEach(item => {
            if (item.farmer) farmers.add(item.farmer._id || item.farmer);
        });

        setStats({
          totalItems,
          totalFarmers: farmers.size,
          recentItems: items.slice(0, 5).map(item => ({
            id: item._id,
            name: item.name,
            farmer: item.farmer.name || 'Unknown',
            date: new Date(item.createdAt).toLocaleDateString()
          }))
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Welcome back, {user.name}!</h2>
        <p>AgriChain: Transparency and traceability for the modern agricultural supply chain.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-info">
            <h3>{stats.totalItems}</h3>
            <p>Total Items Harvested</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🌾</div>
          <div className="stat-info">
            <h3>{stats.totalFarmers}</h3>
            <p>Active Farmers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Verified</h3>
            <p>Secure MERN Stack</p>
          </div>
        </div>
      </div>

      <div className="recent-items">
        <h3>Recent Harvest Items</h3>
        <div className="items-list">
          {stats.recentItems.length > 0 ? (
              stats.recentItems.map(item => (
                <div key={item.id} className="item-card">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Farmer: {item.farmer}</p>
                    <span className="item-date">{item.date}</span>
                  </div>
                  <div className="item-status">
                    <div className="id-label" style={{alignItems: 'flex-end', marginBottom: '0.5rem'}}>
                      <div className="copyable-id" style={{margin: 0, padding: '0.25rem 0.5rem'}}>
                        <span className="id-text" style={{fontSize: '0.7rem'}}>{item.id.substring(0, 8)}...</span>
                        <button 
                          className="copy-id-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.id);
                            addNotification('Item ID copied to clipboard!', 'success');
                          }}
                          style={{fontSize: '0.6rem', padding: '0.1rem 0.3rem'}}
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                    <span className="status-badge harvested">Harvested</span>
                  </div>
                </div>
              ))
          ) : (
              <p>No items harvested yet.</p>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h4>Secure & Transparent</h4>
          <p>Every transaction and state change is tracked and recorded for complete accountability.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h4>Digital Tracking</h4>
          <p>Easily track products through the entire supply chain from Farmer to Consumer.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌍</div>
          <h4>Global Network</h4>
          <p>Connecting producers and consumers directly through a transparent marketplace.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
