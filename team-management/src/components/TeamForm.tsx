import React, { useState } from 'react';
import { useTeamContext } from '../context/TeamContext';

const TeamForm: React.FC = () => {
  const { addTeam } = useTeamContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setFeedback({ 
        message: 'Ekip adı boş olamaz!', 
        type: 'error' 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      addTeam({
        name,
        description
      });
      
  
      setName('');
      setDescription('');
      setIsSubmitting(false);
      

      setFeedback({ 
        message: 'Ekip başarıyla oluşturuldu!', 
        type: 'success' 
      });
      
  
      setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 3000);
    }, 500);
  };
  
  return (
    <div className="form-container">
      <h2>Yeni Ekip Oluştur</h2>
      
      {feedback.message && (
        <div className={`feedback-message ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Ekip Adı</label>
          <input
            type="text"
            id="teamName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ekip adını girin"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="teamDescription">Açıklama</label>
          <textarea
            id="teamDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ekip hakkında kısa bir açıklama yazın"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Oluşturuluyor...' : 'Ekip Oluştur'}
        </button>
      </form>
    </div>
  );
};

export default TeamForm;