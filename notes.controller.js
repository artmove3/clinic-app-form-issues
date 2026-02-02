// const fs = require("fs/promises");
// const path = require("path");
const chalk = require("chalk");

// const notePath = path.join(__dirname, "db.json");
// подключаем модель для взаимодействия с mongodb
const Note = require("./models/Note");

async function addNote(title, owner) {
  // const notes = await getNotes();

  // const note = {
  //   title,
  //   id: Date.now().toString(),
  // };
  // notes.push(note);
  // await fs.writeFile(notePath, JSON.stringify(notes));

  // title - value для отображения записи, owner - отображение емэйла записавшего
  await Note.create({ title, owner });
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  // const notes = await fs.readFile(notePath, { encoding: "utf-8" });

  //  Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
  // получаем данные в виде объекта, парсить его не нужно
  const notes = Note.find();
  return notes;
}

// async function printNotes() {
//   const notes = await getNotes();
//   console.log(chalk.bgBlue(" Here is the list of notes:"));
//   notes.forEach((note) => {
//     console.log(chalk.green(note.id), chalk.blue(note.title));
//   });
// }

async function editNote(id, newTitle, owner) {
  // const notes = await getNotes();
  // const newNotes = notes.map((note) => {
  //   if (note.id === id) return { title: newTitle, id };
  //   return note;
  // });

  // await fs.writeFile(notePath, JSON.stringify(newNotes));

  // первый аргумент - id элемента, который нужно изменить, второй - данные для изменения
  const result = await Note.updateOne({ _id: id, owner }, { title: newTitle });
  if (result.matchedCount === 0) {
    throw new Error("No notes to edit");
  }
  console.log(chalk.bgGreen(`Note with id: ${id} has been updated!`));
}

async function removeNote(id, owner) {
  const notes = await getNotes();
  const findedNote = notes.find((note) => note.id === id);
  if (!findedNote) {
    console.log(chalk.bgRed("This note does not exist."));
    return;
  }
  // const newList = notes.filter((note) => note.id !== id);
  // await fs.writeFile(notePath, JSON.stringify(newList));
  const result = await Note.deleteOne({ _id: id, owner });
  if (result.matchedCount === 0) {
    throw new Error("No notes to delete");
  }
  console.log(chalk.bgGreen(`Note with id: ${id} was removed!`));
}

module.exports = {
  addNote,
  removeNote,
  getNotes,
  editNote,
};
