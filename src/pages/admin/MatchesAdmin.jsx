import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Users } from 'lucide-react';
import '../../styles/Admin.css';

const mockMatches = [
  { id: 'm_001', users: ['alexander_m', 'sarah_j12'], status: 'active', lastMessage: 'Can\'t wait for Friday!', matchedAt: '2h ago' },
  { id: 'm_002', users: ['emily_rose', 'crypto_king_99'], status: 'paused', lastMessage: 'Let\'s catch up soon.', matchedAt: '1d ago' },
  { id: 'm_003', users: ['user_alpha', 'user_beta'], status: 'active', lastMessage: 'Want to grab coffee?', matchedAt: '3d ago' },
  { id: 'm_004', users: ['user_gamma', 'user_delta'], status: 'inactive', lastMessage: 'See you later!', matchedAt: '5d ago' },
];

const MatchesAdmin = () => {
  return (
    <div className="dashboard-overview">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title text-gradient">Match Overview</h1>
          <p className="admin-page-subtitle">Manage and review active match connections.</p>
        </div>
        <div className="admin-date-picker">
          Total Matches: {mockMatches.length}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Matches</h3>
          <div className="live-indicator">
            <div className="live-dot" /> Live
          </div>
        </div>

        <div className="matches-table">
          <div className="matches-table-header">
            <span>Match ID</span>
            <span>Participants</span>
            <span>Status</span>
            <span>Last Message</span>
            <span>Matched</span>
          </div>
          {mockMatches.map(match => (
            <motion.div
              key={match.id}
              className="matches-table-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span>{match.id}</span>
              <span>{match.users.join(' & ')}</span>
              <span className={`status-badge ${match.status}`}>{match.status}</span>
              <span>{match.lastMessage}</span>
              <span>{match.matchedAt}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="admin-grid" style={{ marginTop: '24px' }}>
        <motion.div className="admin-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Match Health</h3>
            <Heart size={20} />
          </div>
          <p style={{ marginTop: '12px', color: 'var(--color-text-dim)' }}>Quick overview of active match trends and response rate.</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <div className="stat-block">
              <div className="stat-value">78%</div>
              <div className="stat-label">Response Rate</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">1.4k</div>
              <div className="stat-label">Active Conversations</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">12</div>
              <div className="stat-label">Reported Matches</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="admin-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Messaging Load</h3>
            <MessageSquare size={20} />
          </div>
          <p style={{ marginTop: '12px', color: 'var(--color-text-dim)' }}>Monitor message rates to ensure backend scaling matches demand.</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <div className="stat-block">
              <div className="stat-value">7.1k</div>
              <div className="stat-label">Messages / hr</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">2.3s</div>
              <div className="stat-label">Avg response time</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">99.8%</div>
              <div className="stat-label">Delivery success</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchesAdmin;
