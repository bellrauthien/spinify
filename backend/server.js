require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for playlists, user song counts, and jam session users
const playlists = {};
const userSongCounts = {};
const jamSessions = {};
const jamOwners = {};
const jamOwnerNames = {};

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:8888/callback'
});

// Store user tokens
const userTokens = {};

// Helper function to refresh Spotify access token using client credentials
async function getClientCredentialsToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('Client credentials token refreshed');
    return data.body['access_token'];
  } catch (error) {
    console.error('Error getting Spotify client credentials token:', error);
    throw error;
  }
}

// Helper function to get a user's access token or refresh it if expired
async function getUserAccessToken(userId) {
  if (!userTokens[userId]) {
    return null; // User not authenticated
  }
  
  // Check if token is expired (subtract 60 seconds to be safe)
  if (Date.now() > userTokens[userId].expiresAt - 60000) {
    try {
      // Set the refresh token and try to refresh the access token
      spotifyApi.setRefreshToken(userTokens[userId].refreshToken);
      const data = await spotifyApi.refreshAccessToken();
      
      // Update stored tokens
      userTokens[userId] = {
        accessToken: data.body['access_token'],
        refreshToken: userTokens[userId].refreshToken, // Keep the refresh token
        expiresAt: Date.now() + (data.body['expires_in'] * 1000)
      };
      
      console.log('User access token refreshed for', userId);
    } catch (error) {
      console.error('Error refreshing user access token:', error);
      delete userTokens[userId]; // Clear invalid tokens
      return null;
    }
  }
  
  return userTokens[userId].accessToken;
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Spotify Auth Routes

// Login with Spotify
app.get('/api/auth/spotify', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private'
  ];
  
  const state = Math.random().toString(36).substring(2, 15);
  
  // Generate authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  
  res.json({ url: authorizeURL });
});

// Callback from Spotify auth
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }
  
  try {
    // Exchange code for access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    // Get user profile to use as ID
    spotifyApi.setAccessToken(data.body['access_token']);
    const userProfile = await spotifyApi.getMe();
    const userId = userProfile.body.id;
    const displayName = userProfile.body.display_name || userProfile.body.id;
    
    // Store tokens
    userTokens[userId] = {
      accessToken: data.body['access_token'],
      refreshToken: data.body['refresh_token'],
      expiresAt: Date.now() + (data.body['expires_in'] * 1000),
      displayName: displayName
    };
    
    // Redirect to frontend with user ID and display name
    res.redirect(`http://localhost:3000/auth-success?userId=${userId}&displayName=${encodeURIComponent(displayName)}`);
  } catch (error) {
    console.error('Error during authorization code exchange:', error);
    res.redirect('http://localhost:3000/auth-error');
  }
});

// Check if user is authenticated
app.get('/api/auth/status', (req, res) => {
  const { userId } = req.query;
  
  if (!userId || !userTokens[userId]) {
    return res.json({ authenticated: false });
  }
  
  res.json({ authenticated: true });
});

