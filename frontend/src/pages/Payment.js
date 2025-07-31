import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import axios from 'axios';

const Payment = ({ userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('User ID is missing');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // This is a mock payment - in a real app, you would integrate with a payment processor
      const response = await axios.post('http://localhost:5000/api/process-payment', { userId });
      
      if (response.data.success) {
        setPaymentSuccess(true);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle return to playlist
  const handleReturnToPlaylist = () => {
    navigate('/playlist');
  };

  return (
    <PaymentContainer>
      <JukeboxContainer className="jukebox-container">
        <Title>{t('payment.title')}</Title>
        
        {paymentSuccess ? (
          <SuccessContainer>
            <SuccessIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SuccessIcon>
            <SuccessText>{t('payment.paymentSuccess')}</SuccessText>
            <Button onClick={handleReturnToPlaylist} className="vintage-button">
              {t('payment.returnToPlaylist')}
            </Button>
          </SuccessContainer>
        ) : (
          <>
            <Description>{t('payment.description')}</Description>
            <MockNotice>{t('payment.mockPayment')}</MockNotice>
            
            <PaymentForm onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="cardNumber">{t('payment.cardNumber')}</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength="19"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="cardholderName">{t('payment.cardholderName')}</Label>
                <Input
                  id="cardholderName"
                  name="cardholderName"
                  type="text"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="expiryDate">{t('payment.expiryDate')}</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                    maxLength="5"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="cvv">{t('payment.cvv')}</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                    maxLength="3"
                  />
                </FormGroup>
              </FormRow>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <Button type="submit" className="vintage-button" disabled={isProcessing}>
                {isProcessing ? t('common.loading') : t('payment.payNow')}
              </Button>
            </PaymentForm>
          </>
        )}
      </JukeboxContainer>
    </PaymentContainer>
  );
};

const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Description = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  margin-bottom: 20px;
  text-align: center;
`;

const MockNotice = styled.p`
  color: ${props => props.theme.colors.accent};
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 20px;
  text-align: center;
`;

const PaymentForm = styled.form`
  margin: 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  
  ${FormGroup} {
    flex: 1;
  }
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

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
`;

const SuccessContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 0;
`;

const SuccessIcon = styled.div`
  color: ${props => props.theme.colors.success};
  margin-bottom: 15px;
`;

const SuccessText = styled.p`
  color: ${props => props.theme.colors.success};
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
`;

export default Payment;
