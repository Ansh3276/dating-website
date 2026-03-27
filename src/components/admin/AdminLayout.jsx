import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Heart, MessageSquare,
  BarChart3, ShieldAlert, FileText, DollarSign,
  Crown, Settings, Search, Bell, Menu, X, Command
} from 'lucide-react';
import '../../styles/Admin.css';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Matches', path: '/admin/matches', icon: Heart },
    { name: 'Revenue', path: '/admin/revenue', icon: DollarSign },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: Crown },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <motion.aside
        className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}
        layout
      >
        <div className="admin-sidebar-header">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="admin-logo"
            >
              <Heart className="icon" fill="currentColor" size={24} />
              Admin
            </motion.div>
          )}
          {isCollapsed && (
             <Heart className="icon" fill="currentColor" size={24} style={{ color: 'var(--color-primary)', filter: 'drop-shadow(0 0 12px var(--color-primary-glow))' }} />
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ position: isCollapsed ? 'absolute' : 'relative', right: isCollapsed ? '28px' : '0' }}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <div className="admin-nav-group">
          {!isCollapsed && <div className="admin-nav-title">Main Menu</div>}
          <nav>
            {navigation.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <item.icon className="icon" size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {!isCollapsed && <span>{item.name}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topnav">
          <div className="admin-search">
            <Search className="icon" size={18} />
            <input type="text" placeholder="Search users, matches, settings..." />
            <div className="admin-search-kbd">
              <Command size={12} style={{ display: 'inline', marginRight: 4 }} />K
            </div>
          </div>

          <div className="admin-topnav-actions">
            <button className="admin-icon-btn">
              <Bell size={20} />
              <div className="indicator"></div>
            </button>

            <div className="admin-profile">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Admin Profile"
                className="admin-avatar"
              />
              <div className="admin-profile-info">
                <span className="admin-profile-name">Sarah Jenkins</span>
                <span className="admin-profile-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="admin-content" id="admin-scroll-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;