// LoginPage.tsx
import styled from 'styled-components';
import Particles from './components/Particle';
import spotifyLogo from './assets/SpotifyLogo.png';

const LoginContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
`;

const LoginContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
  max-width: 90%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #212121;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    scale: 1.05;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

const SpotifyLogo = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 10px;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

const ParticleBackground = styled(Particles)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Title = styled.h1`
  font-size: 98px;
  margin-bottom: 0px;
  font-family: 'Gill Sans', sans-serif;
  font-weight: 600;
  color: #1DB954;

  @media (max-width: 1024px) {
    font-size: 78px;
  }

  @media (max-width: 768px) {
    font-size: 58px;
  }
`;

const Slang = styled.div`
  font-size: 24px;
  margin-bottom: 12px;
  color: #B3B3B3;

  @media (max-width: 1024px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.5;
  color: #333;

  b {
    color: #000;
  }
`;

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI);
    const scopes = encodeURIComponent('user-top-read');
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`;
  };

  return (
    <LoginContainer>
      <ParticleBackground />
      <LoginContent>
        <Title>MusicVisz</Title>
        <Slang>
          Welcome to <b>MusicVisz</b>!<br />
          Click the login button below to get started and see your personalized Spotify visualizations.
        </Slang>
        <LoginButton onClick={handleLogin}>
          <SpotifyLogo src={spotifyLogo} alt="Logo" />
          Login With Spotify
        </LoginButton>
      </LoginContent>
      <FooterMessage>
        🚧 <b>App in Development Mode</b>: Unauthorized users cannot access it.  
        📩 Email <b>claudiogsdb@gmail.com</b> if interested in using it.
      </FooterMessage>
    </LoginContainer>
  );
};

export default LoginPage;
