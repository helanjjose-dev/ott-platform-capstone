const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// This automatically creates a real SQL database file in your backend folder
const dbPath = path.resolve(__dirname, '../../cineverse.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite SQL Database.');
});

// Create the movies table using strict SQL structure if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      duration INTEGER NOT NULL,
      posterUrl TEXT,
      backdropUrl TEXT,
      rating TEXT,
      year TEXT,
      description TEXT
    )
  `);
});

// SQL Action: Fetch all movies
exports.getMovies = (req, res) => {
  const sql = `SELECT * FROM movies`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// SQL Action: Insert a new movie from the Admin Panel form
exports.addMovie = (req, res) => {
  const { title, genre, duration, posterUrl, backdropUrl, rating, year, description } = req.body;

  if (!title || !genre || !duration) {
    return res.status(400).json({ message: "Title, genre, and duration are required." });
  }

  const sql = `INSERT INTO movies (title, genre, duration, posterUrl, backdropUrl, rating, year, description) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const params = [
    title, 
    genre, 
    Number(duration), 
    posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500', 
    backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200', 
    rating || 'PG-13', 
    year || new Date().getFullYear().toString(), 
    description || 'No summary overview currently available.'
  ];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Return the newly created item back to the frontend
    res.status(201).json({
      _id: this.lastID, // Frontend expects an ID field
      title, genre, duration, posterUrl, backdropUrl, rating, year, description
    });
  });
};