// Join a Spotify Jam session
app.post('/api/join-jam', async (req, res) => {
  const { jamCode, userId, userName } = req.body;
  
  if (!jamCode) {
    return res.status(400).json({ error: 'Jam code is required' });
  }
  
  // Track the user joining this jam
  if (!jamSessions[jamCode]) {
    jamSessions[jamCode] = [];
    
    // If this is a new jam, set the current user as the owner
    if (userId && !jamOwners[jamCode]) {
      jamOwners[jamCode] = userId;
      
      // Store the owner's name if provided
      if (userName && userName.trim()) {
        jamOwnerNames[jamCode] = userName.trim();
      } else {
        // Default names if none provided
        const defaultNames = ["Pedro", "Sofia", "Miguel", "Ana", "Carlos"];
        jamOwnerNames[jamCode] = defaultNames[Math.floor(Math.random() * defaultNames.length)];
      }
    }
  }
  
  // Add user to the jam if not already in it
  if (userId && !jamSessions[jamCode].includes(userId)) {
    jamSessions[jamCode].push(userId);
  }
  
  try {
    // Try to use user token if available, otherwise fall back to client credentials
    let accessToken;
    if (userId && userTokens[userId]) {
      accessToken = await getUserAccessToken(userId);
    } else {
      accessToken = await getClientCredentialsToken();
    }
    
    spotifyApi.setAccessToken(accessToken);
    
    // Spotify's Jam feature doesn't have public API endpoints yet
    // We'll use a combination of available endpoints to simulate the functionality
    // For now, we'll treat the jamCode as a playlist ID or a collaborative session identifier
    let jamSession;
    
    try {
      // Try to get a playlist with the provided ID
      // If jamCode is a Spotify URI or URL, extract just the ID part
      const playlistId = jamCode.includes(':') ? jamCode.split(':').pop() : 
                         jamCode.includes('/') ? jamCode.split('/').pop() : jamCode;
      
      const playlistData = await spotifyApi.getPlaylist(playlistId);
      
      // Convert Spotify playlist to our app's format
      const tracks = playlistData.body.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        albumCover: item.track.album.images[0]?.url || 'https://via.placeholder.com/300'
      }));
      
      jamSession = {
        name: playlistData.body.name,
        songs: tracks
      };
      
      // Cache the playlist
      playlists[jamCode] = jamSession;
    } catch (spotifyError) {
      console.log('Could not find Spotify Jam, using mock data:', spotifyError);
      
      // Fall back to mock data if Spotify API doesn't have the jam or endpoint isn't available
      if (!playlists[jamCode]) {
        // Try to extract jam owner from the jam code or Spotify data
        let jamOwner = "";
        
        try {
          // First check if we have Spotify data about the creator
          if (playlistData && playlistData.body && playlistData.body.owner) {
            jamOwner = playlistData.body.owner.display_name || playlistData.body.owner.id;
          } 
          // If not, try to extract from jam code (some codes might be username-jamcode)
          else if (jamCode.includes('-')) {
            const parts = jamCode.split('-');
            if (parts.length > 1) {
              jamOwner = parts[0];
            }
          }
        } catch (err) {
          console.log('Could not extract jam owner:', err);
        }
        
        // If we couldn't extract an owner, use a generic name
        if (!jamOwner) {
          const jamNames = [
            "Spotify",
            "Music",
            "Party",
            "Groove",
            "Beats"
          ];
          jamOwner = jamNames[Math.floor(Math.random() * jamNames.length)];
        }
        
        playlists[jamCode] = {
          name: `${jamOwner}'s Jam`,
          owner: jamOwner,
          songs: []
        };
      }
      
      jamSession = playlists[jamCode];
    }
    
    // Add user count information
    const usersInJam = jamSessions[jamCode] ? jamSessions[jamCode].length : 1;
    const ownerName = jamOwners[jamCode] === userId ? "You" : jamOwnerNames[jamCode] || "DJ";
    
    res.json({ 
      success: true, 
      message: 'Joined jam session',
      playlist: jamSession,
      jamInfo: {
        users: usersInJam,
        owner: ownerName,
        isOwner: jamOwners[jamCode] === userId
      }
    });
    
    // Notify all clients about the join with user count
    io.emit('user-joined', { 
      jamCode, 
      usersCount: jamSessions[jamCode] ? jamSessions[jamCode].length : 1,
      userId
    });
    
  } catch (error) {
    console.error('Error joining jam:', error);
    res.status(500).json({ error: 'Failed to join jam session' });
  }
});

