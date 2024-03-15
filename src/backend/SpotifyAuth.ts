// spotifyAuth.ts

const CLIENT_ID = '80238562c5cf4d678598a7ac2f2d4377';
const CLIENT_SECRET = '543c6bfbdb71495388af6b6a45083ddf';
const REDIRECT_URI = 'https://spotifyvisz.vercel.app';

const getAccessToken = async (code: string): Promise<string> => {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);

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