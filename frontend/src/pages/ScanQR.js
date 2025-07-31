import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import QrReader from 'react-qr-scanner';
import axios from 'axios';

const ScanQR = ({ setJamSession, joinJamSession }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle QR code scan
  const handleScan = async (data) => {
    if (data && data.text && !isLoading) {
      setScanning(false);
      setIsLoading(true);
      
      try {
        const jamCode = data.text;
        const response = await axios.post('http://localhost:5000/api/join-jam', { jamCode });
        
        if (response.data.success) {
          setJamSession({
            code: jamCode,
            name: response.data.playlist.name
          });
          
          joinJamSession(jamCode);
          navigate('/playlist');
        }
      } catch (err) {
        console.error('Error joining jam:', err);
        setError(err.response?.data?.error || t('common.error'));
        setScanning(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle QR scanner errors
  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    
    if (err.name === 'NotAllowedError') {
      setPermissionDenied(true);
    } else {
      setError(t('common.error'));
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setScanning(true);
    setError('');
    setPermissionDenied(false);
  };

  return (
    <ScanContainer>
      <JukeboxContainer className="jukebox-container">
        <Title>{t('scan.title')}</Title>
        
        {permissionDenied ? (
          <PermissionDenied>
            <ErrorIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ErrorIcon>
            <ErrorMessage>{t('scan.permissionDenied')}</ErrorMessage>
            <Button onClick={resetScanner} className="vintage-button">
              {t('scan.tryAgain')}
            </Button>
          </PermissionDenied>
        ) : (
          <>
            <ScannerContainer>
              {scanning && (
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '100%' }}
                  constraints={{
                    video: { facingMode: 'environment' }
                  }}
                />
              )}
              
              {isLoading && (
                <LoadingOverlay>
                  <LoadingSpinner />
                  <LoadingText>{t('common.loading')}</LoadingText>
                </LoadingOverlay>
              )}
              
              <ScannerFrame />
            </ScannerContainer>
            
            <ScanInstructions>{t('scan.instruction')}</ScanInstructions>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </>
        )}
        
        <ManualButton onClick={() => navigate('/')} className="vintage-button">
          {t('scan.enterManually')}
        </ManualButton>
      </JukeboxContainer>
    </ScanContainer>
  );
};

const ScanContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
`;

const JukeboxContainer = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const ScannerContainer = styled.div`
  aspect-ratio: 1;
  background: #000;
  border-radius: ${props => props.theme.borders.radius.medium};
  margin: 0 auto 20px;
  max-width: 300px;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const ScannerFrame = styled.div`
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.small};
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.5);
  height: 70%;
  left: 15%;
  position: absolute;
  top: 15%;
  width: 70%;
  z-index: 10;
  
  &::before, &::after {
    content: '';
    height: 20px;
    position: absolute;
    width: 20px;
  }
  
  &::before {
    border-left: 4px solid ${props => props.theme.colors.accent};
    border-top: 4px solid ${props => props.theme.colors.accent};
    left: -2px;
    top: -2px;
  }
  
  &::after {
    border-right: 4px solid ${props => props.theme.colors.accent};
    border-bottom: 4px solid ${props => props.theme.colors.accent};
    bottom: -2px;
    right: -2px;
  }
`;

const ScanInstructions = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 15px;
  width: 100%;
`;

const ManualButton = styled.button`
  margin-top: 15px;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
`;

const PermissionDenied = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 0;
`;

const ErrorIcon = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: 15px;
`;

const LoadingOverlay = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 20;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  height: 40px;
  margin-bottom: 10px;
  width: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

export default ScanQR;