// Add a song to a playlist
app.post('/api/add-song', async (req, res) => {
  const { jamCode, songId, userId, songDetails } = req.body;
  
  if (!jamCode || !songId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Check if user has free songs left
    if (!userSongCounts[userId]) {
      userSongCounts[userId] = { count: 0, paid: false };
    }
    
    const userCount = userSongCounts[userId];
    
    // Check if user needs to pay
    if (userCount.count >= 3 && !userCount.paid) {
      return res.status(402).json({ 
        error: 'Payment required', 
        message: 'You have used your 3 free songs. Please pay €1 for 3 more songs.'
      });
    }
    
    // Try to add song to Spotify playlist
    try {
      // Get user access token if available, otherwise use client credentials
      let accessToken;
      let isUserAuthenticated = false;
      
      if (userTokens[userId]) {
        accessToken = await getUserAccessToken(userId);
        isUserAuthenticated = true;
      } else {
        accessToken = await getClientCredentialsToken();
      }
      
      if (!accessToken) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please login with Spotify to add songs to playlists'
        });
      }
      
      spotifyApi.setAccessToken(accessToken);
      
      // Extract playlist ID if jamCode is a Spotify URI or URL
      const playlistId = jamCode.includes(':') ? jamCode.split(':').pop() : 
                         jamCode.includes('/') ? jamCode.split('/').pop() : jamCode;
      
      // Add track to playlist
      // Note: This requires write permission which may not be available with client credentials
      // In a production app, you would use authorization code flow with proper scopes
      await spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${songId}`]);
      
      // Get updated playlist
      const playlistData = await spotifyApi.getPlaylist(playlistId);
      
      // Convert to our format
      const tracks = playlistData.body.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        albumCover: item.track.album.images[0]?.url || 'https://via.placeholder.com/300'
      }));
      
      const updatedJam = {
        name: playlistData.body.name,
        songs: tracks
      };
      
      // Update local cache
      playlists[jamCode] = updatedJam;
    } catch (spotifyError) {
      console.log('Could not add song to Spotify Jam, using mock data:', spotifyError);
      
      // Fall back to mock data if Spotify API doesn't have the jam or endpoint isn't available
      if (!playlists[jamCode]) {
        // Try to extract jam owner from the jam code if possible
        let jamOwner = "";
        try {
          // Some jam codes might contain owner info in a format like "username-jamcode"
          if (jamCode.includes('-')) {
            const parts = jamCode.split('-');
            if (parts.length > 1) {
              jamOwner = parts[0];
            }
          }
        } catch (err) {
          console.log('Could not extract jam owner from code');
        }
        
        // If we couldn't extract an owner, use a generic name
        if (!jamOwner) {
          const jamNames = [
            "Spotify",
            "Music",
            "Party",
            "Groove",
            "Beats"
          ];
          jamOwner = jamNames[Math.floor(Math.random() * jamNames.length)];
        }
        
        playlists[jamCode] = {
          name: `${jamOwner}'s Jam`,
          songs: []
        };
      }
      
      // Add the song to the playlist
      const newSong = {
        id: songId,
        ...songDetails
      };
      
      // Check if the song already exists in the playlist
      if (!playlists[jamCode].songs.some(song => song.id === songId)) {
        playlists[jamCode].songs.push(newSong);
      }
    }
    
    // Increment user song count
    userSongCounts[userId].count++;
    
    // Emit event to all connected clients
    io.emit('playlist-updated', { 
      jamCode, 
      playlist: playlists[jamCode]
    });
    
    // Log the updated playlist for debugging
    console.log('Updated playlist:', jamCode, JSON.stringify(playlists[jamCode]));
    
    res.json({
      success: true,
      message: 'Song added to playlist',
      playlist: playlists[jamCode],
      remainingFreeSongs: Math.max(0, 3 - userSongCounts[userId].count)
    });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ error: 'Failed to add song' });
  }
});

