const API_KEY = "d2c069361eb58ac9b3fcfaeb997a0105";

function showFilters() {
  document.getElementById("filters").classList.remove("hidden");
}

// 🔥 TMDB poster fetch (optimized)
async function getPoster(title) {
  try {
    let url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
    let res = await fetch(url);
    let data = await res.json();

    if (data.results && data.results.length) {
      let item = data.results.find(i => i.poster_path);
      if (item) {
        return "https://image.tmdb.org/t/p/w500" + item.poster_path;
      }
    }
  } catch (e) {
    console.log("Poster error:", e);
  }

  return "https://via.placeholder.com/300x450?text=" + encodeURIComponent(title);
}

// 🎯 FIND PICKS
async function findSuggestion() {
  const resultsDiv = document.getElementById("results");

  // ✅ Loading state (centered)
  resultsDiv.className = "";
  resultsDiv.style.display = "flex";
  resultsDiv.style.justifyContent = "center";
  resultsDiv.style.alignItems = "center";
  resultsDiv.style.textAlign = "center";
  resultsDiv.style.minHeight = "60vh";
  resultsDiv.innerHTML = `<p style="color:#aaa;">Finding your picks...</p>`;

  const response = await fetch("data.json");
  const data = await response.json();

  const type = document.getElementById("type").value;
  const genre = document.getElementById("genre").value;
  const language = document.getElementById("language").value;
  const mood = document.getElementById("mood").value;

  let results = data.filter(item => {
    let match =
      (!type || item.type === type) &&
      (!genre || item.genre === genre) &&
      (!language || item.language === language);

    if (mood) {
      match = match && item.mood && item.mood.some(m =>
        m.toLowerCase().includes(mood.toLowerCase()) ||
        mood.toLowerCase().includes(m.toLowerCase())
      );
    }

    return match;
  });

  // 🎲 Random 6
  results = results.sort(() => 0.5 - Math.random()).slice(0, 6);

  document.getElementById("results-title").innerText = "Your Picks 🍿";

  const posters = await Promise.all(
    results.map(movie => getPoster(movie.title))
  );

  let html = "";

  results.forEach((movie, i) => {
    html += `
      <div class="movie-card">
        <img src="${posters[i]}" loading="lazy">
        <div class="movie-info">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-meta">
            ${movie.genre} • ${movie.duration}<br>
            ${movie.language}<br>
            Watch on: ${movie.platform}
          </div>
        </div>
      </div>
    `;
  });

  // 🔹 Empty state
  if (!html) {
    resultsDiv.className = "";
    resultsDiv.style.display = "flex";
    resultsDiv.style.justifyContent = "center";
    resultsDiv.style.alignItems = "center";
    resultsDiv.style.textAlign = "center";
    resultsDiv.style.minHeight = "60vh";
    resultsDiv.innerHTML = `<p style="color:#aaa;">Sorry, No matches found. Try different filters.</p>`;
    return;
  }

  // 🔥 Apply grid properly (NO INLINE GRID BREAK)
  resultsDiv.className = "results-grid";
  resultsDiv.style = ""; // reset inline styles
  resultsDiv.innerHTML = html;
}

// 🎲 SURPRISE PICKS
async function randomPicks() {
  const resultsDiv = document.getElementById("results");

  // ✅ Loading state
  resultsDiv.className = "";
  resultsDiv.style.display = "flex";
  resultsDiv.style.justifyContent = "center";
  resultsDiv.style.alignItems = "center";
  resultsDiv.style.textAlign = "center";
  resultsDiv.style.minHeight = "60vh";
  resultsDiv.innerHTML = `<p style="color:#aaa;">Loading surprise picks...</p>`;

  const response = await fetch("data.json");
  const data = await response.json();

  let results = data.sort(() => 0.5 - Math.random()).slice(0, 6);

  document.getElementById("results-title").innerText = "Surprise Picks 🎲";

  const posters = await Promise.all(
    results.map(movie => getPoster(movie.title))
  );

  let html = "";

  results.forEach((movie, i) => {
    html += `
      <div class="movie-card">
        <img src="${posters[i]}" loading="lazy">
        <div class="movie-info">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-meta">
            ${movie.genre} • ${movie.duration}<br>
            ${movie.language}<br>
            Watch on: ${movie.platform}
          </div>
        </div>
      </div>
    `;
  });

  // 🔹 Empty state
  if (!html) {
    resultsDiv.className = "";
    resultsDiv.style.display = "flex";
    resultsDiv.style.justifyContent = "center";
    resultsDiv.style.alignItems = "center";
    resultsDiv.style.textAlign = "center";
    resultsDiv.style.minHeight = "60vh";
    resultsDiv.innerHTML = `<p style="color:#aaa;">Sorry, No surprise picks found.</p>`;
    return;
  }

  // 🔥 Apply grid properly
  resultsDiv.className = "results-grid";
  resultsDiv.style = "";
  resultsDiv.innerHTML = html;
}