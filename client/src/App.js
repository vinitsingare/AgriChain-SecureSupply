import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import HarvestItem from './components/HarvestItem';
import TrackItem from './components/TrackItem';
import DistributorPanel from './components/DistributorPanel';
import RetailerPanel from './components/RetailerPanel';
import ConsumerPanel from './components/ConsumerPanel';
import Footer from './components/Footer';
import Auth from './components/Auth';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          addNotification('⚠️ Session expired. Please login again.', 'warning');
        } else {
          // In a real app, we might fetch the full user profile here
          setUser({ id: decoded.id, role: decoded.role });
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('dashboard');
    addNotification('👋 Logged out successfully', 'success');
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Header activeTab="auth" setActiveTab={() => {}} user={null} />
        <main className="main-content container">
          <Auth onLogin={handleLogin} addNotification={addNotification} />
          {notifications.length > 0 && (
            <div className="notifications">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification ${notification.type}`}>
                  {notification.message}
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="main-content">
        <div className="container">
          {notifications.length > 0 && (
            <div className="notifications">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification ${notification.type}`}>
                  {notification.message}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard user={user} addNotification={addNotification} />}
          
          {activeTab === 'role-panel' && (
            <>
              <div className="role-header">
                <h2>Control Panel: {user.role}</h2>
              </div>
              {user.role === 'FARMER' && (
                <HarvestItem addNotification={addNotification} />
              )}
              {user.role === 'DISTRIBUTOR' && (
                <DistributorPanel addNotification={addNotification} />
              )}
              {user.role === 'RETAILER' && (
                <RetailerPanel addNotification={addNotification} />
              )}
              {user.role === 'CONSUMER' && (
                <ConsumerPanel addNotification={addNotification} />
              )}
            </>
          )}
          
          {activeTab === 'track' && <TrackItem addNotification={addNotification} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
