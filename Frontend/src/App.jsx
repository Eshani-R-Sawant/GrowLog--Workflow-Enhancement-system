import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Componenets/Login.jsx';
import Signup from './Componenets/Signup.jsx';
import ForgotPassword from './Componenets/ForgotPassword.jsx';
import Dashboard from './Componenets/Dashboard.jsx';
import Profile from './Componenets/Profile.jsx';
import Team from './Componenets/Team.jsx';
import History from './Componenets/History.jsx';

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/forgot" element={<ForgotPassword />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/team" element={<Team />} />
			<Route path="/history" element={<History />} />
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}
