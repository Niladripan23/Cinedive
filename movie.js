/* =========================================
   movie.js — Cinedive Movie Detail Page
========================================= */

const API_KEY = "d2c069361eb58ac9b3fcfaeb997a0105";

// ⚡ Replace with your Amazon Associates tag
const AMAZON_AFFILIATE_TAG = "YOUR-AFFILIATE-TAG-21";

const MAP = {
  g:  { 1:"Action", 2:"Comedy", 3:"Romance", 4:"Horror", 5:"Crime",
        6:"Sci-Fi", 7:"Drama", 8:"Adventure", 9:"Fantasy", 10:"History",
        11:"Thriller", 12:"Animation" },
  m:  { 31:"Fun", 32:"Chill", 33:"Dark", 34:"Mysterious", 35:"Emotional",
        36:"Inspiring", 37:"Romantic", 38:"Mindblowing", 39:"Anime Night" },
  ty: { 51:"Movie", 52:"Series", 53:"Documentary" },
  l:  { en:"English", hi:"Hindi", be:"Bengali", sp:"Spanish",
        jp:"Japanese", kr:"Korean", sind:"South Indian" }
};

const TAG_CLASS = {
  1:"tag-action", 2:"tag-comedy", 3:"tag-romance", 4:"tag-horror",
  5:"tag-crime",  6:"tag-scifi",  7:"tag-drama",   8:"tag-adventure",
  9:"tag-fantasy",10:"tag-history",11:"tag-thriller",12:"tag-animation"
};

const TMDB_BACKDROP = "https://image.tmdb.org/t/p/w1280";

// ── PLATFORM CONFIG ──────────────────────────────────────────
// normalized name → { logo, link function }
const PLATFORM_CONFIG = {
  "Netflix":      { logo: "platformlogos/netflix.png" },
  "Prime Video":  { logo: "platformlogos/primevideo.png" },
  "Apple TV+":    { logo: "platformlogos/appletv+.png" },
  "Disney+":      { logo: "platformlogos/disney+.png" },
  "SonyLIV":      { logo: "platformlogos/SonyLIV.png" },
  "Hoichoi":      { logo: "platformlogos/Hoichoi.png" },
  "JioHotstar":   { logo: "platformlogos/JioHotstar.png" },
  "Max":          { logo: "platformlogos/Max.png" },
  "Crunchyroll":  { logo: "platformlogos/Crunchyroll.png" },
  "YouTube":      { logo: "platformlogos/YouTube.png" }
};

const PLATFORM_NAME_MAP = {
  "Amazon Prime Video"       : "Prime Video",
  "Amazon Video"             : "Prime Video",
  "Prime Video"              : "Prime Video",
  "Netflix"                  : "Netflix",
  "Disney Plus"              : "Disney+",
  "Disney+"                  : "Disney+",
  "Disney+ Hotstar"          : "JioHotstar",
  "Jio Hotstar"              : "JioHotstar",
  "JioCinema"                : "JioHotstar",
  "Jio Cinema"               : "JioHotstar",
  "Sony Liv"                 : "SonyLIV",
  "SonyLIV"                  : "SonyLIV",
  "Hoichoi"                  : "Hoichoi",
  "Apple TV"                 : "Apple TV+",
  "Apple TV Plus"            : "Apple TV+",
  "Apple TV+"                : "Apple TV+",
  "Apple TV Store"           : "Apple TV+",
  "Apple TV Amazon Channel"  : "Apple TV+",
  "HBO Max"                  : "Max",
  "Max"                      : "Max",
  "Crunchyroll"              : "Crunchyroll",
  "YouTube"                  : "YouTube"
};

