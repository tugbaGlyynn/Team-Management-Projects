import React, { createContext, useContext, useState } from 'react';
import { Team, User, TeamNode, TeamEdge } from '../types';

interface TeamContextType {
  teams: Team[];
  users: User[];
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (userId: string) => void;
  getTeamUsers: (teamId: string) => User[];
  getDiagramElements: () => { nodes: TeamNode[], edges: TeamEdge[] };
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  
  if (!context) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  
  return context;
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);


  const addTeam = (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      ...teamData,
      createdAt: new Date()
    };
    
    setTeams([...teams, newTeam]);
  };
  

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
    };
    
    setUsers([...users, newUser]);
  };
  

  const removeUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };
  

  const getTeamUsers = (teamId: string) => {
    return users.filter(user => user.teamId === teamId);
  };
  

  const getDiagramElements = () => {
    const nodes: TeamNode[] = [];
    const edges: TeamEdge[] = [];
    

    teams.forEach((team, index) => {
      nodes.push({
        id: team.id,
        type: 'team',
        data: team,
        position: { x: 250, y: index * 200 }
      });
    });
    

    users.forEach((user, index) => {
      const teamIndex = teams.findIndex(team => team.id === user.teamId);
      if (teamIndex !== -1) {
        const userNode: TeamNode = {
          id: user.id,
          type: 'user',
          data: user,
          position: { x: 500, y: teamIndex * 200 + (index % 3) * 50 }
        };
        
        nodes.push(userNode);
        
     
        const userTeam = teams.find(t => t.id === user.teamId);
        
     
        if (userTeam) {
          edges.push({
            id: `edge-${userTeam.id}-${user.id}`,
            source: user.teamId,
            target: user.id
          });
        }
      }
    });
    
    return { nodes, edges };
  };
  
  const value = {
    teams,
    users,
    addTeam,
    addUser,
    removeUser,
    getTeamUsers,
    getDiagramElements
  };
  
  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};