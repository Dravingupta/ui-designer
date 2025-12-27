// src/routes/projects.js
import express from 'express';
import Project from '../models/Project.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Create project
router.post('/', verifyFirebaseToken, async (req, res, next) => {
    try {
        const { name, layout, theme } = req.body;

        const project = await Project.create({
            userId: req.user.uid,
            name,
            layout,
            theme: theme || 'light',
            isPublic: false
        });

        res.status(201).json(project);
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
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { name, layout, theme } = req.body;

        if (name) project.name = name;
        if (layout) project.layout = layout;
        if (theme) project.theme = theme;

        await project.save();
        res.json(project);
    } catch (error) {
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
