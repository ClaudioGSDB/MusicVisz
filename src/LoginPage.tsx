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
  background-color: #141414;
  color: white;
`;

const LoginContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const ParticleBackground = styled(Particles)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const LoginPage = () => {
  const handleLogin = () => {
    const clientId = '93f246bc76aa40d2bcbd870aec1d3777';
    const redirectUri = encodeURIComponent('http://localhost:5173/mainPage');
    const scopes = encodeURIComponent('user-top-read');
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`;
  };

  return (
    <LoginContainer>
      <ParticleBackground />
      <LoginContent>
        <h1>Login with Spotify</h1>
        <LoginButton onClick={handleLogin}>Login</LoginButton>
      </LoginContent>
    </LoginContainer>
  );
};

export default LoginPage;