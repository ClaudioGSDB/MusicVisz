// SongInfo.tsx
import React from 'react';
import styled from 'styled-components';
import { Node } from './Graph';

const SongInfoContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background-color: #282828;
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

const SongTitle = styled.h2`
  margin-top: 0;
`;

const AlbumCover = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-bottom: 20px;
`;

const AttributesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AttributeItem = styled.li`
  margin-bottom: 10px;
`;

interface SongInfoProps {
  node: Node;
  onClose: () => void;
}

const SongInfo: React.FC<SongInfoProps> = ({ node, onClose }) => {
  const { name, albumCoverUrl, audioFeatures } = node;

  return (
    <SongInfoContainer>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <SongTitle>{name}</SongTitle>
      <AlbumCover src={albumCoverUrl} alt="Album Cover" />
      <AttributesList>
        <AttributeItem>Acousticness: {audioFeatures.acousticness}</AttributeItem>
        <AttributeItem>Danceability: {audioFeatures.danceability}</AttributeItem>
        <AttributeItem>Energy: {audioFeatures.energy}</AttributeItem>
        <AttributeItem>Instrumentalness: {audioFeatures.instrumentalness}</AttributeItem>
        <AttributeItem>Key: {audioFeatures.key}</AttributeItem>
        <AttributeItem>Loudness: {audioFeatures.loudness}</AttributeItem>
        <AttributeItem>Mode: {audioFeatures.mode}</AttributeItem>
        <AttributeItem>Speechiness: {audioFeatures.speechiness}</AttributeItem>
        <AttributeItem>Tempo: {audioFeatures.tempo}</AttributeItem>
        <AttributeItem>Valence: {audioFeatures.valence}</AttributeItem>
      </AttributesList>
    </SongInfoContainer>
  );
};

export default SongInfo;