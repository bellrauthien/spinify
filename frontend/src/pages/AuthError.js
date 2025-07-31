import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AuthError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home after a delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <AuthErrorContainer>
      <JukeboxContainer className="jukebox-container">
        <Title>{t('auth.error')}</Title>
        <ErrorIcon>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ErrorIcon>
        <Message>{t('auth.errorMessage')}</Message>
        <RedirectMessage>{t('auth.redirecting')}</RedirectMessage>
      </JukeboxContainer>
    </AuthErrorContainer>
  );
};

const AuthErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
`;

const JukeboxContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  color: ${props => props.theme.colors.error};
  margin: 20px auto;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const RedirectMessage = styled.p`
  color: ${props => props.theme.colors.accent};
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 30px;
`;

export default AuthError;
