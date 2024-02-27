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
}

module.exports = NotesController;