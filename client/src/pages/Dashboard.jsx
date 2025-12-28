import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layout, Trash2, Edit3, LogOut, Clock, Layers, Copy, Globe, Lock, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'templates'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('New Project');
  const [isNewProjectPublic, setIsNewProjectPublic] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      if (activeTab === 'projects') {
        const response = await api.get('/projects');
        setProjects(response.data);
      } else {
        const response = await api.get('/templates');
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await api.post('/projects', {
        name: newProjectName,
        theme: 'light',
        layout: [],
        isPublic: isNewProjectPublic
      });
      setShowCreateModal(false);
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleCloneTemplate = async (e, templateId) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/projects/${templateId}/clone`);
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Failed to clone template:', error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
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

  const displayedItems = activeTab === 'projects' ? projects : templates;

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
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-slate-400 mt-2 text-lg">Manage your designs and browse community templates</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-3 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 p-1 bg-white/5 w-fit rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'templates' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Community Templates
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-3xl mt-8">
            <Layout className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium text-lg">
              {activeTab === 'projects' ? 'No projects yet' : 'No templates found'}
            </p>
            {activeTab === 'projects' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-indigo-400 font-medium mt-2 hover:text-indigo-300 transition-colors"
              >
                Start designing now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {displayedItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => activeTab === 'projects' ? navigate(`/editor/${item._id}`) : null}
                className={`group bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all relative overflow-hidden ${activeTab === 'projects' ? 'cursor-pointer' : ''}`}
              >
                {/* Visual Hint */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 blur-[40px] rounded-full group-hover:bg-indigo-600/20 transition-all"></div>

                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-600/20 transition-all">
                    <Layers className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                  </div>

                  {activeTab === 'projects' ? (
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleCloneTemplate(e, item._id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                    >
                      <Copy className="w-3 h-3" />
                      Use Template
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                  {item.isPublic && activeTab === 'projects' && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">Public</span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4" />
                    <span>{item.layout.length} sections</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create Project</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="My Awesome Site"
                    autoFocus
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-400">Visibility</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsNewProjectPublic(false)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${!isNewProjectPublic ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      <Lock className="w-6 h-6" />
                      <span className="font-bold text-sm">Private</span>
                    </button>
                    <button
                      onClick={() => setIsNewProjectPublic(true)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${isNewProjectPublic ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      <Globe className="w-6 h-6" />
                      <span className="font-bold text-sm">Public</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isNewProjectPublic
                      ? "Public projects are visible to everyone in the 'Community Templates' tab. Others can use them as a template."
                      : "Private projects are only visible to you."}
                  </p>
                </div>

                <button
                  onClick={handleCreateProject}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
