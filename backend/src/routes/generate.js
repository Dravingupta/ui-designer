// src/routes/generate.js
import express from 'express';
import Project from '../models/Project.js';
import { generateCode } from '../services/ai.js';
import { createZip } from '../services/zip.js';

const router = express.Router();

// Generate ZIP from project
router.post('/:projectId', async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const token = req.headers.authorization?.split('Bearer ')[1];

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if user owns project or if it's public
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

        // Generate code using AI service
        const code = await generateCode(project.layout, project.theme);

        // Create ZIP
        const zipBuffer = await createZip(code, project.name);

        // Return as base64
        res.json({
            filename: `${project.name.replace(/\s+/g, '-').toLowerCase()}.zip`,
            data: zipBuffer.toString('base64')
        });
    } catch (error) {
        next(error);
    }
});

export default router;
