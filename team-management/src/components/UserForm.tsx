import React, { useState, useEffect } from 'react';
import { useTeamContext } from '../context/TeamContext';

const UserForm: React.FC = () => {
  const { teams, addUser } = useTeamContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamId, setTeamId] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  

  useEffect(() => {
    if (teams.length === 1 && !teamId) {
      setTeamId(teams[0].id);
    }
  }, [teams, teamId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !teamId || !role.trim()) {
      setFeedback({ 
        message: 'Lütfen tüm alanları doldurun!', 
        type: 'error' 
      });
      return;
    }
    
    setIsSubmitting(true);
    

    setTimeout(() => {
      addUser({
        name,
        email,
        teamId,
        role
      });
      

      setName('');
      setEmail('');
      setTeamId(teams.length === 1 ? teams[0].id : '');
      setRole('');
      setIsSubmitting(false);
      

      setFeedback({ 
        message: 'Kullanıcı başarıyla eklendi!', 
        type: 'success' 
      });
      
  
      setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 3000);
    }, 500);
  };
  

  const predefinedRoles = [
    'Geliştirici',
    'Tasarımcı',
    'Proje Yöneticisi',
    'Ürün Yöneticisi',
    'Test Uzmanı',
    'Analist',
    'Yönetici'
  ];
  
  return (
    <div className="form-container">
      <h2>Kullanıcı Ekle</h2>
      
      {feedback.message && (
        <div className={`feedback-message ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Ad Soyad</label>
          <input
            type="text"
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kullanıcının adını ve soyadını girin"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="userEmail">E-posta</label>
          <input
            type="email"
            id="userEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@firma.com"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="userTeam">Ekip</label>
          <select
            id="userTeam"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
            disabled={isSubmitting || teams.length === 0}
            className={teams.length === 0 ? 'disabled' : ''}
          >
            <option value="">-- Ekip Seçin --</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          {teams.length === 0 && (
            <div className="form-hint">
              Önce bir ekip oluşturmalısınız.
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="userRole">Rol</label>
          <div className="role-select-container">
            <select
              id="userRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">-- Rol Seçin --</option>
              {predefinedRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="custom">Özel Rol Ekle</option>
            </select>
            
            {role === 'custom' && (
              <input
                type="text"
                placeholder="Özel rol girin"
                value=""
                onChange={(e) => setRole(e.target.value)}
                className="custom-role-input"
                autoFocus
              />
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting || teams.length === 0}
        >
          {isSubmitting ? 'Ekleniyor...' : 'Kullanıcı Ekle'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;