import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, MessageSquare, Heart, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import '../../styles/Admin.css';

// Mock Data
const revenueData = [
  { name: 'Mon', revenue: 4000, subs: 2400 },
  { name: 'Tue', revenue: 3000, subs: 1398 },
  { name: 'Wed', revenue: 2000, subs: 9800 },
  { name: 'Thu', revenue: 2780, subs: 3908 },
  { name: 'Fri', revenue: 1890, subs: 4800 },
  { name: 'Sat', revenue: 2390, subs: 3800 },
  { name: 'Sun', revenue: 3490, subs: 4300 },
];

const sparklineData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 40 }, { value: 30 }, { value: 50 }, { value: 65 }
];

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendLabel, delay }) => {
  return (
    <motion.div
      className="admin-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="admin-card-header">
        <h3 className="admin-card-title">{title}</h3>
        <div className="admin-card-icon">
          <Icon size={20} />
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={`metric-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>{trendLabel}</span>
      </div>

      <div style={{ height: '40px', marginTop: '16px', marginLeft: '-10px', marginRight: '-10px', marginBottom: '-10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trend >= 0 ? 'var(--color-primary)' : '#EF4444'} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={trend >= 0 ? 'var(--color-primary)' : '#EF4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={trend >= 0 ? 'var(--color-primary)' : '#EF4444'}
              fillOpacity={1}
              fill={`url(#spark-${title})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const DashboardOverview = () => {
  const [activeUsers, setActiveUsers] = useState(14502);
  const [activities] = useState([
    { id: 1, type: 'match', text: 'New match created: Sarah & James', time: 'Just now' },
    { id: 2, type: 'user', text: 'New user registered: premium_boy', time: '2 mins ago' }
  ]);

  // Simulate real-time active users fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return prev + change;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-overview">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title text-gradient">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Platform performance and user registration metrics.</p>
        </div>
        <div className="admin-date-picker">
          Today: Oct 24, 2024
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Top Stat Cards */}
        <div className="col-span-4">
          <StatCard
            title="Total Users"
            value="1.2M"
            icon={Users}
            trend={12.5}
            trendLabel="vs last month"
            delay={0.1}
          />
        </div>
        <div className="col-span-4">
          <StatCard
            title="Active Users (Live)"
            value={activeUsers.toLocaleString()}
            icon={Activity}
            trend={4.2}
            trendLabel="vs last hour"
            delay={0.2}
          />
        </div>
        <div className="col-span-4">
          <StatCard
            title="Platform Revenue"
            value="$425k"
            icon={DollarSign}
            trend={18.2}
            trendLabel="vs last month"
            delay={0.3}
          />
        </div>

        {/* Real-time Analytics Panel */}
        <div className="col-span-8">
          <motion.div
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="admin-card-header">
              <h3 className="admin-card-title" style={{ fontSize: '1.2rem' }}>Revenue Overview</h3>
              <div className="live-indicator">
                <div className="live-dot"></div> Live
              </div>
            </div>

            <div className="chart-container-2d">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#880E4F" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#880E4F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--color-text-dim)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-text-dim)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(233, 30, 99, 0.1)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                  <Area type="monotone" dataKey="subs" stroke="#880E4F" fillOpacity={1} fill="url(#colorSubs)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Live Activity Feed */}
        <div className="col-span-4">
           <motion.div
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ height: '100%' }}
          >
            <div className="admin-card-header">
              <h3 className="admin-card-title">Live Updates</h3>
            </div>

            <div className="activity-feed">
              {activities.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="activity-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className={`activity-icon ${item.type}`}>
                    {item.type === 'match' && <Heart size={18} fill="currentColor" />}
                    {item.type === 'message' && <MessageSquare size={18} />}
                    {item.type === 'user' && <Users size={18} />}
                    {item.type === 'alert' && <AlertTriangle size={18} />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{item.text}</div>
                    <div className="activity-time">{item.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;