import React from 'react';
import TeamForm from '../components/TeamForm';
import UserForm from '../components/UserForm';
import { useTeamContext } from '../context/TeamContext';

const TeamsPage: React.FC = () => {
  const { teams, getTeamUsers } = useTeamContext();
  
  return (
    <div className="teams-page">
      <h1>Ekip ve Kullanıcı Yönetimi</h1>
      
      <div className="forms-container">
        <div className="team-form">
          <TeamForm />
        </div>
        
        <div className="user-form">
          <UserForm />
        </div>
      </div>
      
      <div className="teams-list">
        <h2>Mevcut Ekipler</h2>
        {teams.length === 0 ? (
          <p>Henüz ekip bulunmamaktadır.</p>
        ) : (
          <div className="teams-grid">
            {teams.map(team => {
              const teamUsers = getTeamUsers(team.id);
              
              return (
                <div key={team.id} className="team-card">
                  <h3>{team.name}</h3>
                  <p>{team.description}</p>
                  <p>Oluşturulma: {team.createdAt.toLocaleDateString()}</p>
                  
                  <div className="team-users">
                    <h4>Kullanıcılar ({teamUsers.length})</h4>
                    {teamUsers.length === 0 ? (
                      <p>Bu ekipte henüz kullanıcı bulunmamaktadır.</p>
                    ) : (
                      <ul>
                        {teamUsers.map(user => (
                          <li key={user.id}>
                            <strong>{user.name}</strong> - {user.role}
                            <div className="user-email">{user.email}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;