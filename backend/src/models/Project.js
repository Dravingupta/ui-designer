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
        type: Object,
        required: true
    },
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
