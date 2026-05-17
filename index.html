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

function clearFilters() {
  // Reset all select elements to default
  document.getElementById("type").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("language").value = "";
  document.getElementById("mood").value = "";
  document.getElementById("year").value = "";
  document.getElementById("popularity").value = "";
  document.getElementById("platform").value = "";
  
  // Refresh the grid
  findSuggestion();
}

function getImageUrl(path) {
  return path ? "https://image.tmdb.org/t/p/w500" + path : "https://via.placeholder.com/300x450?text=No+Poster";
}

// 🎯 FIND PICKS (Homepage Auto-Filter)
async function findSuggestion() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p style="color:#B0B0B0; text-align:center; width:100%; padding:20px 0;">Updating your picks...</p>`;

  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const typeVal = document.getElementById("type").value;
    const genreVal = parseInt(document.getElementById("genre").value);
    const langVal = document.getElementById("language").value;
    const moodVal = parseInt(document.getElementById("mood").value);
    const popVal = document.getElementById("popularity").value;

    let results = data.filter(item => {
      // Custom mapping for Anime since it spans movies & series in JSON
      let matchType = true;
      if (typeVal === "anime") {
        matchType = (item.l === "jp" || (item.g && item.g.includes(12))); // 12 is Animation
      } else if (typeVal) {
        matchType = (item.ty === parseInt(typeVal));
      }

      const matchGenre = !genreVal || (item.g && item.g.includes(genreVal));
      const matchLang = !langVal || (item.l === langVal);
      const matchMood = !moodVal || (item.m && item.m.includes(moodVal));

      return matchType && matchGenre && matchLang && matchMood;
    });

    // Simulate Popularity Sorting
    if (popVal === "trending" || popVal === "recently_popular") {
      results = results.sort(() => 0.5 - Math.random());
    } else if (popVal === "top_rated" || popVal === "most_watched") {
      results = results.sort((a, b) => b.id - a.id);
    }

    displayResults(results, "Your Picks 🍿");
  } catch (e) {
    console.error("Filter Error:", e);
    resultsDiv.innerHTML = `<p style="color:#ff4d4d; width:100%; text-align:center;">Error loading data.</p>`;
  }
}

// 🖼️ RENDER ENGINE (Homepage Grid)
function displayResults(results, title) {
  const resultsDiv = document.getElementById("results");
  document.getElementById("results-title").innerText = title;

  if (results.length === 0) {
    resultsDiv.innerHTML = `<p style="color:#B0B0B0; text-align:center; width:100%; min-height:30vh; display:flex; align-items:center; justify-content:center;">Sorry, no matches found. Try clearing some filters.</p>`;
    return;
  }

  // Limit to 6 random from results (or top 6 if sorted)
  const finalSelection = results.slice(0, 6);

  let html = "";
  finalSelection.forEach(movie => {
    const genreNames = movie.g ? movie.g.map(id => MAP.g[id]).join(", ") : "Various";
    const langName = MAP.l[movie.l] || movie.l;

    html += `
      <div class="movie-card" onclick="openSearchOverlay(); applyRecentSearch('${movie.t.replace(/'/g, "\\'")}')">
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
   🔥 UPGRADED SEARCH OVERLAY LOGIC
========================================= */
let searchDataCache = []; 
const RECENT_SEARCHES_KEY = "cinedive_recent_searches";

async function openSearchOverlay() {
  document.getElementById("search-overlay").classList.add("active");
  document.body.classList.add("search-active"); 
  
  setTimeout(() => {
    document.getElementById("overlay-search-input").focus();
  }, 100);

  // Pre-fetch data
  if (searchDataCache.length === 0) {
    try {
      const response = await fetch("data.json");
      searchDataCache = await response.json();
    } catch (e) {
      console.error("Failed to load search data:", e);
    }
  }

  // Render Default State Views (Recent, Trending, Featured)
  renderRecentSearches();
  populateHorizontalSections();
}

function closeSearchOverlay() {
  document.getElementById("search-overlay").classList.remove("active");
  document.body.classList.remove("search-active");
  
  // Reset overlay to default view
  document.getElementById("overlay-search-input").value = "";
  handleRealTimeSearch(""); 
}

