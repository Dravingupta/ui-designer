// src/app.js
import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/projects.js';
import templateRoutes from './routes/templates.js';
import generateRoutes from './routes/generate.js';
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

// Temporary test route for Gemini
import { generateCode } from './services/ai.js';
import { createZip } from './services/zip.js';



app.get('/test-zip', async (req, res) => {
    try {
        console.log('Testing ZIP generation...');
        const result = await generateCode(
            [
                {
                    "id": "navbar-1766834832282",
                    "type": "navbar",
                    "data": {
                        "logo": "LOGO",
                        "links": [
                            "Home",
                            "About",
                            "Services",
                            "Contact"
                        ],
                        "align": "right",
                        "sticky": false,
                        "height": "normal"
                    }
                },
                {
                    "id": "hero-1766834839705",
                    "type": "hero",
                    "data": {
                        "heading": "Welcome to Our Website",
                        "subheading": "Build amazing experiences with our platform",
                        "button": "Get Started",
                        "align": "center",
                        "width": "wide",
                        "minHeight": "auto"
                    }
                },
                {
                    "id": "cta-1766834855365",
                    "type": "cta",
                    "data": {
                        "heading": "Ready to get started?",
                        "supportingText": "Join thousands of satisfied customers today",
                        "button": "Sign Up Now",
                        "align": "center",
                        "emphasis": "normal"
                    }
                },
                {
                    "id": "stats-1766834859525",
                    "type": "stats",
                    "data": {
                        "count": 4,
                        "stats": [
                            {
                                "label": "Users",
                                "value": "10K+"
                            },
                            {
                                "label": "Projects",
                                "value": "500+"
                            },
                            {
                                "label": "Countries",
                                "value": "50+"
                            },
                            {
                                "label": "Uptime",
                                "value": "99.9%"
                            }
                        ],
                        "layout": "horizontal"
                    }
                },
                {
                    "id": "divider-1766834862319",
                    "type": "divider",
                    "data": {
                        "height": "xs",
                        "showLine": false
                    }
                },
                {
                    "id": "testimonials-1766834890698",
                    "type": "testimonials",
                    "data": {
                        "count": 3,
                        "testimonials": [
                            {
                                "name": "John Doe",
                                "role": "CEO, Company",
                                "quote": "This product changed everything for us."
                            },
                            {
                                "name": "Jane Smith",
                                "role": "Designer",
                                "quote": "Absolutely love the simplicity and power."
                            },
                            {
                                "name": "Mike Johnson",
                                "role": "Developer",
                                "quote": "Best tool I've used in years."
                            }
                        ],
                        "layout": "grid"
                    }
                },
                {
                    "id": "pricing-1766834902606",
                    "type": "pricing",
                    "data": {
                        "planCount": 3,
                        "plans": [
                            {
                                "title": "Basic",
                                "price": "$9/mo",
                                "features": [
                                    "Feature 1",
                                    "Feature 2"
                                ],
                                "highlighted": false
                            },
                            {
                                "title": "Pro",
                                "price": "$29/mo",
                                "features": [
                                    "Feature 1",
                                    "Feature 2",
                                    "Feature 3"
                                ],
                                "highlighted": true
                            },
                            {
                                "title": "Enterprise",
                                "price": "$99/mo",
                                "features": [
                                    "All features",
                                    "Priority support"
                                ],
                                "highlighted": false
                            }
                        ]
                    }
                }
            ],
            'light'
        );
        const zipBuffer = await createZip(result, 'test-project');

        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename="test-project.zip"');
        res.send(zipBuffer);
    } catch (error) {
        console.error('ZIP Test failed:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

app.use(errorHandler);

export default app;
