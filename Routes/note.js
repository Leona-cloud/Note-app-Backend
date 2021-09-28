const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const router = express.Router();
const  { Note }  = require('../Model/notes');

router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({_id: req.params.id});
        console.log(note)
        res.send(note)
    } catch (ex) {
       console.log(ex) 
    }
});

router.post('/', async (req, res) => {
    const note = new Note(_.pick(req.body, ['title', 'body', 'date', 'author']));
    try {
        const result = await note.save();
        res.send(result)
        console.log(result);
    } catch (ex) {
        console.log(ex.message);
    }
});

router.put('/:id', async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, _.pick(req.body, ['title', 'body', 'date', 'author']), {new: true});
  if(!note){
      return res.send("Note doesn't exist");
  }else{
     res.send("Note has been updated" + note);
  }

});



router.delete('/:id', async (req, res) => {
    let note = await Note.findByIdAndRemove(req.params.id);
    if(!note) {
        return res.status(400).send("note with the given id does not exist");
    }else{
        res.send('note has been deleted');
    };
    
});



module.exports = router;