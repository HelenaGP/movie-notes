const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class NotesController{
  async create(request,response){
    const { title, description, rating, movieTags } = request.body;
    const { user_id } = request.params;

    if(!Number.isInteger(rating) || rating > 5 || rating < 1) {
      throw new AppError("A nota deve ser um número inteiro entre 1 e 5.");
    }

    const [note_id] = await knex("movieNotes").insert({
      title,
      description,
      rating, 
      user_id
    });

    const tagsInsert = movieTags.map(name => {
      return {
        note_id,
        name,
        user_id,
      }
    });

    await knex("movieTags").insert(tagsInsert);

    response.json();
  }

  async show(request,response){
    const { id } = request.params;

    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movietags").where({ note_id: id }).orderBy("name");

    return response.json({
      ...note,
      tags
    })
  }

  async delete(request,response){
    const { id } = request.params;

    await knex("movieNotes").where({ id }).delete();

    return response.json();
  }

  async index(request,response){
    const { title, user_id, movieTags } = request.query;

    let notes;

    if(movieTags){
      const filterTags = movieTags.split(",").map(tag => tag.trim());

      notes = await knex("movieTags")
        .select([
          "notes.id",
          "notes.title",
          "notes.user_id"
        ])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "movieTags.note_id");
    
    } else {
        notes = await knex ("movieNotes")
          .where({ user_id })
          .whereLike("title", `%${title}%`)
          .orderBy("title");
    }

    const userTags = await knex("movieTags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        movieTags: noteTags
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;