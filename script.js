const API_KEY = "d2c069361eb58ac9b3fcfaeb997a0105";

// 🏛️ EMON PROTOCOL MASTER MAP
const MAP = {
  g: { 1: "Action", 2: "Comedy", 3: "Romance", 4: "Horror", 5: "Crime", 6: "Sci-Fi", 7: "Drama", 8: "Adventure", 9: "Fantasy", 10: "History", 11: "Thriller", 12: "Animation" },
  m: { 31: "Fun", 32: "Chill", 33: "Dark", 34: "Mysterious", 35: "Emotional", 36: "Inspiring", 37: "Romantic", 38: "Mindblowing", 39: "Anime Night" },
  ty: { 51: "Movie", 52: "Series", 53: "Documentary" },
  l: { "en": "English", "hi": "Hindi", "be": "Bengali", "sp": "Spanish", "jp": "Japanese", "kr": "Korean", "sind": "South Indian" }
};

function showFilters() {
  document.getElementById("filters").classList.remove("hidden");
}

function getImageUrl(path) {
  return path ? "https://image.tmdb.org/t/p/w500" + path : "https://via.placeholder.com/300x450?text=No+Poster";
}

// 🎯 FIND PICKS
async function findSuggestion() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p style="color:#aaa; text-align:center; width:100%;">Finding your picks...</p>`;

  try {
    const response = await fetch("data.json");
    const data = await response.json();

    // ✅ FIX: Convert String inputs from HTML to Numbers for matching JSON
    const type = parseInt(document.getElementById("type").value);
    const genre = parseInt(document.getElementById("genre").value);
    const language = document.getElementById("language").value;
    const mood = parseInt(document.getElementById("mood").value);

    let results = data.filter(item => {
      return (!type || item.ty === type) &&
             (!genre || (item.g && item.g.includes(genre))) &&
             (!language || item.l === language) &&
             (!mood || (item.m && item.m.includes(mood)));
    });

    displayResults(results, "Your Picks 🍿");
  } catch (e) {
    console.error("Filter Error:", e);
    resultsDiv.innerHTML = `<p style="color:#ff4d4d;">Error loading data. Check data.json</p>`;
  }
}

// 🎲 SURPRISE PICKS
async function randomPicks() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p style="color:#aaa; text-align:center; width:100%;">Loading surprise picks...</p>`;

  try {
    const response = await fetch("data.json");
    const data = await response.json();
    let results = data.sort(() => 0.5 - Math.random()).slice(0, 6);
    displayResults(results, "Surprise Picks 🎲");
  } catch (e) {
    resultsDiv.innerHTML = `<p style="color:#ff4d4d;">Error loading surprise picks.</p>`;
  }
}

// 🖼️ RENDER ENGINE
function displayResults(results, title) {
  const resultsDiv = document.getElementById("results");
  document.getElementById("results-title").innerText = title;

  if (results.length === 0) {
    resultsDiv.innerHTML = `<p style="color:#aaa; text-align:center; width:100%; min-height:40vh; display:flex; align-items:center; justify-content:center;">Sorry, No matches found. Try different filters.</p>`;
    return;
  }

  // Limit to 6 random from results
  const finalSelection = results.sort(() => 0.5 - Math.random()).slice(0, 6);

  let html = "";
  finalSelection.forEach(movie => {
    const genreNames = movie.g ? movie.g.map(id => MAP.g[id]).join(", ") : "Various";
    const langName = MAP.l[movie.l] || movie.l;

    html += `
      <div class="movie-card">
        <img src="${getImageUrl(movie.p)}" loading="lazy">
        <div class="movie-info">
          <div class="movie-title">${movie.t}</div>
          <div class="movie-meta">
            ${genreNames}<br>
            ${langName.toUpperCase()}<br>
            <span style="font-size:0.85em; color:#FFD700; font-weight:600;">
              ${movie.m ? movie.m.map(id => MAP.m[id]).join(" • ") : ""}
            </span>
          </div>
        </div>
      </div>
    `;
  });

  resultsDiv.innerHTML = html;
}

/* =========================================
   SEARCH OVERLAY LOGIC
========================================= */
let searchDataCache = []; // Cache to ensure lightning-fast typing

async function openSearchOverlay() {
  document.getElementById("search-overlay").classList.add("active");
  document.body.classList.add("search-active"); // Lock background scroll
  
  // Slight delay for smooth animation before focusing input
  setTimeout(() => {
    document.getElementById("overlay-search-input").focus();
  }, 100);

  // Pre-fetch data if not already cached
  if (searchDataCache.length === 0) {
    try {
      const response = await fetch("data.json");
      searchDataCache = await response.json();
    } catch (e) {
      console.error("Failed to load search data:", e);
    }
  }
}

function closeSearchOverlay() {
  document.getElementById("search-overlay").classList.remove("active");
  document.body.classList.remove("search-active");
  
  // Clear inputs and results on close
  document.getElementById("overlay-search-input").value = "";
  document.getElementById("search-overlay-results").innerHTML = "";
  document.getElementById("search-empty-state").classList.add("hidden");
}

function handleRealTimeSearch(query) {
  const resultsGrid = document.getElementById("search-overlay-results");
  const emptyState = document.getElementById("search-empty-state");

  query = query.toLowerCase().trim();

  // If input is empty, clear screen
  if (!query) {
    resultsGrid.innerHTML = "";
    emptyState.classList.add("hidden");
    return;
  }

  // Filter based on Title, Genre, Language, or Type
  const filtered = searchDataCache.filter(item => {
    const titleMatch = item.t.toLowerCase().includes(query);
    
    // Convert IDs to text mappings for searching
    const genreMatch = item.g ? item.g.some(id => MAP.g[id] && MAP.g[id].toLowerCase().includes(query)) : false;
    const langName = MAP.l[item.l] ? MAP.l[item.l].toLowerCase() : "";
    const typeName = MAP.ty[item.ty] ? MAP.ty[item.ty].toLowerCase() : "";

    return titleMatch || genreMatch || langName.includes(query) || typeName.includes(query);
  });

  // Display handling
  if (filtered.length === 0) {
    resultsGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    renderOverlayCards(filtered);
  }
}

function renderOverlayCards(results) {
  const resultsGrid = document.getElementById("search-overlay-results");
  let html = "";
  
  // Reusing your exact HTML template to perfectly match existing cards
  results.forEach(movie => {
    const genreNames = movie.g ? movie.g.map(id => MAP.g[id]).join(", ") : "Various";
    const langName = MAP.l[movie.l] || movie.l;

    html += `
      <div class="movie-card">
        <img src="${getImageUrl(movie.p)}" loading="lazy">
        <div class="movie-info">
          <div class="movie-title">${movie.t}</div>
          <div class="movie-meta">
            ${genreNames}<br>
            ${langName.toUpperCase()}<br>
            <span style="font-size:0.85em; color:#FFD700; font-weight:600;">
              ${movie.m ? movie.m.map(id => MAP.m[id]).join(" • ") : ""}
            </span>
          </div>
        </div>
      </div>
    `;
  });

  resultsGrid.innerHTML = html;
}