/* --- RECENT SEARCHES LOGIC --- */
function getRecentSearches() {
  return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
}

function saveRecentSearch(query) {
  if (!query.trim()) return;
  let searches = getRecentSearches();
  
  // Remove duplicates
  searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
  
  // Add to front and keep max 5
  searches.unshift(query.trim()); 
  if (searches.length > 5) searches.pop(); 
  
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

function renderRecentSearches() {
  const list = document.getElementById("recent-searches-list");
  const section = document.getElementById("recent-searches-section");
  const searches = getRecentSearches();

  if (searches.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  list.innerHTML = searches.map(query => `
    <li class="recent-search-item" onclick="applyRecentSearch('${query.replace(/'/g, "\\'")}')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      ${query}
    </li>
  `).join("");
}

function applyRecentSearch(query) {
  const input = document.getElementById("overlay-search-input");
  input.value = query;
  handleRealTimeSearch(query);
}

function handleSearchEnter(event, query) {
  if (event.key === "Enter") {
    saveRecentSearch(query);
    event.target.blur(); // Dismiss keyboard on mobile devices
  }
}

/* --- TRENDING & FEATURED LOGIC --- */
function populateHorizontalSections() {
  if (!searchDataCache || searchDataCache.length === 0) return;
  
  const trendingContainer = document.getElementById("trending-scroll");
  const featuredContainer = document.getElementById("featured-scroll");

  // Prevent re-rendering if already populated
  if (trendingContainer.innerHTML.trim() !== "") return;

  // Shuffle cache to simulate Trending and Featured lists
  const shuffled = [...searchDataCache].sort(() => 0.5 - Math.random());
  
  trendingContainer.innerHTML = generateHorizontalCards(shuffled.slice(0, 8));
  featuredContainer.innerHTML = generateHorizontalCards(shuffled.slice(8, 16));
}

function generateHorizontalCards(items) {
  let html = "";
  items.forEach(movie => {
    const genreNames = movie.g ? movie.g.map(id => MAP.g[id]).join(", ") : "Various";
    html += `
      <div class="movie-card" onclick="applyRecentSearch('${movie.t.replace(/'/g, "\\'")}')">
        <img src="${getImageUrl(movie.p)}" loading="lazy">
        <div class="movie-info">
          <div class="movie-title">${movie.t}</div>
          <div class="movie-meta" style="font-size:11px;">${genreNames}</div>
        </div>
      </div>
    `;
  });
  return html;
}

/* --- REAL-TIME SEARCH FILTERING --- */
function handleRealTimeSearch(query) {
  const defaultState = document.getElementById("search-default-state");
  const resultsState = document.getElementById("search-results-state");
  const resultsGrid = document.getElementById("search-overlay-results");
  const emptyState = document.getElementById("search-empty-state");

  query = query.toLowerCase().trim();

  // View Toggling: If empty, show default view. If typing, show results.
  if (!query) {
    defaultState.classList.remove("hidden");
    resultsState.classList.add("hidden");
    renderRecentSearches(); 
    return;
  }

  defaultState.classList.add("hidden");
  resultsState.classList.remove("hidden");

  // Filter based on Title, Genre, Language, or Type
  const filtered = searchDataCache.filter(item => {
    const titleMatch = item.t.toLowerCase().includes(query);
    const genreMatch = item.g ? item.g.some(id => MAP.g[id] && MAP.g[id].toLowerCase().includes(query)) : false;
    const langName = MAP.l[item.l] ? MAP.l[item.l].toLowerCase() : "";
    const typeName = MAP.ty[item.ty] ? MAP.ty[item.ty].toLowerCase() : "";

    return titleMatch || genreMatch || langName.includes(query) || typeName.includes(query);
  });

  // Displaying Results
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
  
  results.forEach(movie => {
    const genreNames = movie.g ? movie.g.map(id => MAP.g[id]).join(", ") : "Various";
    const langName = MAP.l[movie.l] || movie.l;

    html += `
      <div class="movie-card" onclick="applyRecentSearch('${movie.t.replace(/'/g, "\\'")}')">
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
