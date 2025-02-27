const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
