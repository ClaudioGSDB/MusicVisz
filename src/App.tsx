import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import Graph from './components/Graph';
import { fetchAccessToken } from './backend/AuthService';
import { useState, useEffect } from 'react';

interface PageWithAccessTokenProps {
	component: React.ComponentType<{ accessToken: string | null }>;
}

const PageWithAccessToken: React.FC<PageWithAccessTokenProps> = ({ component: Component }) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
			const token = await fetchAccessToken();
			setAccessToken(token);
		};

		fetchToken();
	}, []);

	return <Component accessToken={accessToken} />;
};

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/main" element={<PageWithAccessToken component={Graph} />} />
			</Routes>
		</Router>
	);
};

export default App;