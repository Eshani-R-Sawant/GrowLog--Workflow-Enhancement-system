import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import profileService from '../services/ProfileService.js';
import '../styles/Profile.css';

export default function Profile() {
    const [profile, setProfile] = useState({
        // Non-editable fields (from database)
        username: '',
        email: '',
        dateOfBirth: '',
        dateOfJoining: '',
        experience: 0,
        createdAt: '',
        
        // Editable fields
        manager: '',
        domain: '',
        team: '',
        role: '',
        bio: '',
        phone: '',
        location: '',
        avatarDataUrl: '',
        
        // No task statistics needed in profile
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        setLoading(true);
        try {
            const profileData = await profileService.getProfile();
            if (profileData) {
                setProfile(profileData);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    }

    function onChange(field, value) {
        setProfile((p) => ({ ...p, [field]: value }));
    }

    function onPickAvatar(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setProfile((p) => ({ ...p, avatarDataUrl: String(reader.result || '') }));
        };
        reader.readAsDataURL(file);
    }

    function onRemoveAvatar() {
        setProfile((p) => ({ ...p, avatarDataUrl: '' }));
    }

    async function onSave() {
        setSaving(true);
        setError('');
        try {
            // Only send editable fields
            const editableFields = {
                manager: profile.manager,
                domain: profile.domain,
                team: profile.team,
                role: profile.role,
                bio: profile.bio,
                phone: profile.phone,
                location: profile.location,
                avatarDataUrl: profile.avatarDataUrl
            };

            const updatedProfile = await profileService.updateProfile(editableFields);
            if (updatedProfile) {
                setProfile(prev => ({ ...prev, ...updatedProfile }));
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save profile');
        } finally {
            setSaving(false);
        }
    }

    function onCancel() {
        loadProfile(); // Reload from database
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="dash__layout">
                    <Sidebar />
                    <main className="dash__main">
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <h2>Loading profile...</h2>
                        </div>
                    </main>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="dash__layout">
                <Sidebar />
                <main className="dash__main">
                    {/* Profile Image in Top-Right Corner */}
                    <div className="profile__corner-avatar">
                        {profile.avatarDataUrl ? (
                            <img src={profile.avatarDataUrl} alt="Profile" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    <header className="profile__header">
                        <div className="profile__header-content">
                            <h1>👤 My Profile</h1>
                            <p>Keep your information up to date and showcase your professional journey</p>
                            {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
                        </div>
                    </header>

                    <section className="profile__content">
                        <div className="profile__card">
                            <div className="profile__card-header">
                                <h2>📋 Personal Information</h2>
                                <div className="profile__avatar-section">
                                    <div className="profile__avatar">
                                        {profile.avatarDataUrl ? (
                                            <img src={profile.avatarDataUrl} alt="Profile" />
                                        ) : (
                                            <span>👤</span>
                                        )}
                                    </div>
                                    <div className="profile__avatar-actions">
                                        <label className="profile__upload-btn">
                                             Upload Photo
                                            <input type="file" accept="image/*" onChange={onPickAvatar} style={{ display: 'none' }} />
                                        </label>
                                        {profile.avatarDataUrl && (
                                            <button className="profile__remove-btn" onClick={onRemoveAvatar}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="profile__form">
                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Username</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                value={profile.username} 
                                                readOnly
                                                placeholder="From database" 
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Email</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="email" 
                                                value={profile.email} 
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Date of Birth</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="date" 
                                                value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''} 
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Date of Joining</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="date" 
                                                value={profile.dateOfJoining ? new Date(profile.dateOfJoining).toISOString().split('T')[0] : ''} 
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Years of Experience</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="number" 
                                                value={profile.experience} 
                                                readOnly
                                                placeholder="Calculated from joining date" 
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Manager</span>
                                            <input 
                                                className="profile__input" 
                                                value={profile.manager} 
                                                onChange={(e) => onChange('manager', e.target.value)} 
                                                placeholder="Your manager's name" 
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Domain</span>
                                            <input 
                                                className="profile__input" 
                                                value={profile.domain} 
                                                onChange={(e) => onChange('domain', e.target.value)} 
                                                placeholder="e.g., Frontend Development" 
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Phone</span>
                                            <input 
                                                className="profile__input" 
                                                value={profile.phone} 
                                                onChange={(e) => onChange('phone', e.target.value)} 
                                                placeholder="Your phone number" 
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Team Name</span>
                                            <input 
                                                className="profile__input" 
                                                value={profile.team} 
                                                onChange={(e) => onChange('team', e.target.value)} 
                                                placeholder="e.g., Delta Team" 
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Role</span>
                                            <input 
                                                className="profile__input" 
                                                value={profile.role} 
                                                onChange={(e) => onChange('role', e.target.value)} 
                                                placeholder="e.g., Senior Developer" 
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Location</span>
                                            <input 
                                                className="profile__input" 
                                                value={profile.location} 
                                                onChange={(e) => onChange('location', e.target.value)} 
                                                placeholder="e.g., New York, USA" 
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Bio</span>
                                            <textarea 
                                                className="profile__input" 
                                                value={profile.bio} 
                                                onChange={(e) => onChange('bio', e.target.value)} 
                                                placeholder="Tell us about yourself..." 
                                                rows="3"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__actions">
                                    <button 
                                        className="profile__save-btn" 
                                        onClick={onSave} 
                                        disabled={saving}
                                    >
                                        {saving ? '💾 Saving...' : '💾 Save Changes'}
                                    </button>
                                    <button className="profile__cancel-btn" onClick={onCancel}>
                                        🔄 Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Stats Card */}
                        <div className="profile__stats-card">
                            <h3>📊 Your Profile Stats</h3>
                            <div className="profile__stats-grid">
                                <div className="profile__stat">
                                    <span className="profile__stat-number">{profile.experience || 0}</span>
                                    <span className="profile__stat-label">Years Experience</span>
                                </div>
                                <div className="profile__stat">
                                    <span className="profile__stat-number">{profile.team ? '✅' : '⏳'}</span>
                                    <span className="profile__stat-label">Team Assigned</span>
                                </div>
                                <div className="profile__stat">
                                    <span className="profile__stat-number">{profile.avatarDataUrl ? '✅' : '⏳'}</span>
                                    <span className="profile__stat-label">Photo Uploaded</span>
                                </div>
                                <div className="profile__stat">
                                    <span className="profile__stat-number">{profile.domain ? '✅' : '⏳'}</span>
                                    <span className="profile__stat-label">Domain Set</span>
                                </div>
                                <div className="profile__stat">
                                    <span className="profile__stat-number">{profile.role ? '✅' : '⏳'}</span>
                                    <span className="profile__stat-label">Role Defined</span>
                                </div>
                                <div className="profile__stat">
                                    <span className="profile__stat-number">{profile.manager ? '✅' : '⏳'}</span>
                                    <span className="profile__stat-label">Manager Assigned</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
}