function getPlatformLink(name, movieTitle) {
  const q = encodeURIComponent(movieTitle);
  switch (name) {
    case "Prime Video":
      return `https://www.amazon.in/s?k=${q}&i=instant-video&tag=${AMAZON_AFFILIATE_TAG}`;
    case "Netflix":
      return `https://www.netflix.com/search?q=${q}`;
    case "Disney+":
      return `https://www.hotstar.com/in/search?q=${q}`;
    case "JioHotstar":
      return `https://www.jiohotstar.com/search?q=${q}`;
    case "SonyLIV":
      return `https://www.sonyliv.com/search/${q}`;
    case "Hoichoi":
      return `https://www.hoichoi.tv/search?q=${q}`;
    case "Apple TV+":
      return `https://tv.apple.com/search?term=${q}`;
    case "Max":
      return `https://www.max.com/search?q=${q}`;
    case "Crunchyroll":
      return `https://www.crunchyroll.com/search?q=${q}`;
    case "YouTube":
      return `https://www.youtube.com/results?search_query=${q}`;
    default:
      return "#";
  }
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const params  = new URLSearchParams(window.location.search);
  const movieId = parseInt(params.get("id"));

  if (!movieId) {
    document.getElementById("mpTitle").textContent = "Movie not found";
    return;
  }

  let dataArr = [];
  try {
    const res = await fetch("data.json");
    dataArr   = await res.json();
  } catch (e) {
    console.error("Could not load data.json", e);
  }

  const movie = dataArr.find(m => m.id === movieId);
  if (!movie) {
    document.getElementById("mpTitle").textContent = "Movie not found";
    return;
  }

  // Detect country
  let userCountry = "IN";
  try {
    const geoRes = await fetch("https://ipapi.co/json/");
    if (geoRes.ok) {
      const geo = await geoRes.json();
      if (geo.country_code) userCountry = geo.country_code;
    }
  } catch (e) {
    console.warn("ipapi.co failed, defaulting to IN", e);
  }

  let tmdbData = null;
  try {
    const endpoint = (movie.ty === 52) ? "tv" : "movie";
    const tmdbUrl  = `https://api.themoviedb.org/3/${endpoint}/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,watch/providers`;
    const res = await fetch(tmdbUrl);
    if (res.ok) tmdbData = await res.json();
  } catch (e) {
    console.error("TMDB fetch failed", e);
  }

  // Best trailer
  let trailerKey = null;
  if (tmdbData?.videos?.results?.length) {
    const vids = tmdbData.videos.results;
    trailerKey =
      (vids.find(v => v.type === "Trailer" && v.site === "YouTube" && v.official) ||
       vids.find(v => v.type === "Trailer" && v.site === "YouTube") ||
       vids.find(v => v.type === "Teaser"  && v.site === "YouTube") ||
       vids.find(v => v.site === "YouTube"))?.key || null;
  }

  populatePage(movie, tmdbData, userCountry);
  initBackGesture();
  initTrailerModal(trailerKey);
  initShareBtn(movie);
});

