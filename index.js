const port = 8000;
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'static')));

app.get('/UploadForm.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'UploadForm.html'));
});

app.get('/notes', (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

app.post('/upload', upload.single('file'), (req, res) => {
  const noteName = req.body.note_name;
  const noteText = req.body.note;

  const notes = loadNotes();

  if (notes.some((note) => note.name === noteName)) {
    return res.status(400).json({ error: 'Note with the same name already exists' });
  }

  notes.push({ name: noteName, text: noteText });
  saveNotes(notes);

  res.status(201).json({ message: 'Note created successfully' });
});

app.get('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;
  const notes = loadNotes();

  const note = notes.find((n) => n.name === noteName);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

app.put("/notes/:noteName", express.text(), (req, res) => {
  const noteName = req.params.noteName;
  const updatedNoteText = req.body;
  const data = fs.readFileSync("notes.json", "utf-8");
  getnotes = JSON.parse(data);

  const index = getnotes.findIndex((note) => note.name === noteName);

  if (index !== -1) {
    getnotes[index].text = updatedNoteText;

    dataJSON = JSON.stringify(getnotes);
    fs.writeFileSync("notes.json", dataJSON);

    res.status(200).send("Нотатка успішно змінена");
  } else {
    res.status(404).send("Нотатка не знайдена");
  }
});

app.delete('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;

  const notes = loadNotes();

  const filteredNotes = notes.filter((n) => n.name !== noteName);

  if (filteredNotes.length === notes.length) {
    return res.status(404).json({ error: 'Note not found' });
  }

  saveNotes(filteredNotes);

  res.json({ message: 'Note deleted successfully' });
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

function saveNotes(notes) {
  const data = JSON.stringify(notes, null, 2);
  fs.writeFileSync(path.join(__dirname, 'notes.json'), data);
}

app.post('/upload', upload.single('file'), (req, res) => {
  const noteName = req.body.note_name;
  const noteText = req.body.note;

  const notes = loadNotes();

  if (notes.some((note) => note.name === noteName)) {
    return res.status(400).json({ error: 'Note with the same name already exists' });
  }

  notes.push({ name: noteName, text: noteText });
  saveNotes(notes);

  res.status(201).json({ message: 'Note created successfully' });
});

function loadNotes() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'notes.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

