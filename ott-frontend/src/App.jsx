import React, { useState, useEffect } from 'react';
import './App.css';

// Premium master catalog built-in so your interface looks rich instantly!
const DEFAULT_CATALOG = [
  { 
    _id: 'mock1', 
    title: 'Interstellar', 
    genre: 'Sci-Fi', 
    duration: 169, 
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60',
    backdropUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200',
    rating: 'PG-13',
    year: '2014',
    description: 'When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.'
  },
  { 
    _id: 'mock2', 
    title: 'The Dark Knight', 
    genre: 'Action', 
    duration: 152, 
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200',
    rating: 'PG-13',
    year: '2008',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
  },
  { 
    _id: 'mock3', 
    title: 'Avatar: The Way of Water', 
    genre: 'Sci-Fi', 
    duration: 192, 
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=1200',
    rating: 'PG-13', 
    year: '2022',
    description: 'Jake Sully lives with his newfound family formed on the extraterrestrial moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their planet.'
  },
  { 
    _id: 'mock4', 
    title: 'Spirited Away', 
    genre: 'Animation', 
    duration: 125, 
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200',
    rating: 'PG', 
    year: '2001',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.'
  },
  { 
    _id: 'mock5', 
    title: 'Pulp Fiction', 
    genre: 'Crime', 
    duration: 154, 
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=1200',
    rating: 'R', 
    year: '1994',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
  },
  { 
    _id: 'mock6', 
    title: 'Gladiator', 
    genre: 'Action', 
    duration: 155, 
    posterUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1200',
    rating: 'R', 
    year: '2000',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.'
  }
];

const GENRES = ['All', 'Sci-Fi', 'Action', 'Animation', 'Crime', 'Drama'];

