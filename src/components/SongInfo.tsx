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
  z-index: 101;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 7%;
    border-radius: 20px 20px 0 0;
  }
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

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`;


const AlbumCoverContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const AlbumCover = styled.img`
  width: 50%;
  height: auto;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 8px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.7);
  transition: transform 0.5s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const KeyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #121212;
  padding: 10px;
  border-radius: 10px;
  margin-left: 10px;

  @media (max-width: 768px) {
    padding: 5%;
    margin-left: 5%;
    width: 80px
  }
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

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
`;

const KeyText = styled.p`
  color: white;
  margin-left: 4px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #282828;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
`;

const AttributesList = styled.ul`
  list-style-type: none;
  background-color: #121212;
  padding: 20px;
  border-radius: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 10px;
    margin-bottom: 0px;
  }
`;

const AttributeItem = styled.li`
  font-size: 16px;
  margin-bottom: 10px;
  position: relative;

  &:hover {
    ${Tooltip} {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 5px;
  }
`;

const ArtistName = styled.p`
  font-size: 14px;
  margin-top: -10px;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: -5px;
  }
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

  @media (max-width: 768px) {
    height: 12px;
  }
`;


const SongTitle = styled.h2<{ $longName: boolean }>`
  margin-top: 0;
  font-size: ${({ $longName }) => ($longName ? '28px' : '32px')};

  @media (max-width: 768px) {
    font-size: ${({ $longName }) => ($longName ? '20px' : '24px')};
  }
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
          <Tooltip>
            Acousticness: {(Number(audioFeatures.acousticness.toFixed(2)) * 100).toFixed(0)}%

            <br />
            A confidence measure of whether the track <br></br>is acoustic.
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Danceability
          <AttributeBar value={normalizeValue(audioFeatures.danceability, 0, 1)} />
          <Tooltip>
            Danceability: {(Number(audioFeatures.danceability.toFixed(2)) * 100).toFixed(0)}%
            <br />
            How suitable a track is for dancing.
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Energy
          <AttributeBar value={normalizeValue(audioFeatures.energy, 0, 1)} />
          <Tooltip>
            Energy: {(Number(audioFeatures.energy.toFixed(2)) * 100).toFixed(0)}%
            <br />
            Perceptual measure of intensity and activity.
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Instrumentalness
          <AttributeBar value={normalizeValue(audioFeatures.instrumentalness, 0, 1)} />
          <Tooltip>
            Instrumentalness: {(Number(audioFeatures.instrumentalness.toFixed(2)) * 100).toFixed(0)}%
            <br />
            Predicts whether a track contains no vocals.
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Loudness
          <AttributeBar value={normalizeValue(audioFeatures.loudness, -27, 0)} />
          <Tooltip>
            Loudness: {audioFeatures.loudness.toFixed(2)} dB
            <br />
            Overall loudness of a track in decibels (dB).
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Speechiness
          <AttributeBar value={normalizeValue(audioFeatures.speechiness, 0, 1)} />
          <Tooltip>
            Speechiness: {(Number(audioFeatures.speechiness.toFixed(2)) * 100).toFixed(0)}%
            <br />
            Presence of spoken words in a track.
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Tempo
          <AttributeBar value={normalizeValue(audioFeatures.tempo, 55, 235)} />
          <Tooltip>
            Tempo: {audioFeatures.tempo.toFixed(0)} BPM
            <br />
            Overall estimated tempo of a track in <br></br>beats per minute (BPM).
          </Tooltip>
        </AttributeItem>
        <AttributeItem>
          Valence
          <AttributeBar value={normalizeValue(audioFeatures.valence, 0, 1)} />
          <Tooltip>
            Valence: {(Number(audioFeatures.valence.toFixed(2)) * 100).toFixed(0)}%
            <br />
            Musical positiveness conveyed by a track.
          </Tooltip>
        </AttributeItem>
      </AttributesList>
    </SongInfoContainer>
  );
};

export default SongInfo;