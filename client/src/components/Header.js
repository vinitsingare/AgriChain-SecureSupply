import React from 'react';

const Header = ({ activeTab, setActiveTab, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'track', label: 'Track Item', icon: '🔍' }
  ];

  // Only show Control Panel if user is not a CONSUMER
  if (user && user.role !== 'CONSUMER') {
    navItems.splice(1, 0, { id: 'role-panel', label: 'Control Panel', icon: '⚙️' });
  } else if (user && user.role === 'CONSUMER') {
    navItems.splice(1, 0, { id: 'role-panel', label: 'Shop', icon: '🛒' });
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <h1 className="logo-text">AgriChain</h1>
          </div>
          
          <nav className="nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
            
            {user && (
              <div className="user-info-nav">
                <div className="user-details">
                  <span className="user-name">{user.name || 'User'}</span>
                  <span className="user-role-badge">{user.role}</span>
                </div>
                <button className="logout-btn" onClick={onLogout} title="Logout">
                  🚪
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