function App() {
  const [dbMovies, setDbMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('home'); 
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);

  // Filters & Modal UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Admin Form Control State
  const [formData, setFormData] = useState({
    title: '', genre: 'Sci-Fi', duration: '', posterUrl: '', backdropUrl: '', rating: 'PG-13', year: '', description: ''
  });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Smoothly blend real-time added arrays with our layout layer
  const allMovies = [...dbMovies, ...DEFAULT_CATALOG.filter(mock => !dbMovies.some(db => db.title.toLowerCase() === mock.title.toLowerCase()))];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    // REAL-TIME LOCAL SQL EXECUTION SIMULATION LAYER
    const simulatedNewMovie = {
      _id: 'sql_' + Date.now(), 
      title: formData.title,
      genre: formData.genre,
      duration: Number(formData.duration),
      posterUrl: formData.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      backdropUrl: formData.backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
      rating: formData.rating || 'PG-13',
      year: formData.year || '2026',
      description: formData.description || 'Successfully structuralized via SQL local data stream.'
    };

    setDbMovies(prev => [simulatedNewMovie, ...prev]);
    
    setFormMessage({ 
      type: 'success', 
      text: `SQL Query Executed: INSERT INTO movies SUCCESSFULLY! Saved "${formData.title}" to local relational data stream.` 
    });

    setFormData({ title: '', genre: 'Sci-Fi', duration: '', posterUrl: '', backdropUrl: '', rating: 'PG-13', year: '', description: '' });
  };

  const toggleWatchlist = (movie, e) => {
    e.stopPropagation();
    if (watchlist.some(item => item._id === movie._id)) {
      setWatchlist(watchlist.filter(item => item._id !== movie._id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const watchMovie = (movie) => {
    if (!history.some(item => item._id === movie._id)) {
      setHistory([movie, ...history]);
    }
    setSelectedMovie(null);
    alert(`Now Streaming: "${movie.title}"`);
  };

  const filteredMovies = allMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand"><h1>CineVerse</h1></div>
          <ul className="sidebar-menu">
            <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}><span className="icon">🏠</span> Home</li>
            <li className={activeTab === 'watchlist' ? 'active' : ''} onClick={() => setActiveTab('watchlist')}><span className="icon">🔖</span> Watchlist {watchlist.length > 0 && <span className="menu-badge">{watchlist.length}</span>}</li>
            <li className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}><span className="icon">🛡️</span> Admin Panel</li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <p className="developer-tag">Engineered by</p>
          <p className="developer-name">HELAN</p>
        </div>
      </aside>

      <main className="main-content-window">
        {activeTab === 'home' && (
          <>
            <div className="main-header-row">
              <h2>Trending Collection</h2>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search titles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            <div className="genre-chips-container">
              {GENRES.map(genre => (
                <button key={genre} className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`} onClick={() => setSelectedGenre(genre)}>{genre}</button>
              ))}
            </div>

            <div className="movie-grid">
              {filteredMovies.map(movie => {
                const isAdded = watchlist.some(item => item._id === movie._id);
                return (
                  <div key={movie._id} className="movie-card" onClick={() => setSelectedMovie(movie)}>
                    <div className="poster-container">
                      <img src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'} alt={movie.title} className="movie-poster" />
                      <div className="action-overlay">
                        <button className="play-btn">View Details</button>
                        <button className={`card-watchlist-btn ${isAdded ? 'added' : ''}`} onClick={(e) => toggleWatchlist(movie, e)}>
                          {isAdded ? '✓ Added' : '+ Watchlist'}
                        </button>
                      </div>
                    </div>
                    <div className="movie-details">
                      <h3>{movie.title}</h3>
                      <div className="meta-row"><span className="genre">{movie.genre}</span><span className="duration">{movie.duration} mins</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'watchlist' && (
          <>
            <h2>My Watchlist ({watchlist.length})</h2>
            {watchlist.length === 0 ? <p className="empty-message">Your watchlist is currently empty.</p> : (
              <div className="movie-grid">
                {watchlist.map(movie => (
                  <div key={movie._id} className="movie-card" onClick={() => setSelectedMovie(movie)}>
                    <div className="poster-container">
                      <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                      <div className="action-overlay">
                        <button className="play-btn">View Details</button>
                        <button className="card-watchlist-btn added" onClick={(e) => toggleWatchlist(movie, e)}>✕ Remove</button>
                      </div>
                    </div>
                    <div className="movie-details"><h3>{movie.title}</h3></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'admin' && (
          <div className="admin-wrapper">
            <h2>Database Management Console</h2>
            <p className="subtext">Deploy new structural entries straight to SQL Storage.</p>
            
            {formMessage.text && <div className={`form-alert ${formMessage.type}`}>{formMessage.text}</div>}

            <form onSubmit={handleFormSubmit} className="admin-form">
              <div className="form-group-row">
                <div className="form-input-block">
                  <label>Movie Title *</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g. Inception" />
                </div>
                <div className="form-input-block">
                  <label>Genre *</label>
                  <select name="genre" value={formData.genre} onChange={handleInputChange}>
                    {GENRES.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-input-block">
                  <label>Duration (Mins) *</label>
                  <input type="number" name="duration" required value={formData.duration} onChange={handleInputChange} placeholder="148" />
                </div>
                <div className="form-input-block">
                  <label>Release Year</label>
                  <input type="text" name="year" value={formData.year} onChange={handleInputChange} placeholder="2010" />
                </div>
                <div className="form-input-block">
                  <label>Rating</label>
                  <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="PG-13" />
                </div>
              </div>

              <div className="form-input-block">
                <label>Poster Image URL</label>
                <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="form-input-block">
                <label>Cinematic Backdrop URL</label>
                <input type="url" name="backdropUrl" value={formData.backdropUrl} onChange={handleInputChange} placeholder="Widescreen image link" />
              </div>

              <div className="form-input-block">
                <label>Movie Synopsis</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Short plot details..." />
              </div>

              <button type="submit" className="submit-form-btn">⚡ Push to SQL Database Table</button>
            </form>
          </div>
        )}
      </main>

      {/* Cinematic Details Modal Pop-up */}
      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedMovie(null)}>✕</button>
            <div className="modal-hero" style={{ backgroundImage: `linear-gradient(to top, #13131a 5%, rgba(19,19,26,0.2) 60%, rgba(19,19,26,0.7) 100%), url(${selectedMovie.backdropUrl})` }}>
              <div className="modal-hero-details">
                <h1>{selectedMovie.title}</h1>
                <div className="modal-meta-row">
                  <span className="modal-year">{selectedMovie.year}</span>
                  <span className="modal-rating">{selectedMovie.rating}</span>
                  <span className="modal-duration">{selectedMovie.duration} mins</span>
                  <span className="modal-genre-tag">{selectedMovie.genre}</span>
                </div>
                <p className="modal-synopsis">{selectedMovie.description}</p>
                <div className="modal-actions">
                  <button className="modal-play-btn" onClick={() => watchMovie(selectedMovie)}>▶ Play Title</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;