const CLIENT_ID = 'd1bfbe30d0354badbd8f27d467462595';
const REDIRECT_URI = 'http://127.0.0.1:5173/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state'
].join(' ');

// Generate a random string for the code verifier
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Hash the code verifier using SHA-256
const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

// Base64-urlencode the hash
const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const initiateSpotifyLogin = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  window.localStorage.setItem('code_verifier', codeVerifier);

  const authUrl = new URL(AUTH_ENDPOINT);
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

let activeExchangePromise: Promise<string> | null = null;

export const getAccessTokenFromCode = async (code: string): Promise<string> => {
  const existingToken = localStorage.getItem('spotify_access_token');
  if (existingToken) return existingToken;

  if (activeExchangePromise) {
    return activeExchangePromise;
  }

  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) {
    const token = localStorage.getItem('spotify_access_token');
    if (token) return token;
    throw new Error("No code verifier found in storage");
  }

  activeExchangePromise = (async () => {
    try {
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      };

      const body = await fetch(TOKEN_ENDPOINT, payload);
      const response = await body.json();

      if (response.access_token) {
        localStorage.setItem('spotify_access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('spotify_refresh_token', response.refresh_token);
        }
        localStorage.removeItem('code_verifier');
        window.history.replaceState({}, document.title, window.location.pathname);
        return response.access_token as string;
      } else {
        console.error('Failed to get token:', response);
        throw new Error(response.error_description || 'Authentication failed');
      }
    } finally {
      activeExchangePromise = null;
    }
  })();

  return activeExchangePromise;
};

export const getStoredAccessToken = () => {
  return localStorage.getItem('spotify_access_token');
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) {
    logoutSpotify();
    return null;
  }

  try {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    };

    const res = await fetch(TOKEN_ENDPOINT, payload);
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('spotify_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      return data.access_token;
    } else {
      console.warn('Failed to refresh token, logging out:', data);
      logoutSpotify();
      return null;
    }
  } catch (e) {
    console.error('Error refreshing Spotify token:', e);
    logoutSpotify();
    return null;
  }
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const token = getStoredAccessToken();
  if (!token) return null;

  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 200) {
      return token;
    }
    if (res.status === 401) {
      console.log('Spotify token expired. Refreshing...');
      return await refreshAccessToken();
    }
  } catch (e) {
    console.warn('Error checking token validity:', e);
  }
  return token;
};

export const logoutSpotify = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  window.location.reload();
};
