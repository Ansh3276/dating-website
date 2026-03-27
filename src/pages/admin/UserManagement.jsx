import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Eye, Shield, UserX, AlertCircle, RefreshCw, Key } from 'lucide-react';
import '../../styles/Admin.css';

const mockUsers = [
  { id: 'usr_84920', username: 'alexander_m', age: 28, location: 'New York, CA', status: 'active', verified: true, plan: 'Premium', activity: 'High', reports: 0, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: 'usr_49201', username: 'sarah_j12', age: 24, location: 'London, UK', status: 'active', verified: true, plan: 'Free', activity: 'Medium', reports: 1, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: 'usr_10294', username: 'crypto_king_99', age: 31, location: 'Dubai, UAE', status: 'suspended', verified: false, plan: 'Free', activity: 'Low', reports: 5, avatar: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=100' },
  { id: 'usr_58291', username: 'emily_rose', age: 26, location: 'Paris, FR', status: 'active', verified: true, plan: 'Gold', activity: 'High', reports: 0, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
  { id: 'usr_74829', username: 'david_k', age: 29, location: 'Berlin, DE', status: 'active', verified: false, plan: 'Premium', activity: 'Medium', reports: 0, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: 'usr_99201', username: 'fake_profile1', age: 22, location: 'Unknown', status: 'banned', verified: false, plan: 'Free', activity: 'None', reports: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: 'usr_001', username: 'user_alpha', age: 25, location: 'Sydney, AU', status: 'active', verified: true, plan: 'Premium', activity: 'High', reports: 0, avatar: 'https://i.pravatar.cc/100?u=1' },
  { id: 'usr_002', username: 'user_beta', age: 30, location: 'Tokyo, JP', status: 'active', verified: true, plan: 'Gold', activity: 'Medium', reports: 0, avatar: 'https://i.pravatar.cc/100?u=2' },
  { id: 'usr_003', username: 'user_gamma', age: 27, location: 'Berlin, DE', status: 'suspended', verified: false, plan: 'Free', activity: 'Low', reports: 2, avatar: 'https://i.pravatar.cc/100?u=3' },
  { id: 'usr_004', username: 'user_delta', age: 32, location: 'Toronto, CA', status: 'active', verified: true, plan: 'Premium', activity: 'High', reports: 0, avatar: 'https://i.pravatar.cc/100?u=4' },
  { id: 'usr_005', username: 'user_epsilon', age: 22, location: 'Rome, IT', status: 'active', verified: false, plan: 'Free', activity: 'Medium', reports: 1, avatar: 'https://i.pravatar.cc/100?u=5' },
  { id: 'usr_006', username: 'user_zeta', age: 29, location: 'Seoul, KR', status: 'active', verified: true, plan: 'Gold', activity: 'High', reports: 0, avatar: 'https://i.pravatar.cc/100?u=6' },
  { id: 'usr_007', username: 'user_eta', age: 26, location: 'Madrid, ES', status: 'active', verified: true, plan: 'Premium', activity: 'Medium', reports: 0, avatar: 'https://i.pravatar.cc/100?u=7' },
  { id: 'usr_008', username: 'user_theta', age: 35, location: 'Cairo, EG', status: 'banned', verified: false, plan: 'Free', activity: 'None', reports: 8, avatar: 'https://i.pravatar.cc/100?u=8' },
  { id: 'usr_009', username: 'user_iota', age: 24, location: 'Munich, DE', status: 'active', verified: true, plan: 'Premium', activity: 'High', reports: 0, avatar: 'https://i.pravatar.cc/100?u=9' },
  { id: 'usr_010', username: 'user_kappa', age: 28, location: 'Stockholm, SE', status: 'active', verified: false, plan: 'Free', activity: 'Medium', reports: 0, avatar: 'https://i.pravatar.cc/100?u=10' },
  { id: 'usr_011', username: 'user_lambda', age: 31, location: 'Amsterdam, NL', status: 'active', verified: true, plan: 'Gold', activity: 'High', reports: 0, avatar: 'https://i.pravatar.cc/100?u=11' },
  { id: 'usr_012', username: 'user_mu', age: 23, location: 'Oslo, NO', status: 'active', verified: true, plan: 'Premium', activity: 'Medium', reports: 0, avatar: 'https://i.pravatar.cc/100?u=12' },
  { id: 'usr_013', username: 'user_nu', age: 33, location: 'Lisbon, PT', status: 'suspended', verified: false, plan: 'Free', activity: 'Low', reports: 4, avatar: 'https://i.pravatar.cc/100?u=13' },
  { id: 'usr_014', username: 'user_xi', age: 27, location: 'Athens, GR', status: 'active', verified: true, plan: 'Premium', activity: 'High', reports: 0, avatar: 'https://i.pravatar.cc/100?u=14' },
  { id: 'usr_015', username: 'user_omicron', age: 29, location: 'Vienna, AT', status: 'active', verified: false, plan: 'Free', activity: 'Medium', reports: 0, avatar: 'https://i.pravatar.cc/100?u=15' },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [activeMenu, setActiveMenu] = useState(null);
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'All' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const toggleUserStatus = (id, newStatus) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, status: newStatus } : user));
    setActiveMenu(null);
  };

  const toggleVerify = (id) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, verified: !user.verified } : user));
    setActiveMenu(null);
  };

  const exportCSV = () => {
    const headers = ['id', 'username', 'age', 'location', 'status', 'plan', 'activity', 'reports'];
    const rows = users.map(u => [u.id, u.username, u.age, u.location, u.status, u.plan, u.activity, u.reports]);

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="dashboard-overview">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title text-gradient">User Management</h1>
          <p className="admin-page-subtitle">View, filter, and manage platform members.</p>
        </div>
        <div className="admin-date-picker">
          Total Users: 1,204,592
        </div>
      </div>

      <div className="admin-card">
        {/* Table Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="admin-search" style={{ width: '300px' }}>
            <Search className="icon" size={18} />
            <input
              type="text"
              placeholder="Search by username or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="admin-date-picker" style={{ gap: '8px', cursor: 'pointer' }}>
              <Filter size={16} />
              <select
                style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer' }}
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
              >
                <option value="All">All Plans</option>
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
                <option value="Gold">Gold</option>
              </select>
            </div>
            <button className="btn pill" onClick={exportCSV} style={{ background: 'var(--color-primary)', color: 'white', padding: '10px 24px', letterSpacing: '0.05em' }}>
              Export CSV
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="admin-table-container" style={{ minHeight: '400px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Plan</th>
                <th>Location</th>
                <th>Activity</th>
                <th>Reports</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <td>
                      <div className="user-cell">
                        <img src={user.avatar} alt={user.username} />
                        <div>
                          <div className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {user.username}
                            {user.verified && <Shield size={14} color="var(--color-primary)" fill="var(--color-primary-pale)" />}
                          </div>
                          <div className="user-email">{user.id} • Age {user.age}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.85rem',
                        color: user.plan === 'Free' ? 'var(--color-text-dim)' : 'var(--color-primary)'
                      }}>
                        {user.plan}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>{user.location}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: user.activity === 'High' ? '#10B981' : user.activity === 'Medium' ? '#F59E0B' : '#EF4444'
                        }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.activity}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: user.reports > 0 ? '#EF4444' : 'var(--color-text-dim)', fontWeight: user.reports > 0 ? 700 : 400 }}>
                        {user.reports}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', position: 'relative' }}>
                      <button className="action-btn" onClick={() => toggleMenu(user.id)}>
                        <MoreVertical size={20} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeMenu === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
                              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
                              border: '1px solid var(--glass-border)', borderRadius: '12px',
                              boxShadow: 'var(--card-shadow-hover)', padding: '8px',
                              zIndex: 100, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px'
                            }}
                          >
                            <button className="dropdown-item"><Eye size={16}/> View Profile</button>
                            <button className="dropdown-item" onClick={() => toggleVerify(user.id)}>
                              <Shield size={16}/> {user.verified ? 'Unverify' : 'Verify'} User
                            </button>
                            <button className="dropdown-item"><AlertCircle size={16}/> Send Warning</button>
                            <button className="dropdown-item"><Key size={16}/> Reset Password</button>
                            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>
                            {user.status !== 'suspended' && <button className="dropdown-item" style={{ color: '#F59E0B' }} onClick={() => toggleUserStatus(user.id, 'suspended')}><UserX size={16}/> Suspend Account</button>}
                            {user.status !== 'banned' && <button className="dropdown-item" style={{ color: '#EF4444' }} onClick={() => toggleUserStatus(user.id, 'banned')}><UserX size={16}/> Ban User</button>}
                            {(user.status === 'suspended' || user.status === 'banned') && <button className="dropdown-item" style={{ color: '#10B981' }} onClick={() => toggleUserStatus(user.id, 'active')}><Shield size={16}/> Reinstate User</button>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
              No users found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination mock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-ui)' }}>
            Showing 1 to {filteredUsers.length} of 1,204,592 entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn pill" style={{ background: 'transparent', color: 'var(--color-text-dim)' }}>Previous</button>
            <button className="btn pill" style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}>1</button>
            <button className="btn pill" style={{ background: 'transparent', color: 'var(--color-text-dim)' }}>2</button>
            <button className="btn pill" style={{ background: 'transparent', color: 'var(--color-text-dim)' }}>3</button>
            <span style={{ padding: '0 8px', color: 'var(--color-text-dim)' }}>...</span>
            <button className="btn pill" style={{ background: 'transparent', color: 'var(--color-text-dim)' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
