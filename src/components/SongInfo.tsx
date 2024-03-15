//SongInfo.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Node } from './Graph';
import ColorThief from 'colorthief';

const keyMapping = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const SongInfoContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  padding: 20px;
  color: white;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;


const AlbumCoverContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const AlbumCover = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-right: 10%;
  border-radius: 8px;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.7);
    transition: transform 0.5s ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
`;

const KeyContainer = styled.div`
    background-color: #121212;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 55px;

    `;

const KeyCircle = styled.div`
  width: 60px;
  height: 60px;
  color: #1db954;
  border-radius: 50%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 34px;
  font-weight: bold;
`;

const KeyText = styled.p`
  color: white;
  margin-left: 4px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const AttributesList = styled.ul`
  list-style-type: none;
  background-color: #121212;
  padding: 20px;
  border-radius: 10px;
`;

const AttributeItem = styled.li`
    font-size: 18px;
    margin-bottom: 10px;
`;

const ArtistName = styled.p`
    font-size: 14px;
    margin-top: -10px;
`;

const AttributeBar = styled.div<{ value: number }>`
  width: 100%;
  height: 17px;
  background-color: #555;
  margin-top: 5px;
    border-radius: 10px;

  &::after {
    content: '';
    display: block;
    width: ${({ value }) => `${value * 100}%`};
    height: 100%;
    background-color: #1db954;
    border-radius: 10px;
    transition: width 0.5s ease-in-out;
  }
`;

const SongTitle = styled.h2<{ $longName: boolean }>`
margin-top: 0;
font-size: ${({ $longName }) => ($longName ? '31px' : '32px')};
`;

interface SongInfoProps {
  node: Node;
  onClose: () => void;
}

const SongInfo: React.FC<SongInfoProps> = ({ node, onClose }) => {
  const { name, albumCoverUrl, audioFeatures } = node;
  const [backgroundColor, setBackgroundColor] = useState('#282828');

  useEffect(() => {
    const fetchBackgroundColor = async () => {
      try {
        const colorThief = new ColorThief();
        const img = new Image();
        img.src = albumCoverUrl;
        img.crossOrigin = 'Anonymous';

        img.addEventListener('load', () => {
          const color = colorThief.getColor(img);
          const hexColor = rgbToHex(color[0], color[1], color[2]);
          setBackgroundColor(hexColor);
        });
      } catch (error) {
        console.error('Error extracting dominant color:', error);
      }
    };

    fetchBackgroundColor();
  }, [albumCoverUrl]);

  const rgbToHex = (r: number, g: number, b: number) => {
    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  const normalizeValue = (value: number, min: number, max: number) => {
    return (value - min) / (max - min);
  };

  return (
    <SongInfoContainer style={{ backgroundColor }}>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <SongTitle $longName={name.length > 30}>{name}</SongTitle>
      <ArtistName>{node.artists.join(', ')}</ArtistName>
      <AlbumCoverContainer>
        <AlbumCover src={albumCoverUrl} alt="Album Cover" />
        <KeyContainer>
          <KeyText>Key</KeyText>
          <KeyCircle>{keyMapping[audioFeatures.key]}</KeyCircle>
        </KeyContainer>
      </AlbumCoverContainer>
      <AttributesList>
        <AttributeItem>
          Acousticness
          <AttributeBar value={normalizeValue(audioFeatures.acousticness, 0, 1)} />
        </AttributeItem>
        <AttributeItem>
          Danceability
          <AttributeBar value={normalizeValue(audioFeatures.danceability, 0, 1)} />
        </AttributeItem>
        <AttributeItem>
          Energy
          <AttributeBar value={normalizeValue(audioFeatures.energy, 0, 1)} />
        </AttributeItem>
        <AttributeItem>
          Instrumentalness
          <AttributeBar value={normalizeValue(audioFeatures.instrumentalness, 0, 1)} />
        </AttributeItem>
        <AttributeItem>
          Loudness
          <AttributeBar value={normalizeValue(audioFeatures.loudness, -27, 0)} />
        </AttributeItem>
        <AttributeItem>
          Speechiness
          <AttributeBar value={normalizeValue(audioFeatures.speechiness, 0, 1)} />
        </AttributeItem>
        <AttributeItem>
          Tempo
          <AttributeBar value={normalizeValue(audioFeatures.tempo, 55, 235)} />
        </AttributeItem>
        <AttributeItem>
          Valence
          <AttributeBar value={normalizeValue(audioFeatures.valence, 0, 1)} />
        </AttributeItem>
      </AttributesList>
    </SongInfoContainer>
  );
};

export default SongInfo;