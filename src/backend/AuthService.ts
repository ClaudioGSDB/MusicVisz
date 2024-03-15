// authService.ts
export const fetchAccessToken = async (): Promise<string | null> => {
	const code = new URLSearchParams(window.location.search).get('code');
  
	if (code) {
	  try {
		const response = await fetch('https://spotifyvisz.vercel.app/api/exchange', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ code }),
		});
		const data = await response.json();
		return data.access_token;
	  } catch (error) {
		console.error('Error exchanging authorization code:', error);
	  }
	}
  
	return null;
  };

  