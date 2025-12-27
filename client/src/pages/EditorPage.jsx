import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, saveProject } from '../utils/projectStorage';
import CanvaEditor from '../components/CanvaEditor';
import { useAuth } from '../context/AuthContext';

const EditorPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getProject(id);
    if (!data || data.userId !== user.id) {
      navigate('/dashboard');
      return;
    }
    setProject(data);
    setLoading(false);
  }, [id, user, navigate]);

  const handleSave = (updatedData) => {
    const updatedProject = { ...project, ...updatedData };
    saveProject(updatedProject);
    setProject(updatedProject);
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
