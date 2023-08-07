const Joi = require('joi');
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
    isStarred: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Note = mongoose.model('Note', noteSchema);

function validateNote(note){
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(20),
        body: Joi.string().required().max(1024),
        author: Joi.string().required().max(20),
        
    });
    return schema.validate(note)
}

module.exports.Note = Note;
module.exports.validateNote = validateNote;
