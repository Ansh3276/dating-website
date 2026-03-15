import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingBackground from '../components/ui/FloatingBackground';
import { getPhotoUrl } from '../services/api';
import '../styles/Profile.css';

const NO_DP = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const API_BASE = 'http://localhost:5000'; // Define backend base

    const calculateCompletion = (u) => {
        let score = 0;
        if (u.name) score += 20;
        if (u.age) score += 10;
        if (u.bio) score += 20;
        if (u.photoUrl) score += 20;
        if (u.gender) score += 15;
        if (u.showMe) score += 15;
        return score;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { getProfile } = await import('../services/api');
                const data = await getProfile();
                if (typeof data.tags === 'string') {
                    try {
                        data.tags = JSON.parse(data.tags);
                    } catch (e) {
                         data.tags = [];
                    }
                }
                setUser(data);
                setEditForm(data);
                setImagePreview(getPhotoUrl(data.photoUrl));
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
            
            // Use FormData for possible file upload
            const formData = new FormData();
            formData.append('name', editForm.name || '');
            formData.append('age', editForm.age || '');
            formData.append('bio', editForm.bio || '');
            formData.append('location', editForm.location || '');
            formData.append('gender', editForm.gender || '');
            formData.append('showMe', editForm.showMe || '');
            
            const tags = Array.isArray(editForm.tags) ? editForm.tags : editForm.tags?.split(',').map(s => s.trim()) || [];
            formData.append('tags', JSON.stringify(tags));

            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            const updated = await updateProfile(formData);
            setUser(updated);
            
            setIsEditing(false);
            setImagePreview(getPhotoUrl(updated.photoUrl));
            window.location.reload(); 
        } catch (err) {
            console.error('Failed to update profile', err);
            setError('Failed to save changes.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
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
                                <img src={imagePreview || NO_DP} alt={user.name} />
                                {isEditing && (
                                    <label className="avatar-edit-overlay">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <span className="upload-icon">📷 Update Photo</span>
                                    </label>
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
                                        <div className="profile-meta-row">
                                            <p className="profile-loc">📍 {user.location || 'Local'}</p>
                                            <span className="profile-gender-tag">{user.gender || 'Not set'}</span>
                                        </div>
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

                            <section className="profile-section">
                                <h3>Identity & Preferences</h3>
                                <div className="identity-grid">
                                    <div className="identity-item">
                                        <label>Gender</label>
                                        {isEditing ? (
                                            <select 
                                                value={editForm.gender} 
                                                onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                                            >
                                                <option value="">Select...</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="non-binary">Non-binary</option>
                                            </select>
                                        ) : (
                                            <p className="val">{user.gender || 'Not specified'}</p>
                                        )}
                                    </div>
                                    <div className="identity-item">
                                        <label>Interested In</label>
                                        {isEditing ? (
                                            <select 
                                                value={editForm.showMe} 
                                                onChange={(e) => setEditForm({...editForm, showMe: e.target.value})}
                                            >
                                                <option value="">Select...</option>
                                                <option value="women">Women</option>
                                                <option value="men">Men</option>
                                                <option value="everyone">Everyone</option>
                                            </select>
                                        ) : (
                                            <p className="val">{user.showMe || 'Everyone'}</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="profile-sidebar">
                            <div className="sidebar-card">
                                <h4>Compatibility Score</h4>
                                 <div className="comp-circle">
                                    <svg viewBox="0 0 36 36">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                                        <path 
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                            fill="none" 
                                            stroke="#E91E63" 
                                            strokeWidth="3" 
                                            strokeDasharray={`${calculateCompletion(user)}, 100`} 
                                        />
                                    </svg>
                                    <span>{calculateCompletion(user)}%</span>
                                </div>
                                <p>Complete your profile to unlock deeper connections.</p>
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
