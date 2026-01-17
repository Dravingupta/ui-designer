import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CanvaEditor from '../components/CanvaEditor';
import { useAuth } from '../context/AuthContext';

import Loader from '../components/Loader';

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
        pages: updatedProject.pages,
        activePageId: updatedProject.activePageId,
        theme: updatedProject.theme
      });
      setProject(updatedProject);
    } catch (error) {
      // Failed to save
    }
  };

  if (loading) return <Loader message="Decrypting_Project_Data..." />;

  return (
    <CanvaEditor
      initialData={project}
      projectId={id}
      onSave={handleSave}
      onBack={() => navigate('/dashboard')}
    />
  );
};

export default EditorPage;
