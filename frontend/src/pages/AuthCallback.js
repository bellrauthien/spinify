import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AuthCallback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Get userId and displayName from URL query params
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const displayName = params.get('displayName');
    
    if (userId) {
      // Store the userId and displayName in localStorage
      localStorage.setItem('spinify_spotify_user_id', userId);
      
      // Store display name if available
      if (displayName) {
        localStorage.setItem('spinify_user_display_name', displayName);
      }
      
      // Redirect to home after successful authentication
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError(t('auth.errorNoUserId'));
      
      // Redirect to home after error
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [location, navigate, t]);
  
  return (
    <AuthContainer>
      <JukeboxContainer className="jukebox-container">
        {!error ? (
          <>
            <Title>{t('auth.success')}</Title>
            <SuccessIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SuccessIcon>
            <Message>{t('auth.successMessage')}</Message>
            <SpotifyLogo>
              <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 0C8.059 0 0 8.059 0 18C0 27.941 8.059 36 18 36C27.941 36 36 27.941 36 18C36 8.059 27.941 0 18 0ZM26.271 25.977C25.938 26.543 25.218 26.73 24.652 26.398C20.445 23.895 15.188 23.309 8.917 24.75C8.276 24.891 7.635 24.469 7.494 23.828C7.353 23.187 7.775 22.546 8.416 22.405C15.258 20.824 21.047 21.504 25.781 24.358C26.347 24.691 26.534 25.411 26.271 25.977ZM28.477 21.082C28.055 21.785 27.147 22.019 26.444 21.598C21.598 18.656 14.289 17.766 8.577 19.535C7.791 19.77 6.962 19.348 6.727 18.562C6.492 17.775 6.914 16.946 7.701 16.711C14.242 14.687 22.312 15.68 27.961 19.05C28.664 19.471 28.898 20.379 28.477 21.082ZM28.641 16.008C22.898 12.633 13.289 12.305 7.748 14.008C6.797 14.289 5.803 13.781 5.523 12.831C5.242 11.88 5.75 10.886 6.7 10.605C13.055 8.648 23.707 9.035 30.352 12.938C31.196 13.429 31.477 14.523 30.985 15.363C30.493 16.207 29.399 16.488 28.559 15.996L28.641 16.008Z" fill="#1ED760"/>
                <path d="M50.445 16.5C46.781 15.75 46.031 15.234 46.031 14.062C46.031 12.961 47.039 12.211 48.656 12.211C50.227 12.211 51.797 12.82 53.438 14.109C53.484 14.156 53.555 14.18 53.625 14.18C53.672 14.18 53.719 14.156 53.766 14.133L55.617 12.023C55.688 11.953 55.711 11.836 55.641 11.742C53.695 9.562 51.445 8.672 48.703 8.672C45.07 8.672 42.375 10.898 42.375 14.32C42.375 17.906 44.836 19.172 48.961 20.039C52.711 20.812 53.414 21.398 53.414 22.5C53.414 23.742 52.336 24.492 50.484 24.492C48.398 24.492 46.711 23.789 44.859 22.008C44.812 21.961 44.766 21.938 44.695 21.938C44.648 21.938 44.602 21.961 44.555 21.984L42.562 24.023C42.492 24.094 42.469 24.211 42.539 24.305C44.648 26.789 47.273 27.961 50.414 27.961C54.305 27.961 57.07 25.805 57.07 22.195C57.07 19.148 55.125 17.625 50.445 16.5ZM66.961 21.914C66.961 24.023 65.578 25.5 63.633 25.5C61.711 25.5 60.234 23.977 60.234 21.914C60.234 19.852 61.711 18.328 63.633 18.328C65.531 18.328 66.961 19.875 66.961 21.914ZM70.523 21.914C70.523 17.906 67.664 15.07 63.633 15.07C59.602 15.07 56.742 17.883 56.742 21.914C56.742 25.945 59.578 28.758 63.633 28.758C67.688 28.758 70.523 25.945 70.523 21.914ZM81.328 21.914C81.328 24.023 79.945 25.5 78 25.5C76.078 25.5 74.602 23.977 74.602 21.914C74.602 19.852 76.078 18.328 78 18.328C79.898 18.328 81.328 19.875 81.328 21.914ZM84.891 21.914C84.891 17.906 82.031 15.07 78 15.07C73.969 15.07 71.109 17.883 71.109 21.914C71.109 25.945 73.945 28.758 78 28.758C82.055 28.758 84.891 25.945 84.891 21.914ZM96.094 15.352V14.531C96.094 13.125 96.773 12.422 97.945 12.422C99.117 12.422 99.75 13.102 99.75 14.531V15.352H96.094ZM103.125 15.352V14.484C103.125 11.109 101.062 8.883 97.945 8.883C94.828 8.883 92.719 11.109 92.719 14.484V15.352H91.055C90.914 15.352 90.797 15.469 90.797 15.609V18.562C90.797 18.703 90.914 18.82 91.055 18.82H92.719V28.242C92.719 28.383 92.836 28.5 92.977 28.5H96.797C96.938 28.5 97.055 28.383 97.055 28.242V18.82H101.156L102.961 15.609C102.984 15.562 102.984 15.516 102.961 15.469C102.938 15.398 102.867 15.352 102.797 15.352H97.055V14.578C97.055 13.758 97.406 13.336 98.156 13.336C98.906 13.336 99.234 13.758 99.234 14.578V15.352H102.609C102.938 15.352 103.125 15.352 103.125 15.352ZM109.266 18.328C111.211 18.328 112.594 19.852 112.594 21.914C112.594 23.977 111.188 25.5 109.266 25.5C107.344 25.5 105.867 23.977 105.867 21.914C105.867 19.852 107.344 18.328 109.266 18.328ZM109.266 15.07C105.234 15.07 102.375 17.883 102.375 21.914C102.375 25.945 105.211 28.758 109.266 28.758C113.32 28.758 116.156 25.945 116.156 21.914C116.156 17.883 113.297 15.07 109.266 15.07Z" fill="white"/>
              </svg>
            </SpotifyLogo>
          </>
        ) : (
          <>
            <Title>{t('auth.error')}</Title>
            <ErrorIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ErrorIcon>
            <Message>{error}</Message>
          </>
        )}
      </JukeboxContainer>
    </AuthContainer>
  );
};

const AuthContainer = styled.div`
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

const SuccessIcon = styled.div`
  color: ${props => props.theme.colors.success};
  margin: 20px auto;
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

const SpotifyLogo = styled.div`
  margin: 30px auto 10px;
`;

export default AuthCallback;
