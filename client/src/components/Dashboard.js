import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Dashboard = ({ user, addNotification }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalFarmers: 0,
    recentItems: []
  });
  const [allItems, setAllItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);

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

        const formattedItems = items.map(item => ({
          id: item._id,
          name: item.name,
          farmer: item.farmer?.name || 'Unknown',
          date: new Date(item.createdAt).toLocaleDateString(),
          state: item.state
        }));

        setAllItems(formattedItems);
        
        setStats({
          totalItems,
          totalFarmers: farmers.size,
          recentItems: formattedItems.slice(0, 5)
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

  const renderDashboardMain = () => (
    <>
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
        <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{margin: 0}}>Recent Harvest Items</h3>
          <button 
            className="view-all-btn" 
            onClick={() => setShowAllProducts(true)}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            View All Products →
          </button>
        </div>
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
    </>
  );

  const renderAllProductsView = () => (
    <div className="all-products-explorer">
      <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <button 
            onClick={() => setShowAllProducts(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back to Dashboard
          </button>
          <h2 style={{margin: 0}}>🌐 All Harvested Products</h2>
        </div>
      </div>

      <div className="items-grid explorer-grid">
        {allItems.length > 0 ? (
          allItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-header" style={{padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'}}>
                <h4>{item.name}</h4>
                <div className="id-label">
                  <div className="copyable-id" style={{background: 'white'}}>
                    <span className="id-text">{item.id.substring(0, 8)}...{item.id.substring(item.id.length - 4)}</span>
                    <button 
                      className="copy-id-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(item.id);
                        addNotification('Item ID copied to clipboard!', 'success');
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              </div>
              <div className="item-details" style={{padding: '1.5rem', gridTemplateColumns: '1fr'}}>
                <p><strong>Farmer:</strong> {item.farmer}</p>
                <p><strong>Harvest Date:</strong> {item.date}</p>
                <p><strong>Current Status:</strong> <span className={`status-badge state-${item.state}`} style={{display: 'inline-block', width: 'fit-content', marginTop: '0.5rem'}}>{item.state}</span></p>
              </div>
            </div>
          ))
        ) : (
          <p>No products found in the supply chain.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {showAllProducts ? renderAllProductsView() : renderDashboardMain()}
    </div>
  );
};

export default Dashboard;
