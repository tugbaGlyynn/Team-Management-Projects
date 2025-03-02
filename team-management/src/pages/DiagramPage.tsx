import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTeamContext } from '../context/TeamContext';
import { User } from '../types';


const TeamNode = ({ data }: { data: any }) => {
  return (
    <div 
      className="team-node"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        data.onRightClick(data.id);
      }}
    >
      <div className="team-header">{data.name}</div>
      <div className="team-body">
        <p>{data.description}</p>
        <small>Oluşturulma: {new Date(data.createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  );
};

const UserNode = ({ data }: { data: any }) => {
  return (
    <div 
      className="user-node"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        data.onRightClick(data.id);
      }}
    >
      <div className="user-header">{data.name}</div>
      <div className="user-body">
        <p>Rol: {data.role}</p>
        <small>{data.email}</small>
      </div>
    </div>
  );
};

const DiagramPage: React.FC = () => {
  const { teams, users, getDiagramElements, removeUser } = useTeamContext();
  const [showTeamUsers, setShowTeamUsers] = useState<{[key: string]: boolean}>({});
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    nodeId: string;
    nodeType: 'team' | 'user' | null;
  }>({
    show: false,
    x: 0,
    y: 0,
    nodeId: '',
    nodeType: null
  });
  
 
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  

  const nodeTypes: NodeTypes = {
    team: TeamNode,
    user: UserNode
  };
  

  const updateDiagram = useCallback(() => {
   
    const { nodes: contextNodes, edges: contextEdges } = getDiagramElements();
  
    const filteredNodes = contextNodes.filter(node => {
 
      if (node.type === 'team') {
        return true;
      }
      
      if (node.type === 'user') {
        const userData = node.data as User;
        return showTeamUsers[userData.teamId] === true;
      }
      
      return true;
    });
    
    const nodesWithHandlers = filteredNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onRightClick: (nodeId: string) => handleNodeRightClick(nodeId, node.type as 'team' | 'user')
      }
    }));
    
    const filteredEdges = contextEdges.filter(edge => {
      const targetNode = filteredNodes.find(node => node.id === edge.target);
      return targetNode !== undefined;
    });
    
    setNodes(nodesWithHandlers as Node[]);
    setEdges(filteredEdges as Edge[]);
  }, [getDiagramElements, showTeamUsers, setNodes, setEdges]);
  
  const handleNodeRightClick = (nodeId: string, nodeType: 'team' | 'user') => {
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    
    if (reactFlowBounds) {
      const x = (event as MouseEvent).clientX - reactFlowBounds.left;
      const y = (event as MouseEvent).clientY - reactFlowBounds.top;
      
      setContextMenu({
        show: true,
        x,
        y,
        nodeId,
        nodeType
      });
    }
  };
  
  // Sağ tık menüsünü kapat
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, show: false }));
  };
  
  // Sağ tık menüsünde ekip kullanıcılarını göster/gizle
  const toggleTeamUsers = (teamId: string) => {
    setShowTeamUsers(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
    closeContextMenu();
  };
  
  // Sağ tık menüsünde kullanıcıyı sil
  const handleRemoveUser = (userId: string) => {
    removeUser(userId);
    closeContextMenu();
  };
  
  // Sayfa yüklenir yüklenmez diyagramı oluştur
  React.useEffect(() => {
    updateDiagram();
  }, [updateDiagram, teams, users]);
  
  // Herhangi bir yere tıklandığında context menüyü kapat
  React.useEffect(() => {
    const handleClick = () => {
      if (contextMenu.show) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu]);
  
  return (
    <div className="diagram-page">
      <h1>Ekip ve Kullanıcı Diyagramı</h1>
      
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '70vh', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right">
            <button className="refresh-btn" onClick={updateDiagram}>
              Diyagramı Yenile
            </button>
          </Panel>
        </ReactFlow>
        
        {/* Sağ tık menüsü */}
        {contextMenu.show && (
          <div 
            className="context-menu"
            style={{
              position: 'absolute',
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
              zIndex: 1000
            }}
          >
            {contextMenu.nodeType === 'team' && (
              <button 
                onClick={() => toggleTeamUsers(contextMenu.nodeId)}
                className="context-menu-item"
              >
                {showTeamUsers[contextMenu.nodeId] ? 'Kullanıcıları Gizle' : 'Kullanıcıları Göster'}
              </button>
            )}
            
            {contextMenu.nodeType === 'user' && (
              <button 
                onClick={() => handleRemoveUser(contextMenu.nodeId)}
                className="context-menu-item"
              >
                Kullanıcıyı Sil
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagramPage;