// файл для взаимодействия с базой данных через mongoose
// mongoose будет валидировать данные перед отправкой в базу
const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
