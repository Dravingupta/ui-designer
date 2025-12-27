const PROJECTS_KEY = 'ui_designer_projects';

export const getProjects = (userId) => {
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    return allProjects.filter(p => p.userId === userId);
};

export const saveProject = (project) => {
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const index = allProjects.findIndex(p => p.id === project.id);

    if (index !== -1) {
        allProjects[index] = { ...allProjects[index], ...project, updatedAt: Date.now() };
    } else {
        allProjects.push({ ...project, id: `${Date.now()}`, createdAt: Date.now(), updatedAt: Date.now() });
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
    return project;
};

export const deleteProject = (id) => {
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const filtered = allProjects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
};

export const getProject = (id) => {
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    return allProjects.find(p => p.id === id);
};
