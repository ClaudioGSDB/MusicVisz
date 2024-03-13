// Graph.tsx
import React, { useState } from 'react';
import Node from './CircleNode';
import styled from 'styled-components';

const GraphContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Graph = () => {
	const [nodes, setNodes] = useState([
		{ x: 100, y: 100, size: 50, backgroundImage: 'https://via.placeholder.com/50' },
	]);

	const addNode = () => {
		const newNode = {
			x: Math.random() * (window.innerWidth - 100),
			y: Math.random() * (window.innerHeight - 100),
			size: 50,
			backgroundImage: 'https://via.placeholder.com/50',
		};
		setNodes([...nodes, newNode]);
	};

	return (
		<GraphContainer>
			{nodes.map((node, index) => (
				<Node
					key={index}
					x={node.x}
					y={node.y}
					size={node.size}
					backgroundImage={node.backgroundImage}
				/>
			))}
			<button onClick={addNode}>Add Node</button>
		</GraphContainer>
	);
};

export default Graph;