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

function validNote(note){
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(20),
        body: Joi.string().required().min(),
        author: Joi.string().required().max(15),
        
    });
    return schema.validate(note)
}

module.exports.Note = Note;
module.exports.validation = validNote;
