import express from 'express';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import cors from 'cors';

const app = express();

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Directly embedding Spotify Client ID and Client Secret
const CLIENT_ID = '93f246bc76aa40d2bcbd870aec1d3777';
const CLIENT_SECRET = '25d599c63b9a45b6ba7805dda8fd6db7';

app.post('/exchange', async (req, res) => {
  const { code } = req.body;
  const basicHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicHeader}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://spotifyvisz.vercel.app/main', // Ensure this matches your frontend redirect URI
    }),
  });

  const data = await response.json();

  console.log('Spotify API response:', data); // Log the response data

  if (response.ok) {
    res.json({ access_token: data.access_token });
  } else {
    res.status(response.status).json({ error: 'Failed to obtain access token', details: data });
  }
});