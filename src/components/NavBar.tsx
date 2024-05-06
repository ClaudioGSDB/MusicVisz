import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Node } from './Graph';


const NavbarContainer = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  width: 80%;
  background-color: #212121;
  padding: 10px;
  display: flex;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.7);

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 20px;
  }
`;


const NavbarItem = styled.div`
  color: white;
  cursor: pointer;
  margin-right: 20px;
  margin-left: 1%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  margin-top: 12px;
  font-size: 16px;
  &:nth-child(2) {
    margin-left: 30px;
  }
  &:hover {    
    color: #1db954;
  }
`;


const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  background-color: #212121;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px;
  box-shadow: 7px 7px 7px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 30px 30px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  color: white;
  cursor: pointer;
  padding-bottom: 7px;
  padding-top: 7px;
  margin: 5px 0;
  display: flex;
  align-items: center;
  background-color: #121212;
  border-radius: 30px;
  padding-left: 15px;
  &:hover {    
    color: #1db954;
  }
`;

const DropdownItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AlbumImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const FeatureInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeatureName = styled.span`
  margin-right: 10px;
`;

const FeatureValue = styled.span`
  font-size: 12px;
`;

const MusicVisz = styled.h1`
    font-size: 32px;
    margin-right: 0px;
    margin-left: 1%;
    font-weight: bold;
    color: #1db954;
    `;

interface NavbarProps {
  nodes: Node[];
  onSelectNode: (node: Node) => void;
}

const Navbar: React.FC<NavbarProps> = ({ nodes, onSelectNode }) => {
    const [isHighestDropdownOpen, setIsHighestDropdownOpen] = useState(false);
    const [isLowestDropdownOpen, setIsLowestDropdownOpen] = useState(false);
    const highestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lowestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence'];
  
    const toggleHighestDropdown = (open: boolean) => {
      if (open) {
        setIsHighestDropdownOpen(true);
        setIsLowestDropdownOpen(false);
      } else {
        highestTimeoutRef.current = setTimeout(() => {
          setIsHighestDropdownOpen(false);
        }, 200);
      }
    };
  
    const toggleLowestDropdown = (open: boolean) => {
      if (open) {
        setIsLowestDropdownOpen(true);
        setIsHighestDropdownOpen(false);
      } else {
        lowestTimeoutRef.current = setTimeout(() => {
          setIsLowestDropdownOpen(false);
        }, 200);
      }
    };
  
    const handleDropdownItemClick = (feature: string, isHighest: boolean) => {
      const sortedNodes = [...nodes].sort((a, b) => {
        const aValue = a?.audioFeatures?.[feature] || 0;
        const bValue = b?.audioFeatures?.[feature] || 0;
        if (aValue === bValue) {
          return a.id.localeCompare(b.id); // Sort by track ID if feature values are the same
        }
        return isHighest ? bValue - aValue : aValue - bValue;
      });
      const selectedNode = sortedNodes[0];
      onSelectNode(selectedNode);
      setIsHighestDropdownOpen(false);
      setIsLowestDropdownOpen(false);
    };
  
    const handleHighestDropdownMouseEnter = () => {
      if (highestTimeoutRef.current) {
        clearTimeout(highestTimeoutRef.current);
      }
      setIsHighestDropdownOpen(true);
    };
  
    const handleLowestDropdownMouseEnter = () => {
      if (lowestTimeoutRef.current) {
        clearTimeout(lowestTimeoutRef.current);
      }
      setIsLowestDropdownOpen(true);
    };
  
    return (
        <NavbarContainer>
          <MusicVisz>MusicVisz</MusicVisz>
          <NavbarItem
            onMouseEnter={() => toggleHighestDropdown(true)}
            onMouseLeave={() => toggleHighestDropdown(false)}
          >
            Highest
            <DropdownMenu
              isOpen={isHighestDropdownOpen}
              onMouseEnter={handleHighestDropdownMouseEnter}
              onMouseLeave={() => toggleHighestDropdown(false)}
            >
          {features.map((feature) => {
            const sortedNodes = [...nodes].sort((a, b) => {
              const aValue = a?.audioFeatures?.[feature] || 0;
              const bValue = b?.audioFeatures?.[feature] || 0;
              return bValue - aValue;
            });
            const highestNode = sortedNodes[0];
            const featureValue = highestNode?.audioFeatures?.[feature];

            return (
                <DropdownItem key={`highest-${feature}`} onClick={() => handleDropdownItemClick(feature, true)}>
                <DropdownItemContent>
                  <FeatureInfo>
                    <FeatureName>{feature.charAt(0).toUpperCase() + feature.slice(1)}</FeatureName>
                    <FeatureValue>
  {featureValue !== undefined ? (
    feature !== "loudness" ? (
      `${(featureValue * 100).toFixed(0)}%`
    ) : (
      `${featureValue.toFixed(2)} db`
    )
  ) : (
    "N/A"
  )}
</FeatureValue>
                  </FeatureInfo>
                  <AlbumImage src={highestNode?.albumCoverUrl || ''} alt="Album Cover" />
                </DropdownItemContent>
              </DropdownItem>
            );
          })}
         </DropdownMenu>
      </NavbarItem>
      <NavbarItem
        onMouseEnter={() => toggleLowestDropdown(true)}
        onMouseLeave={() => toggleLowestDropdown(false)}
      >
        Lowest
        <DropdownMenu
          isOpen={isLowestDropdownOpen}
          onMouseEnter={handleLowestDropdownMouseEnter}
          onMouseLeave={() => toggleLowestDropdown(false)}
        >
          {features.map((feature) => {
            const sortedNodes = [...nodes].sort((a, b) => {
              const aValue = a?.audioFeatures?.[feature] || 0;
              const bValue = b?.audioFeatures?.[feature] || 0;
              if (aValue === bValue) {
                return a.id.localeCompare(b.id); // Sort by track ID if feature values are the same
              }
              return aValue - bValue;
            });
            const lowestNode = sortedNodes[0];
            const featureValue = lowestNode?.audioFeatures?.[feature];

            return (
              <DropdownItem key={`lowest-${feature}`} onClick={() => handleDropdownItemClick(feature, false)}>
                <DropdownItemContent>
                  <FeatureInfo>
                  <FeatureName>{feature.charAt(0).toUpperCase() + feature.slice(1)}</FeatureName>
                  <FeatureValue>
  {featureValue !== undefined ? (
    feature !== "loudness" ? (
      `${(featureValue * 100).toFixed(0)}%`
    ) : (
      `${featureValue.toFixed(2)} db`
    )
  ) : (
    "N/A"
  )}
</FeatureValue>
                  </FeatureInfo>
                  <AlbumImage src={lowestNode?.albumCoverUrl || ''} alt="Album Cover" />
                </DropdownItemContent>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </NavbarItem>
    </NavbarContainer>
  );
};

export default Navbar;