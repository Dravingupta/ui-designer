import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Plus, Layout, Trash2, Edit3, LogOut, Clock, Layers } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleCreateProject = async () => {
    try {
      const response = await api.post('/projects', {
        name: 'New Project',
        theme: 'light',
        layout: []
      });
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">U</div>
          <span className="text-xl font-bold tracking-tight">UI Designer</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{user.displayName || user.email}</span>
            <span className="text-xs text-slate-500">{user.email}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-8 py-12 bg-gradient-to-b from-indigo-600/10 to-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-bold">My Projects</h1>
              <p className="text-slate-400 mt-2 text-lg">Manage your designs and technical outputs</p>
            </div>
            <button 
              onClick={handleCreateProject}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-3 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-3xl mt-8">
            <Layout className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No projects yet</p>
            <button 
              onClick={handleCreateProject}
              className="text-indigo-400 font-medium mt-2 hover:text-indigo-300 transition-colors"
            >
              Start designing now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/editor/${project._id}`)}
                className="group bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Visual Hint */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 blur-[40px] rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-600/20 transition-all">
                    <Layers className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, project._id)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                <div className="flex items-center gap-4 mt-4 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4" />
                    <span>{project.layout.length} sections</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
