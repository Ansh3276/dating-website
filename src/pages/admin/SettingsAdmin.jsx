import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Database, Mail, CreditCard, Users } from 'lucide-react';
import '../../styles/Admin.css';

const SettingsAdmin = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: true,
    maxMatchesPerDay: 50,
    verificationRequired: true,
    premiumFeatures: true,
    dataRetentionDays: 365,
    backupFrequency: 'daily',
    apiRateLimit: 1000,
    supportEmail: 'support@datingpremium.com',
    privacyPolicyUrl: 'https://datingpremium.com/privacy',
    termsOfServiceUrl: 'https://datingpremium.com/terms'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: 'System Settings',
      icon: Settings,
      settings: [
        { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'toggle', description: 'Put the app in maintenance mode' },
        { key: 'verificationRequired', label: 'Require Email Verification', type: 'toggle', description: 'Users must verify email before using app' },
        { key: 'premiumFeatures', label: 'Enable Premium Features', type: 'toggle', description: 'Allow access to premium features' }
      ]
    },
    {
      title: 'Notifications',
      icon: Mail,
      settings: [
        { key: 'emailNotifications', label: 'Email Notifications', type: 'toggle', description: 'Send email notifications to users' },
        { key: 'pushNotifications', label: 'Push Notifications', type: 'toggle', description: 'Send push notifications to mobile users' }
      ]
    },
    {
      title: 'Limits & Quotas',
      icon: Shield,
      settings: [
        { key: 'maxMatchesPerDay', label: 'Max Matches Per Day', type: 'number', description: 'Maximum matches a user can receive daily' },
        { key: 'apiRateLimit', label: 'API Rate Limit (req/min)', type: 'number', description: 'Maximum API requests per minute' }
      ]
    },
    {
      title: 'Data Management',
      icon: Database,
      settings: [
        { key: 'dataRetentionDays', label: 'Data Retention (days)', type: 'number', description: 'How long to keep user data' },
        { key: 'backupFrequency', label: 'Backup Frequency', type: 'select', options: ['hourly', 'daily', 'weekly'], description: 'How often to backup data' }
      ]
    },
    {
      title: 'Legal & Support',
      icon: Users,
      settings: [
        { key: 'supportEmail', label: 'Support Email', type: 'text', description: 'Email address for user support' },
        { key: 'privacyPolicyUrl', label: 'Privacy Policy URL', type: 'text', description: 'Link to privacy policy' },
        { key: 'termsOfServiceUrl', label: 'Terms of Service URL', type: 'text', description: 'Link to terms of service' }
      ]
    }
  ];

  return (
    <div className="dashboard-overview">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title text-gradient">Admin Settings</h1>
          <p className="admin-page-subtitle">Configure system settings and platform parameters.</p>
        </div>
        <button className="admin-primary-btn">
          Save Changes
        </button>
      </div>

      <div className="settings-grid">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <section.icon size={20} style={{ marginRight: '8px' }} />
                {section.title}
              </h3>
            </div>

            <div className="settings-section">
              {section.settings.map(setting => (
                <div key={setting.key} className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">{setting.label}</label>
                    <p className="setting-description">{setting.description}</p>
                  </div>
                  <div className="setting-control">
                    {setting.type === 'toggle' && (
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    )}
                    {setting.type === 'number' && (
                      <input
                        type="number"
                        className="admin-input"
                        value={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
                        style={{ width: '80px' }}
                      />
                    )}
                    {setting.type === 'text' && (
                      <input
                        type="text"
                        className="admin-input"
                        value={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      />
                    )}
                    {setting.type === 'select' && (
                      <select
                        className="admin-select"
                        value={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      >
                        {setting.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="admin-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{ marginTop: '24px' }}
      >
        <div className="admin-card-header">
          <h3 className="admin-card-title">Danger Zone</h3>
          <Shield size={20} />
        </div>
        <p style={{ marginTop: '12px', color: 'var(--color-text-dim)' }}>
          These actions are irreversible. Please proceed with caution.
        </p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="admin-danger-btn">
            Clear All User Data
          </button>
          <button className="admin-danger-btn">
            Reset All Settings
          </button>
          <button className="admin-danger-btn">
            Shutdown Platform
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsAdmin;
