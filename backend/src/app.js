// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import templateRoutes from './routes/templates.js';
import generateRoutes from './routes/generate.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.json({ message: 'Website Builder API' });
});

app.use('/projects', projectRoutes);
app.use('/templates', templateRoutes);
app.use('/generate', generateRoutes);

app.use(errorHandler);

export default app;