// ─── POPULATE ────────────────────────────────────────────────
function populatePage(movie, tmdbData, userCountry) {

  document.getElementById("mpTitle").textContent = movie.t;
  document.title = `${movie.t} — Cinedive`;

  // Hero backdrop
  const hero   = document.getElementById("mpHero");
  const bgPath = movie.bgp || movie.p;
  if (bgPath && hero) {
    hero.style.backgroundImage    = `url('${TMDB_BACKDROP}${bgPath}')`;
    hero.style.backgroundSize     = "cover";
    hero.style.backgroundPosition = "center";
  }

  // Meta row
  const metaRow = document.getElementById("mpMetaRow");
  let metaHTML  = "";
  if (MAP.ty[movie.ty]) metaHTML += `<span class="mp-pill">${MAP.ty[movie.ty]}</span>`;
  if (movie.y) metaHTML += `<span class="mp-pill" style="color:#888;">${movie.y}</span>`;
  if (tmdbData?.vote_average && tmdbData.vote_average > 0) {
    metaHTML += `<span class="mp-pill-rating">★ ${tmdbData.vote_average.toFixed(1)}</span>`;
  }
  (movie.g || []).slice(0, 3).forEach(id => {
    if (MAP.g[id]) metaHTML += `<span class="tag ${TAG_CLASS[id] || ''}">${MAP.g[id]}</span>`;
  });
  (movie.m || []).slice(0, 2).forEach(id => {
    if (MAP.m[id]) metaHTML += `<span class="tag tag-mood">${MAP.m[id]}</span>`;
  });
  metaRow.innerHTML = metaHTML;

  // Summary
  document.getElementById("mpSummary").textContent = tmdbData?.overview || "No summary available.";

  // Cast
  let castStr = "—";
  if (tmdbData?.credits?.cast?.length) {
    castStr = tmdbData.credits.cast.slice(0, 5).map(c => c.name).join(", ");
  }
  document.getElementById("mpCast").textContent = castStr;

  // Director / Created By
  let directorStr = "—";
  if (movie.ty === 52) {
    const creators = tmdbData?.created_by || [];
    if (creators.length) directorStr = creators.slice(0, 2).map(c => c.name).join(", ");
    document.getElementById("mpDirectorLabel").textContent = "Created By";
  } else {
    const crew = tmdbData?.credits?.crew || [];
    const dirs = crew.filter(c => c.job === "Director").slice(0, 2);
    if (dirs.length) directorStr = dirs.map(d => d.name).join(", ");
  }
  document.getElementById("mpDirector").textContent = directorStr;

  // ── Available On ─────────────────────────────────────────
  const platformsEl = document.getElementById("mpPlatforms");
  const providers   = tmdbData?.["watch/providers"]?.results;
  let html          = "";

  if (providers) {
    const regionData = providers[userCountry] || providers["US"];

    if (regionData) {
      // Collect all provider entries — flatrate first (streaming), then rent/buy
      const allProviders = [
        ...(regionData.flatrate || []),
        ...(regionData.free     || []),
        ...(regionData.ads      || []),
        ...(regionData.rent     || []),
        ...(regionData.buy      || [])
      ];

      // Normalize names, deduplicate, filter to allowed only
      const seen = new Set();
      const validPlatforms = [];

      allProviders.forEach(p => {
        const normalized = PLATFORM_NAME_MAP[p.provider_name];
        if (normalized && !seen.has(normalized) && PLATFORM_CONFIG[normalized]) {
          seen.add(normalized);
          validPlatforms.push(normalized);
        }
      });

      if (validPlatforms.length > 0) {
        html = '<div class="mp-platforms-row">';
        validPlatforms.forEach(name => {
          const link = getPlatformLink(name, movie.t);
          const logo = PLATFORM_CONFIG[name].logo;
          html += `
            <a href="${link}" target="_blank" rel="noopener noreferrer"
               class="mp-platform-btn" title="Watch on ${name}">
              <img src="${logo}" alt="${name}" class="mp-platform-logo">
            </a>`;
        });
        html += '</div>';
        platformsEl.innerHTML = html;
      } else {
        platformsEl.textContent = "Not available for streaming";
      }
    } else {
      platformsEl.textContent = "Not available for streaming";
    }
  } else {
    platformsEl.textContent = "Not available for streaming";
  }

  // Language
  document.getElementById("mpLanguages").textContent = MAP.l[movie.l] || movie.l || "—";
}

// ─── BACK GESTURE ────────────────────────────────────────────
function initBackGesture() {
  document.getElementById("mpBackBtn").addEventListener("click", goBack);

  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (dx > 80 && touchStartX < 40 && dy < 60) goBack();
  }, { passive: true });

  window.addEventListener("popstate", () => goBack());
}

function goBack() {
  if (document.referrer && document.referrer.includes(window.location.hostname)) {
    history.back();
  } else {
    window.location.href = "index.html";
  }
}

// ─── TRAILER MODAL ───────────────────────────────────────────
function initTrailerModal(trailerKey) {
  const modal      = document.getElementById("mpTrailerModal");
  const frameWrap  = document.getElementById("mpTrailerFrameWrap");
  const closeBtn   = document.getElementById("mpTrailerClose");
  const backdrop   = document.getElementById("mpTrailerBackdrop");
  const trailerBtn = document.getElementById("mpTrailerBtn");

  function openTrailer() {
    if (!trailerKey) {
      trailerBtn.style.opacity = "0.5";
      trailerBtn.title = "Trailer not available";
      return;
    }
    frameWrap.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>`;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeTrailer() {
    modal.classList.remove("active");
    frameWrap.innerHTML = "";
    document.body.style.overflow = "";
  }

  trailerBtn.addEventListener("click", openTrailer);
  closeBtn.addEventListener("click", closeTrailer);
  backdrop.addEventListener("click", closeTrailer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeTrailer(); });
}

// ─── SHARE ───────────────────────────────────────────────────
function initShareBtn(movie) {
  document.getElementById("mpShareBtn").addEventListener("click", async () => {
    const shareData = {
      title: movie.t,
      text:  `Check out ${movie.t} on Cinedive!`,
      url:   window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  });
}
