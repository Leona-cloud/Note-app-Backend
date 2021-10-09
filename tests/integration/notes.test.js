const mongoose = require("mongoose");
const request = require("supertest");
const { Note } = require("../../Model/notes");
const { User } = require("../../Model/users");

let server;

describe("/api/notes", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
    await Note.remove({});
  });
  describe("GET /", () => {
    it("should return all notes", async () => {
      Note.collection.insertMany([{ title: "note1" }, { title: "note2" }]);

      const res = await request(server).get("/api/notes");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((n) => n.title === "note1")).toBeTruthy();
    });
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
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).post("/api/notes/").send({
        title: "sleeping in the afternoon",
      });
      expect(res.status).toBe(401);
    });
    it("should save the note if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server).post("/api/notes/").send({
        title: "sleeping in the afternoon",
        author: "chisom",
        body: "New body",
      });

      const note = await Note.find({
        title: "sleeping in the afternoon",
        author: "chisom",
        body: "New body",
      });
      expect(note).not.toBeNull();
    });

    it("should return 400 if the body of the note is empty", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/notes/")
        .set("x-auth-token", token)
        .send({
          title: "note2",
          author: "Leona",
          isStarred: false,
          body: "",
        });

      const note = await Note.find({
        title: "sleeping in the afternoon",
        author: "chisom",
        body: "New body",
      });

      expect(res.status).toBe(400);
    });

    it("should return the note if valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/notes/")
        .set("x-auth-token", token)
        .send({
          title: "note2",
          author: "Leona",
          body: "New body",
        });

      expect(res.body).toHaveProperty("title", "note2");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let id;
    let newTitle;
    let note;

    const exec = async () => {
      return await request(server)
        .put("/api/notes/" + id)
        .set("x-auth-token", token)
        .send({ title: newTitle });
    };

    beforeEach(async () => {
      note = new Note({ title: "note1", author: "author1", body: " New body" });
      await note.save();

      token = new User().generateAuthToken();
      id = note._id;
      newTitle = "updatedName";
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if note with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the note if input is valid", async () => {
      await exec();

      const updatedNote = await Note.findById(note._id);

      expect(updatedNote.title).toBe(newTitle);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let id;
    let note;

    const exec = async () => {
      return await request(server)
        .delete("/api/notes/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      note = new Note({ title: "note1", author: "author1", body: " New body" });
      await note.save();

      token = new User().generateAuthToken();
      id = note._id;
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no note with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the note if input is valid", async () => {
      await exec();

      const noteInDb = await Note.findById(id);

      expect(noteInDb).toBeNull();
    });
  });
});
