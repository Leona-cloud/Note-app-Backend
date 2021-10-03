const mongoose  = require("mongoose");
const request = require("supertest");
const { Note } = require("../../Model/notes");

let server;

describe("/api/notes", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
  });
  describe("GET /:id", () => {
    it("should return a note if a valid id is given ", async () => {
      const note = new Note({
        title: "new note",
        body: "this is a note",
        author: "chisom",
      });
      await note.save();

      const res = await request(server).get("/api/notes/" + note._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("author", note.author);
    });
    it("should return 404 if an invalid id is given ", async () => {
      const res = await request(server).get("/api/notes/2");

      expect(res.status).toBe(404);
    });
    it("should return 404 if note with the given id does not exists ", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/notes/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should save the note to the database", async () => {
      const res = await request(server)
        .post("/api/notes/")
        .send({
          title: "sleeping in the afternoon",
          author: "chisom",
          body: "Jesus is lord",
          isStarred: "true",
        });

      const note = await Note.find({ title: "sleeping in the afternoon" });

      expect(note).not.toBeNull();
    });

    it("should return 403 if the body of the note is empty", async () => {
      const res = await request(server)
        .post("/api/notes/")
        .send({ title: "note2", author: "Leona", isStarred: false, body: " " });

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /:id", () =>{

    let id;
    let newTitle;
    let note;

    beforeEach(async () => {
      const note = new Note({
        title: "new note2",
        body: "this is a note",
        author: "chisom",
      });
      await note.save();
   
      id = note._id; 
      newTitle = 'updatedTitle'; 
    })
    
    it("should update a note if a valid id is given ", async () => {
   
      
      const res = await request(server)
      .put("/api/notes/" + id)
      .send({title: newTitle})

      const updatedTitle = await Note.findById(id);

      expect(res.status).toBe(200);
      expect(updatedTitle.title).toBe(newTitle)
    });
    
    it("should return 404 if note with the given id does not exists ", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).put("/api/notes/" + id);

      expect(res.status).toBe(404);
    });

    it('should update the note if input is valid', async () => {
     const res = await request(server)
     .put("/api/notes/" + id)
     .send({title: newTitle})

      const updatedTitle= await Note.findById(id);

      expect(updatedTitle.title).toBe(newTitle);
    });

    
  });

  describe("DELETE /:id", ()=>{
    let note;
    let id;

    beforeEach(async () => {
      const note = new Note({
        title: "new note2",
        body: "this is a note",
        author: "chisom",
      });
      await note.save();
   
      id = note._id; 
    })
    it("should return 400 if note with the given id does not exists ", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).delete("/api/notes/" + id);

      expect(res.status).toBe(400);
    });

    it('should delete the note if id is valid', async () => {
      const res = await request(server).delete("/api/notes/" + id);

      const noteInDb = await Note.findById(id);

      expect(noteInDb).toBeNull();
    });

    
  })
});
