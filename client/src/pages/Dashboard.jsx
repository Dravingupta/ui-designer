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
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center font-bold text-white border border-cyan-500">U</div>
          <span className="text-sm font-bold tracking-widest uppercase font-mono">Automator.UI</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-mono font-bold uppercase text-gray-400">{user.displayName || user.email}</span>
            <span className="text-[10px] font-mono text-gray-600">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-8 py-12 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl font-bold font-mono tracking-tight text-white">DASHBOARD_OVERVIEW</h1>
              <p className="text-gray-500 mt-2 text-sm font-mono">Manage instances and template configurations.</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-3 transition-all border border-cyan-500 font-mono text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Initialize_Project
            </button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 p-1 bg-white/5 w-fit rounded border border-white/5">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-2 rounded-sm font-mono text-xs font-bold uppercase transition-all ${activeTab === 'projects' ? 'bg-[#0A0A0A] text-cyan-400 border border-white/10 shadow-sm' : 'text-gray-500 hover:text-white'}`}
            >
              My_Projects
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-2 rounded-sm font-mono text-xs font-bold uppercase transition-all ${activeTab === 'templates' ? 'bg-[#0A0A0A] text-cyan-400 border border-white/10 shadow-sm' : 'text-gray-500 hover:text-white'}`}
            >
              System_Templates
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full relative z-10">
        {displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-lg mt-8 bg-white/[0.02]">
            <Layout className="w-10 h-10 text-gray-700 mb-4" />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-wide">
              {activeTab === 'projects' ? '// No_Projects_Found' : '// System_Cache_Empty'}
            </p>
            {activeTab === 'projects' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-cyan-500 font-mono text-xs mt-2 hover:text-cyan-400 transition-colors border-b border-cyan-900 hover:border-cyan-400"
              >
                INITIALIZE_NEW_PROJECT
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
                className={`group bg-[#0F0F0F] border border-white/5 rounded p-6 hover:border-cyan-500/50 hover:bg-[#151515] transition-all relative overflow-hidden ${activeTab === 'projects' ? 'cursor-pointer' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded border border-white/5 group-hover:border-cyan-500/20 group-hover:bm-cyan-900/10 transition-all">
                    <Layers className="w-5 h-5 text-gray-500 group-hover:text-cyan-400" />
                  </div>

                  {activeTab === 'projects' ? (
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-900/20 text-gray-600 hover:text-red-500 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleCloneTemplate(e, item._id)}
                      className="px-3 py-1.5 bg-cyan-900/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/30 text-[10px] font-mono font-bold rounded shadow-lg transition-all flex items-center gap-2 uppercase"
                    >
                      <Copy className="w-3 h-3" />
                      Fork
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-mono tracking-tight">{item.name}</h3>
                  {item.isPublic && activeTab === 'projects' && (
                    <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase font-mono">Public</span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4 text-gray-500 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="uppercase">{item.layout.length} Nodes</span>
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
              className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 p-8 rounded shadow-2xl"
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
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-sm text-white placeholder-gray-600"
                    placeholder="My Awesome Site"
                    autoFocus
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-400">Visibility</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsNewProjectPublic(false)}
                      className={`p-4 rounded border flex flex-col items-center gap-2 transition-all ${!isNewProjectPublic ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      <Lock className="w-6 h-6" />
                      <span className="font-bold text-sm font-mono uppercase">Private</span>
                    </button>
                    <button
                      onClick={() => setIsNewProjectPublic(true)}
                      className={`p-4 rounded border flex flex-col items-center gap-2 transition-all ${isNewProjectPublic ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      <Globe className="w-6 h-6" />
                      <span className="font-bold text-sm font-mono uppercase">Public</span>
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
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded transition-all shadow-lg flex items-center justify-center gap-2 font-mono uppercase tracking-wide border border-cyan-500"
                >
                  <Plus className="w-5 h-5" />
                  Initialize_Project
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
