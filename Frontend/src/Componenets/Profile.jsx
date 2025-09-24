import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import '../styles/Profile.css';

const STORAGE_KEY = 'growlog_profile';

export default function Profile() {
    const [profile, setProfile] = useState({
        name: '',
        doj: '',
        dob: '',
        manager: '',
        experience: '',
        domain: '',
        team: '',
        role: '',
        avatarDataUrl: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (saved) setProfile((p) => ({ ...p, ...saved }));
        } catch {}
    }, []);

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
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } finally {
            setSaving(false);
        }
    }

    function onCancel() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (saved) setProfile((p) => ({ ...p, ...saved }));
        } catch {}
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
                                            <span className="profile__label-text">Full Name</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                value={profile.name} 
                                                readOnly
                                                placeholder="From database" 
                                            />
                                        </label>
                                    </div>
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Date of Birth</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="date" 
                                                value={profile.dob} 
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="profile__form-row">
                                    <div className="profile__field">
                                        <label className="profile__label">
                                            <span className="profile__label-text">Date of Joining</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="date" 
                                                value={profile.doj} 
                                                readOnly
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
                                            <span className="profile__label-text">Years of Experience</span>
                                            <input 
                                                className="profile__input profile__input--readonly" 
                                                type="number" 
                                                min="0" 
                                                value={profile.experience} 
                                                readOnly
                                                placeholder="From database" 
                                            />
                                        </label>
                                    </div>
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
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
}