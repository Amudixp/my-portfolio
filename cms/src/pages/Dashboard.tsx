import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { 
  Users, 
  Code2, 
  Briefcase, 
  Award 
} from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    skills: 0,
    awards: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, expRes, skillsRes, awardsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/experiences'),
          api.get('/skills'),
          api.get('/awards')
        ]);
        
        setStats({
          projects: projRes.data.length || 0,
          experiences: expRes.data.length || 0,
          skills: skillsRes.data.length || 0,
          awards: awardsRes.data.length || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Projects', value: stats.projects, icon: Code2, color: 'bg-blue-500' },
    { name: 'Experiences', value: stats.experiences, icon: Briefcase, color: 'bg-green-500' },
    { name: 'Skill Categories', value: stats.skills, icon: Award, color: 'bg-yellow-500' },
    { name: 'Awards', value: stats.awards, icon: Users, color: 'bg-purple-500' },
  ];

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-opacity-100 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome back!</h2>
        <p className="text-gray-600">
          This CMS allows you to manage all the dynamic content on your portfolio. Use the sidebar to navigate to different sections and update your data. Changes will reflect immediately on your live portfolio once saved.
        </p>
      </div>
    </div>
  );
}
