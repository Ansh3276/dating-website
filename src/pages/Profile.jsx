import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingBackground from '../components/ui/FloatingBackground';
import '../styles/Profile.css';

const NO_DP = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { getProfile } = await import('../services/api');
                const data = await getProfile();
                setUser(data);
                setEditForm(data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                const message = err.response?.data?.message || 'Failed to load profile. Please try logging in again.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const { updateProfile } = await import('../services/api');
            const updated = await updateProfile({
                ...editForm,
                // Ensure tags are handled as an array if they were edited as a string
                tags: Array.isArray(editForm.tags) ? editForm.tags : editForm.tags.split(',').map(s => s.trim())
            });
            setUser(updated);
            
            // CRITICAL: Preserve the token when updating localStorage
            const existingInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            localStorage.setItem('userInfo', JSON.stringify({ ...existingInfo, ...updated }));
            
            setIsEditing(false);
            window.location.reload(); // Quick way to sync all components like Navbar
        } catch (err) {
            console.error('Failed to update profile', err);
            setError('Failed to save changes.');
        }
    };

    if (loading) return <div className="loading-screen">Loading your profile...</div>;
    if (!user) return <div className="error-screen">{error || 'No user found.'}</div>;

    return (
        <>
            <FloatingBackground />
            <Navbar />
            <div className="profile-page">
                <motion.div 
                    className="profile-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="profile-header-card">
                        <div className="profile-avatar-section">
                            <div className="profile-main-avatar">
                                <img src={user.photoUrl || NO_DP} alt={user.name} />
                                {isEditing && (
                                    <div className="avatar-edit-overlay">
                                        <input 
                                            type="text" 
                                            placeholder="Image URL..." 
                                            value={editForm.photoUrl || ''} 
                                            onChange={(e) => setEditForm({...editForm, photoUrl: e.target.value})}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="profile-primary-info">
                                {isEditing ? (
                                    <div className="edit-fields-stack">
                                        <input 
                                            className="edit-input-large"
                                            value={editForm.name} 
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                            placeholder="Your Name"
                                        />
                                        <input 
                                            className="edit-input-small"
                                            type="number"
                                            value={editForm.age} 
                                            onChange={(e) => setEditForm({...editForm, age: e.target.value})} 
                                            placeholder="Age"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1>{user.name}, {user.age}</h1>
                                        <p className="profile-loc">📍 {user.location || 'Not specified'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="profile-header-actions">
                            {isEditing ? (
                                <>
                                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
                                </>
                            ) : (
                                <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            )}
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-main-content">
                            <section className="profile-section">
                                <h3>About Me</h3>
                                {isEditing ? (
                                    <textarea 
                                        className="edit-textarea"
                                        value={editForm.bio} 
                                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                        placeholder="Write your story..."
                                    />
                                ) : (
                                    <p>{user.bio || "No bio yet. Tell the world about yourself!"}</p>
                                )}
                            </section>

                            <section className="profile-section">
                                <h3>Passions</h3>
                                {isEditing ? (
                                    <input 
                                        className="edit-input-full"
                                        value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : editForm.tags} 
                                        onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                                        placeholder="Travel, Jazz, Reading (comma separated)"
                                    />
                                ) : (
                                    <div className="profile-tags-grid">
                                        {(user.tags || []).map(tag => (
                                            <span key={tag} className="profile-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        <aside className="profile-sidebar">
                            <div className="sidebar-card">
                                <h4>Compatibility Score</h4>
                                <div className="comp-circle">
                                    <svg viewBox="0 0 36 36">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E91E63" strokeWidth="3" strokeDasharray="95, 100" />
                                    </svg>
                                    <span>95%</span>
                                </div>
                                <p>Your profile is highly optimized for meaningful connections.</p>
                            </div>
                        </aside>
                    </div>
                </motion.div>
            </div>
            {error && <div className="global-error-toast">{error}</div>}
        </>
    );
};

export default Profile;
