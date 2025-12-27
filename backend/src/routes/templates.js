// src/routes/templates.js
import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// Get all public projects (templates)
router.get('/', async (req, res, next) => {
    try {
        const templates = await Project.find({ isPublic: true }).sort({ updatedAt: -1 });
        res.json(templates);
    } catch (error) {
        next(error);
    }
});

export default router;
