import React from 'react';
import styled from 'styled-components';

interface NodeProps {
	x: number | undefined;
	y: number | undefined;
	backgroundImage: string;
	size: number;
}

const NodeContainer = styled.div<{ x: number | undefined; y: number | undefined; backgroundImage: string; size: number }>`
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background: ${({ backgroundImage }) => `url(${backgroundImage})`};
`;

const Node: React.FC<NodeProps> = ({ x, y, backgroundImage, size }) => {

	return (
		<NodeContainer
			x={x}
			y={y}
			backgroundImage={backgroundImage}
			size={size}
		/>
	);
};

export default Node;