// Process mock payment
app.post('/api/process-payment', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    // In a real app, you would integrate with a payment processor here
    
    // Mark user as paid
    if (!userSongCounts[userId]) {
      userSongCounts[userId] = { count: 0, paid: true };
    } else {
      userSongCounts[userId].paid = true;
    }
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully. You can now add 3 more songs.'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Search for songs using Spotify API
app.get('/api/search', async (req, res) => {
  const { query, userId } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    // Try to use user token if available, otherwise fall back to client credentials
    let accessToken;
    if (userId && userTokens[userId]) {
      accessToken = await getUserAccessToken(userId);
    } else {
      accessToken = await getClientCredentialsToken();
    }
    
    spotifyApi.setAccessToken(accessToken);
    
    // Search tracks on Spotify
    const searchResults = await spotifyApi.searchTracks(query, { limit: 5 });
    
    // Format results
    if (searchResults.body && searchResults.body.tracks && searchResults.body.tracks.items) {
      const results = searchResults.body.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        albumCover: track.album.images[0]?.url || 'https://via.placeholder.com/300'
      }));
      
      res.json({ results });
    } else {
      // Fall back to mock results if Spotify API fails
      const mockResults = [
        { id: '101', name: `${query} Hit 1`, artist: 'Famous Artist', albumCover: 'https://via.placeholder.com/300' },
        { id: '102', name: `${query} Classic`, artist: 'Legend Band', albumCover: 'https://via.placeholder.com/300' },
        { id: '103', name: `${query} Remix`, artist: 'DJ Something', albumCover: 'https://via.placeholder.com/300' },
        { id: '104', name: `${query} Live`, artist: 'Concert Band', albumCover: 'https://via.placeholder.com/300' },
        { id: '105', name: `${query} Acoustic`, artist: 'Indie Artist', albumCover: 'https://via.placeholder.com/300' }
      ];
      
      res.json({ results: mockResults });
    }
  } catch (error) {
    console.error('Error searching songs:', error);
    
    // Fall back to mock results if Spotify API fails
    const mockResults = [
      { id: '101', name: `${query} Hit 1`, artist: 'Famous Artist', albumCover: 'https://via.placeholder.com/300' },
      { id: '102', name: `${query} Classic`, artist: 'Legend Band', albumCover: 'https://via.placeholder.com/300' },
      { id: '103', name: `${query} Remix`, artist: 'DJ Something', albumCover: 'https://via.placeholder.com/300' },
      { id: '104', name: `${query} Live`, artist: 'Concert Band', albumCover: 'https://via.placeholder.com/300' },
      { id: '105', name: `${query} Acoustic`, artist: 'Indie Artist', albumCover: 'https://via.placeholder.com/300' }
    ];
    
    res.json({ results: mockResults });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-room', (jamCode) => {
    socket.join(jamCode);
    console.log(`Client joined room: ${jamCode}`);
    
    // Send current playlist to the newly joined client
    if (playlists[jamCode]) {
      socket.emit('playlist-updated', { 
        jamCode, 
        playlist: playlists[jamCode] 
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create a separate server for Spotify callback
if (PORT !== 8888) {
  const callbackApp = express();
  callbackApp.use(cors());
  
  // Handle Spotify callback
  callbackApp.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).send('Authorization code is required');
    }
    
    try {
      // Exchange code for access token
      const data = await spotifyApi.authorizationCodeGrant(code);
      
      // Get user profile to use as ID
      spotifyApi.setAccessToken(data.body['access_token']);
      const userProfile = await spotifyApi.getMe();
      const userId = userProfile.body.id;
      const displayName = userProfile.body.display_name || userProfile.body.id;
      
      // Store tokens
      userTokens[userId] = {
        accessToken: data.body['access_token'],
        refreshToken: data.body['refresh_token'],
        expiresAt: Date.now() + (data.body['expires_in'] * 1000),
        displayName: displayName
      };
      
      // Redirect to frontend with user ID and display name
      res.redirect(`http://localhost:3000/auth-success?userId=${userId}&displayName=${encodeURIComponent(displayName)}`);
    } catch (error) {
      console.error('Error during authorization code exchange:', error);
      res.redirect('http://localhost:3000/auth-error');
    }
  });
  
  callbackApp.listen(8888, () => {
    console.log('Spotify callback server running on port 8888');
  });
}
