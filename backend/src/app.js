// src/app.js
import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/projects.js';
import templateRoutes from './routes/templates.js';
import generateRoutes from './routes/generate.js';
import aiRoutes from './routes/ai.js';
import { errorHandler } from './utils/errorHandler.js';
import "./config/firebase.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.json({ message: 'Website Builder API' });
});

app.use('/projects', projectRoutes);
app.use('/templates', templateRoutes);
app.use('/generate', generateRoutes);
app.use('/ai', aiRoutes);

// Temporary test route for Gemini
import { generateCode } from './services/ai.js';
import { createZip } from './services/zip.js';





app.use(errorHandler);

export default app;
