const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const NoteSchema = new Schema(
  {
    id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

var Note = mongoose.model('Note', NoteSchema)
// export the new Schema so we could modify it using Node.js
module.exports = Note;