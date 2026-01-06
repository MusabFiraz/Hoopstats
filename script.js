// ===== TEAM DATA (Warriors real, Lakers placeholder) =====
const TEAMS = {
  warriors: {
    name: "Golden State Warriors",
    record: "32 - 18",
    star: "Stephen Curry",
    starStats: "29.8 PPG, 6.2 APG, 5.1 RPG",
    colorPrimary: "#1d428a",
    colorAccent: "#ffc72c",
    gradientTop: "#1d428a",
    gradientBottom: "#0b1a33"
  },
  lakers: {
    name: "Los Angeles Lakers (Example)",
    record: "Example: 25 - 22",
    star: "LeBron James (Example)",
    starStats: "27.0 PPG, 7.0 APG, 7.5 RPG",
    colorPrimary: "#552583",
    colorAccent: "#fdb927",
    gradientTop: "#2b1b3f",
    gradientBottom: "#120617"
  }
};

// Run when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  setupTeamSelector();
  setupCarousel();
  setupNewsAPI();
  setupChat();
  setupContactForm();
});

// ===== TEAM SELECTOR (HOME ONLY) =====
function setupTeamSelector() {
  const select = document.getElementById("teamSelect");
  if (!select) return;

  const nameEl = document.getElementById("currentTeamName");
  const recordEl = document.getElementById("currentTeamRecord");
  const starEl = document.getElementById("currentTeamStar");
  const starStatsEl = document.getElementById("currentTeamStarStats");

  function applyTeam(teamKey) {
    const t = TEAMS[teamKey];
    if (!t) return;

    nameEl.textContent = t.name;
    recordEl.textContent = t.record;
    starEl.textContent = t.star;
    starStatsEl.textContent = t.starStats;

    // update CSS variables for theme
    document.documentElement.style.setProperty("--primary-color", t.colorPrimary);
    document.documentElement.style.setProperty("--accent-color", t.colorAccent);
    document.documentElement.style.setProperty("--bg-gradient-top", t.gradientTop);
    document.documentElement.style.setProperty("--bg-gradient-bottom", t.gradientBottom);
  }

  // initial
  applyTeam(select.value);

  select.addEventListener("change", () => applyTeam(select.value));
}

// ===== HOMEPAGE CAROUSEL =====
function setupCarousel() {
  const view = document.getElementById("carouselView");
  const captionEl = document.getElementById("carouselCaption");
  const leftBtn = document.querySelector(".carousel-btn.left");
  const rightBtn = document.querySelector(".carousel-btn.right");
  if (!view || !captionEl || !leftBtn || !rightBtn) return;

  // --- REAL IMAGE SLIDES ---
  const slides = [
    {
      src: "images/warriors1.jpg",
      caption: "Stephen Curry pulling up from deep."
    },
    {
      src: "images/warriors2.jpg",
      caption: "Warriors celebrating a big win."
    },
    {
      src: "images/warriors3.jpg",
      caption: "Curry finishing strong at the rim."
    }
  ];

  // INSERT IMAGE ELEMENT INTO CAROUSEL
  const img = document.createElement("img");
  img.classList.add("carousel-img");
  view.insertBefore(img, captionEl);

  let index = 0;

  function renderSlide() {
    img.src = slides[index].src;
    captionEl.textContent = slides[index].caption;
  }

  renderSlide();

  leftBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    renderSlide();
  });

  rightBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    renderSlide();
  });
}

// ===== NEWS PAGE: TEAM-SPECIFIC GAME FEED =====
function setupNewsAPI() {
  const btn = document.getElementById("loadNewsBtn");
  const results = document.getElementById("newsResults");
  if (!btn || !results) return;

  const TEAM_IDS = {
    warriors: 10,
    lakers: 14
  };

  const savedTeam = localStorage.getItem("selectedTeam") || "warriors";
  const teamId = TEAM_IDS[savedTeam];

  const today = new Date().toISOString().split("T")[0];

  btn.addEventListener("click", async () => {
    results.textContent = `Loading real ${savedTeam} games...`;

    try {
      const res = await fetch(
        `https://api.balldontlie.io/v1/games?team_ids[]=${teamId}&start_date=2023-10-01&end_date=${today}&per_page=5`,
        {
          headers: { "Authorization": "c7185af4-460f-488d-8b78-0669c55422bc" }
        }
      );

      if (!res.ok) throw new Error("HTTP error " + res.status);
      const data = await res.json();

      results.innerHTML = data.data
        .map(game => `
          <div class="news-item">
            <strong>${game.visitor_team.full_name}</strong> @
            <strong>${game.home_team.full_name}</strong><br>
            Final Score: ${game.visitor_team_score} - ${game.home_team_score}
          </div>
        `)
        .join("");

      if (data.data.length === 0) {
        results.innerHTML = `
          <div class="news-item">No recent games found for this team.</div>
        `;
      }

    } catch (err) {
      console.error(err);
      results.innerHTML = `
        <div class="news-item">
          Unable to load NBA data right now. Please try again later.
        </div>`;
    }
  });
}


// ===== CHAT PAGE =====
function setupChat() {
  const input = document.getElementById("chatInput");
  const btn = document.getElementById("chatSendBtn");
  const list = document.getElementById("chatMessages");
  if (!input || !btn || !list) return;

  btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
    input.value = "";
    list.scrollTop = list.scrollHeight;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btn.click();
    }
  });
}

// ===== CONTACT FORM =====
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks for your message! (This is a demo site.)");
    form.reset();
  });
}
