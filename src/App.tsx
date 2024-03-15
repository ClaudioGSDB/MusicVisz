import React, { useState, useEffect } from 'react';
import { getAccessToken } from './backend/SpotifyAuth';
import Graph from './components/Graph';
import LoginPage from './LoginPage';

const App: React.FC = () => {
	const [accessToken, setAccessToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchAccessToken = async () => {
			try {
				const code = new URLSearchParams(window.location.search).get('code');
				if (code) {
					const token = await getAccessToken(code);
					setAccessToken(token);
				}
			} catch (error) {
				console.error('Failed to fetch access token:', error);
			}
		};

		fetchAccessToken();
	}, []);

	return <>{accessToken ? <Graph accessToken={accessToken} /> : <LoginPage />}</>;
};

export default App;