const { required } = require('joi');
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type : String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isStarred: {
        type: Boolean,
        default: false
    }
});

const Note = mongoose.model('Note', noteSchema);

module.exports.Note = Note;