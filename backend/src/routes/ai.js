import express from 'express';
import { generateText } from '../services/ai.js';

const router = express.Router();

router.post('/generate', async (req, res, next) => {
    try {
        const { fieldType, sectionType, currentValue, contextText } = req.body;

        // Map frontend types to backend prompt types
        const typeMapping = {
            'input': 'paragraph',
            'item': 'paragraph',
            'textarea': 'paragraph',
            'label': 'caption',
            'title': 'heading',
            'description': 'paragraph'
        };

        const safeContext = Array.isArray(contextText) ? contextText : [];

        const finalFieldType = typeMapping[fieldType] || fieldType || 'paragraph';

        const text = await generateText({
            fieldType: finalFieldType,
            sectionType: sectionType || 'general',
            currentValue,
            contextText: safeContext
        });

        res.json({ text });
    } catch (error) {
        next(error);
    }
});

export default router;
