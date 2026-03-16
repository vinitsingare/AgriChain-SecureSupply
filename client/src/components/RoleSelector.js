import React, { useState } from 'react';

const RoleSelector = ({ onRoleSelect, accounts }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const roles = [
    { id: 'farmer', name: 'Farmer', icon: '👨‍🌾', description: 'Harvest and sell agricultural products' },
    { id: 'distributor', name: 'Distributor', icon: '🚚', description: 'Purchase from farmers and distribute to retailers' },
    { id: 'retailer', name: 'Retailer', icon: '🏪', description: 'Receive from distributors and sell to consumers' },
    { id: 'consumer', name: 'Consumer', icon: '🛒', description: 'Purchase final products from retailers' }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSelectedAccount(''); // Reset account selection
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleConfirm = () => {
    if (selectedRole && selectedAccount) {
      onRoleSelect(selectedRole, selectedAccount);
    }
  };

  return (
    <div className="role-selector">
      <div className="role-selector-header">
        <h2>Select Your Role</h2>
        <p>Choose your role in the agricultural supply chain</p>
      </div>

      <div className="roles-grid">
        {roles.map(role => (
          <div 
            key={role.id}
            className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
            onClick={() => handleRoleSelect(role.id)}
          >
            <div className="role-icon">{role.icon}</div>
            <h3>{role.name}</h3>
            <p>{role.description}</p>
          </div>
        ))}
      </div>

      {selectedRole && (
        <div className="account-selection">
          <h3>Select Your Account</h3>
          <div className="accounts-list">
            {accounts.map((account, index) => (
              <div 
                key={account}
                className={`account-card ${selectedAccount === account ? 'selected' : ''}`}
                onClick={() => handleAccountSelect(account)}
              >
                <div className="account-info">
                  <span className="account-label">Account {index + 1}</span>
                  <span className="account-address">{account}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRole && selectedAccount && (
        <div className="confirmation-section">
          <div className="selected-info">
            <h3>Selected Role & Account</h3>
            <div className="selected-details">
              <div className="selected-role">
                <span className="role-icon">{roles.find(r => r.id === selectedRole)?.icon}</span>
                <span>{roles.find(r => r.id === selectedRole)?.name}</span>
              </div>
              <div className="selected-account">
                <span>Account: {selectedAccount}</span>
              </div>
            </div>
          </div>
          <button className="confirm-button" onClick={handleConfirm}>
            Continue with {roles.find(r => r.id === selectedRole)?.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;

