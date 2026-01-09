const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notePath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };
  notes.push(note);
  await fs.writeFile(notePath, JSON.stringify(notes));
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notePath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgBlue(" Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.green(note.id), chalk.blue(note.title));
  });
}

async function editNote(id, newTitle) {
  const notes = await getNotes();
  const newNotes = notes.map((note) => {
    if (note.id === id) return { title: newTitle, id };
    return note;
  });

  await fs.writeFile(notePath, JSON.stringify(newNotes));
}

async function removeNote(id) {
  const notes = await getNotes();
  const findedNote = notes.find((note) => note.id === id);
  if (!findedNote) {
    console.log(chalk.bgRed("This note does not exist."));
    return;
  }
  const newList = notes.filter((note) => note.id !== id);
  await fs.writeFile(notePath, JSON.stringify(newList));
  console.log(chalk.bgGreen("Note was removed!"));
}

module.exports = {
  addNote,
  printNotes,
  removeNote,
  getNotes,
  editNote,
};
