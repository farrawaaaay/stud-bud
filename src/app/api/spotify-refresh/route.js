import querystring from 'querystring';

export default async function handler(req, res) {
  const { refresh_token } = req.query;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token missing' });
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const body = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token,
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
}
