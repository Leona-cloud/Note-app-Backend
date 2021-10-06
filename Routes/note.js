const express = require("express");
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const _ = require("lodash");
const mongoose = require("mongoose");
const router = express.Router();
const { Note, validateNote } = require("../Model/notes");


router.get('/', async (req, res)=>{
  try {
    const notes = await Note.find().sort('name');
    res.send(notes)
  } catch (ex) {
      console.log(ex)
  }
 
})


router.get("/:id", validateObjectId, async (req, res) => {
   const note = await Note.findById({ _id: req.params.id });
  try {
    if (!note) return res.status(404).send("Note with the given ID was not found");
      res.status(200).send(note);
  
  } catch (ex) {
    console.log(ex)
  }
    
});

router.post("/", auth, async (req, res) => {
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const note = new Note(_.pick(req.body, ["title", "body", "date", "author"]));
  if(req.body.body == ' ') return res.status(403).send("Note can't have an empty body");
  try {
    const result = await note.save();
    res.send(result);
    console.log(result);
  } catch (ex) {
    res.send('Please fill the required fields')
    console.log(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, body: req.body.body },
    { new: true }
  );
  if (!note) {
    return res.status(404).send("Note doesn't exist");
  } else {
    res.send("Note has been updated" + note);
  }
});

router.delete("/:id", async (req, res) => {
  let note = await Note.findByIdAndRemove(req.params.id);
  if (!note) {
    return res.status(400).send("note with the given id does not exist");
  } else {
    res.send("note has been deleted");
  }
});

module.exports = router;
