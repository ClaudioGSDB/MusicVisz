// spotifyAuth.ts

const CLIENT_ID = import.meta.env.CLIENT_ID;
const CLIENT_SECRET = import.meta.env.CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.REDIRECT_URI;

const getAccessToken = async (code: string): Promise<string> => {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI!);

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }

  const data = await response.json();
  return data.access_token;
};

export { getAccessToken };