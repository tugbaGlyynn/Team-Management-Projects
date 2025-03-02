
export interface User {
    id: string;
    name: string;
    email: string;
    teamId: string;
    role: string;
  }
  

  export interface Team {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  }
 
  export interface TeamNode {
    id: string;
    type: 'team' | 'user';
    data: Team | User;
    position: {
      x: number;
      y: number;
    };
  }
  
  export interface TeamEdge {
    id: string;
    source: string;
    target: string;
  }
  
  export interface TeamFormData {
    name: string;
    description: string;
  }
  
  export interface UserFormData {
    name: string;
    email: string;
    teamId: string;
    role: string;
  }