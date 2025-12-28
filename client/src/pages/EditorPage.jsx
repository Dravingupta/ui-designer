import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CanvaEditor from '../components/CanvaEditor';
import { useAuth } from '../context/AuthContext';

const EditorPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProject();
    }
  }, [id, user, navigate]);

  const handleSave = async (updatedData) => {
    try {
      const updatedProject = { ...project, ...updatedData };
      await api.put(`/projects/${id}`, {
        name: updatedProject.name,
        layout: updatedProject.layout,
        theme: updatedProject.theme
      });
      setProject(updatedProject);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  if (loading) return null;

  return (
    <CanvaEditor 
      initialData={project} 
      onSave={handleSave} 
      onBack={() => navigate('/dashboard')} 
    />
  );
};

export default EditorPage;
