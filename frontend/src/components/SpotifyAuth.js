import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import axios from 'axios';

const SpotifyAuth = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      const userId = localStorage.getItem('spinify_spotify_user_id');
      
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/status?userId=${userId}`);
          
          if (response.data.authenticated) {
            setIsAuthenticated(true);
            if (onLoginSuccess) onLoginSuccess(userId);
          }
        } catch (err) {
          console.error('Error checking auth status:', err);
        }
      }
    };
    
    checkAuthStatus();
  }, [onLoginSuccess]);
  
  // Handle login with Spotify
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:5000/api/auth/spotify');
      
      if (response.data.url) {
        // Redirect to Spotify authorization page
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Error initiating Spotify auth:', err);
      setError(t('auth.errorInitiating'));
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('spinify_spotify_user_id');
    setIsAuthenticated(false);
    if (onLoginSuccess) onLoginSuccess(null);
  };
  
  return (
    <AuthContainer>
      {isAuthenticated ? (
        <LogoutButton onClick={handleLogout}>
          {t('auth.logout')}
        </LogoutButton>
      ) : (
        <LoginButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <SpotifyIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.66 0 12 0ZM17.521 17.34C17.281 17.699 16.861 17.82 16.5 17.58C13.68 15.84 10.14 15.479 5.939 16.439C5.521 16.561 5.16 16.26 5.04 15.9C4.92 15.479 5.22 15.12 5.58 15C10.14 13.979 14.1 14.4 17.279 16.32C17.639 16.5 17.699 16.979 17.521 17.34ZM18.961 14.04C18.66 14.46 18.12 14.64 17.699 14.34C14.46 12.36 9.54 11.76 5.76 12.9C5.281 13.08 4.74 12.84 4.56 12.36C4.38 11.88 4.62 11.34 5.1 11.16C9.48 9.9 14.939 10.56 18.66 12.84C19.02 13.08 19.26 13.68 18.961 14.04ZM19.081 10.68C15.24 8.4 8.82 8.16 5.16 9.36C4.56 9.54 3.96 9.18 3.78 8.64C3.6 8.04 3.96 7.44 4.5 7.26C8.76 5.88 15.78 6.12 20.22 8.76C20.76 9.06 20.94 9.78 20.64 10.32C20.34 10.8 19.62 10.98 19.081 10.68Z" fill="currentColor"/>
                </svg>
              </SpotifyIcon>
              {t('auth.loginWithSpotify')}
            </>
          )}
        </LoginButton>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </AuthContainer>
  );
};

const AuthContainer = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const LoginButton = styled.button`
  align-items: center;
  background-color: #1DB954;
  border: none;
  border-radius: ${props => props.theme.borders.radius.medium};
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  padding: 12px 24px;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background-color: #1ED760;
    transform: translateY(-2px);
  }
  
  &:active {
    background-color: #1AA34A;
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: #1DB95480;
    cursor: not-allowed;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.medium};
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: 10px 20px;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background: ${props => props.theme.colors.primary}20;
  }
`;

const SpotifyIcon = styled.span`
  margin-right: 10px;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid white;
  height: 20px;
  width: 20px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default SpotifyAuth;
