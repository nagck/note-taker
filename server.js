// Dependencies
const express = require("express");      
const fs = require("fs");      
const path = require("path")   
const { v4: uuidv4 } = require('uuid')

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Display current notes function
const getNotes = () => {
    const jsonString = fs.readFileSync("./db/db.json", "utf8")
        return JSON.parse(jsonString);
}    

//Write current notes function
const writeNotes = (jsonString) => {
    fs.writeFile("./db/db.json", jsonString, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Notes database updated successfully!");
        }
    });
}

// Retrieve notes
app.get('/api/notes', (req, res) => {
    console.log(getNotes())
    res.json(getNotes());
});

// POST notes
app.post('/api/notes', (req, res) => {

    let notesData = getNotes();
    let newNote = req.body;
    newNote.id = uuidv4();
    notesData.push(newNote);
    const jsonString = JSON.stringify(notesData);
    writeNotes(jsonString);
    res.json(newNote);
});

// Delete notes
app.delete("/api/notes/:id", function (req, res) {
    let notesData = getNotes();     
    const chosen = req.params.id;   
    let newData = notesData.filter(note => note.id !== chosen);
    writeNotes(JSON.stringify(newData));
    res.send('Note Deleted')
  })

  // HTML Routes
// Serve static files in Express
app.use(express.static('public'));

// Setup get route - Display notes.html when /notes is accessed
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Display index.html when all other routes are accessed
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Starts the server to begin listening
app.listen(PORT, console.log(`Node.js server is istening on port: ${PORT}`));