// src/routes/projects.js
import express from 'express';
import Project from '../models/Project.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Create project
router.post('/', verifyFirebaseToken, async (req, res, next) => {
    try {
        const { name, layout, theme, isPublic } = req.body;

        const project = await Project.create({
            userId: req.user.uid,
            name,
            layout,
            theme: theme || 'light',
            isPublic: isPublic || false
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
});

// Clone project (from template or own project)
router.post('/:id/clone', verifyFirebaseToken, async (req, res, next) => {
    try {
        const sourceProject = await Project.findById(req.params.id);

        if (!sourceProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Allow cloning if public OR if user owns it
        if (!sourceProject.isPublic && sourceProject.userId !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const newProject = await Project.create({
            userId: req.user.uid,
            name: `${sourceProject.name} (Copy)`,
            layout: sourceProject.layout,
            theme: sourceProject.theme,
            isPublic: false // Clones are always private by default
        });

        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
});

// Get user's projects
router.get('/', verifyFirebaseToken, async (req, res, next) => {
    try {
        const projects = await Project.find({ userId: req.user.uid }).sort({ updatedAt: -1 });
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// Get single project
router.get('/:id', async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if user owns project or if it's public
        const token = req.headers.authorization?.split('Bearer ')[1];
        let isOwner = false;

        if (token) {
            try {
                const admin = (await import('../config/firebase.js')).default;
                const decodedToken = await admin.auth().verifyIdToken(token);
                isOwner = decodedToken.uid === project.userId;
            } catch (err) {
                // Token invalid, continue as guest
            }
        }

        if (!isOwner && !project.isPublic) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});

// Update project
router.put('/:id', verifyFirebaseToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, theme, pages, activePageId } = req.body;


        const existingProject = await Project.findById(id);

        if (!existingProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (existingProject.userId !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // 1. Defensive: Do not overwrite pages with empty array unless explicitly intended
        // Use existing pages if 'pages' is missing or empty in body (unless it's a delete-all scenario, which is rare for update)
        // For safety here, if pages is undefined/null, keep existing.
        const finalPages = (pages && pages.length > 0) ? pages : existingProject.pages;

        // 2. Ensure activePageId is valid
        const finalActivePageId = activePageId || existingProject.activePageId || (finalPages[0]?.id);

        // 3. Fallback Layout (for backward compatibility)
        // Find layout from the active page in the final pages array
        const activePage = finalPages.find(p => p.id === finalActivePageId);
        const fallbackLayout = activePage?.layout || [];

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                name: name || existingProject.name,
                theme: theme || existingProject.theme,
                pages: finalPages,
                activePageId: finalActivePageId,
                layout: fallbackLayout
            },
            { new: true }
        );

        res.json(updatedProject);
    } catch (error) {
        console.error('❌ [ERROR] Project Update Failed:', error);
        next(error);
    }
});

// Delete project
router.delete('/:id', verifyFirebaseToken, async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        next(error);
    }
});

// Toggle public/private
router.patch('/:id/public', verifyFirebaseToken, async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied' });
        }

        project.isPublic = !project.isPublic;
        await project.save();

        res.json(project);
    } catch (error) {
        next(error);
    }
});

export default router;
