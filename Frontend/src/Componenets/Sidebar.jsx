import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
const STORAGE_KEY = 'growlog_profile';

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (saved?.avatarDataUrl) setAvatar(saved.avatarDataUrl);
        } catch {}
    }, []);

	return (
        <div>
            <aside className={`dash__nav ${open ? 'is-open' : ''}`}>
            
            <div className="dash__brand">
                {avatar ? <img src={avatar} alt="avatar" /> : 'GL'}
            </div>

        
            
           
			<button style={{marginTop: 20}} className="dash__hamburger" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
				<span />
				<span />
				<span />
			</button>
            
			<nav className="dash__navlist">
				<Link className={`dash__navlink ${pathname === '/dashboard' ? 'is-active' : ''}`} to="/dashboard">Dashboard</Link>
				<Link className={`dash__navlink ${pathname === '/profile' ? 'is-active' : ''}`} to="/profile">Profile</Link>
				<Link className={`dash__navlink ${pathname === '/team' ? 'is-active' : ''}`} to="/team">Team</Link>
				<Link className={`dash__navlink ${pathname === '/history' ? 'is-active' : ''}`} to="/history">History</Link>
			</nav>
		</aside>
</div>
	);
}


