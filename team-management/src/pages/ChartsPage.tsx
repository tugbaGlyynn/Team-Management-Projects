import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTeamContext } from '../context/TeamContext';

const ChartsPage: React.FC = () => {
  const { teams, getTeamUsers } = useTeamContext();
  
  const teamUserCounts = teams.map(team => {
    const userCount = getTeamUsers(team.id).length;
    return {
      name: team.name,
      count: userCount
    };
  });
  

  const { users } = useTeamContext();
  const roleData: { [key: string]: number } = {};
  
  users.forEach(user => {
    if (roleData[user.role]) {
      roleData[user.role] += 1;
    } else {
      roleData[user.role] = 1;
    }
  });
  
  const pieChartData = Object.keys(roleData).map(role => ({
    name: role,
    value: roleData[role]
  }));
  

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  return (
    <div className="charts-page">
      <h1>Ekip ve Kullanıcı Grafikleri</h1>
      
      <div className="charts-container">
        <div className="chart-box">
          <h2>Ekip Başına Kullanıcı Sayısı</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={teamUserCounts}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Kullanıcı Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-box">
          <h2>Rol Dağılımı</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;