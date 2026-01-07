// src/models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    layout: {
        type: Array,
        default: []
    },
    pages: [{
        id: String,
        name: String,
        route: String,
        layout: Array,
        generatedCode: String
    }],
    activePageId: String,
    theme: {
        type: String,
        default: 'light'
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Project', projectSchema);
