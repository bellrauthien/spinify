import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import axios from 'axios';
import SpotifyAuth from '../components/SpotifyAuth';

const Home = ({ setJamSession, joinJamSession, spotifyUserId, onSpotifyLoginSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jamCode, setJamCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle joining a jam session
  const handleJoinJam = async (e) => {
    e.preventDefault();
    
    if (!jamCode.trim()) {
      setError(t('home.enterValidCode'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Get user name from Spotify authentication if available
      const userName = localStorage.getItem('spinify_user_display_name') || '';
      
      // Include spotifyUserId and userName if available
      const payload = { 
        jamCode,
        userId: spotifyUserId || `user_${Math.random().toString(36).substr(2, 9)}`,
        userName: userName
      };
      
      const response = await axios.post('http://localhost:5000/api/join-jam', payload);
      
      if (response.data.success) {
        // Include jam info with owner details
        setJamSession({
          code: jamCode,
          name: response.data.playlist.name,
          owner: response.data.jamInfo?.owner || "Leo",
          users: response.data.jamInfo?.users || 1,
          isOwner: response.data.jamInfo?.isOwner || false
        });
        
        joinJamSession(jamCode);
        navigate('/playlist');
      }
    } catch (err) {
      console.error('Error joining jam:', err);
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HomeContainer>
      <JukeboxContainer className="jukebox-container">
        <RecordImage className="spinning-record">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#111" stroke="#333" strokeWidth="2" />
            <circle cx="50" cy="50" r="20" fill="#333" stroke="#444" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" fill="#555" stroke="#666" strokeWidth="1" />
            <circle cx="50" cy="50" r="2" fill="#777" />
            <path d="M50,5 L50,20 M50,80 L50,95 M5,50 L20,50 M80,50 L95,50" stroke="#444" strokeWidth="1" />
          </svg>
        </RecordImage>
        
        <Form onSubmit={handleJoinJam}>
          <FormGroup>
            <Label htmlFor="jamCode">{t('home.enterCode')}</Label>
            <Input
              id="jamCode"
              type="text"
              value={jamCode}
              onChange={(e) => setJamCode(e.target.value)}
              placeholder={t('home.jamCodePlaceholder')}
              required
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" className="vintage-button" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('home.joinJam')}
          </Button>
        </Form>
        
        <ScanButton onClick={() => navigate('/scan')} className="vintage-button">
          {t('home.scanQR')}
        </ScanButton>
        
        <SpotifyAuthSection>
          <AuthDivider>
            <DividerLine />
            <DividerText>{t('auth.connectWithSpotify')}</DividerText>
            <DividerLine />
          </AuthDivider>
          <SpotifyAuth onLoginSuccess={onSpotifyLoginSuccess} />
        </SpotifyAuthSection>
      </JukeboxContainer>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px 20px 80px;
  position: relative;
`;

const JukeboxContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 2.2rem;
  margin-bottom: 5px;
  text-align: center;
`;

const Tagline = styled.p`
  color: ${props => props.theme.colors.accent};
  font-size: 1rem;
  margin-bottom: 10px;
  text-align: center;
`;

const RecordImage = styled.div`
  margin: 20px 0;
  width: 120px;
`;

const Form = styled.form`
  margin-bottom: 15px;
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.medium};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  padding: 12px 15px;
  width: 100%;
  
  &:focus {
    border-color: ${props => props.theme.colors.accent};
    outline: none;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  width: 100%;
`;

const ScanButton = styled.button`
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
`;

const SpotifyAuthSection = styled.div`
  margin-top: 15px;
  margin-bottom: 120px;
`;

const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${props => props.theme.colors.text}40;
`;

const DividerText = styled.span`
  color: ${props => props.theme.colors.text}80;
  font-size: 0.9rem;
  margin: 0 10px;
  white-space: nowrap;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
`;

export default Home;
