// LoginPage.tsx
import styled from 'styled-components';
import Particles from './components/Particle';


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
`;

const SpotifyLogo = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 10px;
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
  // background: linear-gradient(180deg, #1DB954 0%, #535353 75%, #535353 100%);
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
`;

const Slang = styled.div`
font-size: 24px;
margin-bottom: 12px;
color: #B3B3B3;
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
        <Slang> Welcome to <b>MusicVisz</b>!<br></br> Click the login button below to get started and see your personalized Spotify visualizations.</Slang>
        <LoginButton onClick={handleLogin}>
          <SpotifyLogo src='./assets/Spotify_Logo.png' alt="Spotify Logo" />
          Login With Spotify
        </LoginButton>
      </LoginContent>
    </LoginContainer>
  );
};

export default LoginPage;
