// ==============================
// DATA
// ==============================
const ustazData = [
  { name: "Ahmed Ali", gender: "male", subjects: ["Tajweed", "Hifz"], rating: 4.9 },
  { name: "Fatima Hassan", gender: "female", subjects: ["Quran"], rating: 4.8 },
  { name: "Musa Ibrahim", gender: "male", subjects: ["Tajweed"], rating: 4.7 },
  { name: "Aisha Ali", gender: "female", subjects: ["Hifz"], rating: 4.9 }
];

// ==============================
// BACKEND URL
// ==============================
const BASE_URL = "https://ustaz-backend--hmdclent.replit.app/api";

let currentFilter = "All";

function handleRoleChange(role) {
  const ustazFields = document.getElementById("ustazFields");
  if (!ustazFields) return;

  if (role === "ustaz") {
    ustazFields.classList.remove("hidden");
  } else {
    ustazFields.classList.add("hidden");
  }
}

// ==============================
// INIT (SINGLE ENTRY POINT)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initFilters();
  initSearch();
  renderAll();

  
  // ==============================
// SEE ALL POPULAR
// ==============================
const seeAllBtn = document.querySelector(".see-all");

if (seeAllBtn) {
  seeAllBtn.addEventListener("click", () => {
    document.getElementById("ustazList").scrollIntoView({
      behavior: "smooth"
    });
  });
}
  // ===============================
  // CUSTOM ROLE SELECT
  // ===============================
  const roleSelectBox = document.querySelector("#roleSelect .select-box");
  const roleDropdown = document.querySelector("#roleSelect .dropdown");
  const roleText = document.getElementById("roleText");

  window.selectedRole = "";

  if (roleSelectBox && roleDropdown) {
    roleSelectBox.addEventListener("click", () => {
      roleDropdown.classList.toggle("hidden");
    });

    roleDropdown.querySelectorAll(".option").forEach(opt => {
      opt.addEventListener("click", () => {
        window.selectedRole = opt.dataset.value;
        roleText.innerText = opt.innerText;

        handleRoleChange(window.selectedRole); // ✅ THIS IS THE FIX
        roleDropdown.classList.add("hidden");
      });
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#roleSelect")) {
        roleDropdown.classList.add("hidden");
      }
    });
  }
});

// ==============================
// FIND USTAZ NEAR YOU
// ==============================
document.getElementById("findUstazBtn").addEventListener("click", () => {
  document.getElementById("popularSection").scrollIntoView({
    behavior: "smooth"
  });
});

// ==============================
// LANGUAGE DROPDOWN
// ==============================
function initLanguage() {
  const langToggle = document.getElementById("langToggle");
  const langMenu = document.getElementById("langMenu");

  if (!langToggle || !langMenu) return;

  langToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.style.display =
      langMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-wrapper")) {
      langMenu.style.display = "none";
    }
  });

  document.querySelectorAll(".lang-dropdown p").forEach(item => {
    item.addEventListener("click", () => {
      const lang = item.dataset.lang;
      console.log("Language:", lang);
      langMenu.style.display = "none";
    });
  });
}

// ==============================
// THEME SYSTEM
// ==============================
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const saved = localStorage.getItem("theme");

  if (saved === "light") {
    document.body.classList.add("light-mode");
    themeToggle.classList.replace("fa-moon", "fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");

    themeToggle.classList.replace(
      isLight ? "fa-moon" : "fa-sun",
      isLight ? "fa-sun" : "fa-moon"
    );

    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// ==============================
// RENDER
// ==============================
let pendingAction = null;

function requireAuth(action) {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    pendingAction = action;
    overlay.style.display = "flex";
    showSignup();
    return;
  }

  action();
}

function renderAll() {
  renderPopular();
  renderList(ustazData);
}

// ==============================
// POPULAR
// ==============================
function renderPopular() {
  const container = document.getElementById("popularList");
  if (!container) return;

  container.innerHTML = ustazData.map(u =>
    `<div class="small-card" onclick="openPopularProfile('${u.name}')">
      <div class="avatar"></div>
      <div class="small-name">${u.name.split(" ")[0]}</div>
      <div class="small-rating">⭐ ${u.rating}</div>
    </div>`
  ).join("");
}

// ==============================
// LIST
// ==============================
function renderList(data) {
  const container = document.getElementById("ustazList");
  if (!container) return;

  container.innerHTML = data.map(u =>
    `<div class="card">
      <div class="avatar"></div>
      <div class="info">
        <div class="top">
          <div class="name">${u.name}</div>
          <div>⭐ ${u.rating}</div>
        </div>
        <div class="sub">${u.subjects.join(" • ")}</div>
        <div class="actions">
          <button class="btn chat" onclick="requireAuth(() => openChat('${u.name}'))">
            Chat
          </button>
          <button class="btn view" onclick="requireAuth(() => openProfile('${u.name}'))">
            View
          </button>
        </div>
      </div>
    </div>`
  ).join("");
}

// ==============================
// FILTERS
// ==============================
function initFilters() {
  const buttons = document.querySelectorAll(".filter");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.innerText;

      let filtered = ustazData;

      switch (currentFilter) {
        case "Male":
          filtered = ustazData.filter(u => u.gender === "male");
          break;
        case "Female":
          filtered = ustazData.filter(u => u.gender === "female");
          break;
        case "Hifz":
          filtered = ustazData.filter(u => u.subjects.includes("Hifz"));
          break;
        case "Tajweed":
          filtered = ustazData.filter(u => u.subjects.includes("Tajweed"));
          break;
      }

      renderList(filtered);
    });
  });
}

// ==============================
// SEARCH
// ==============================
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(val) ||
      u.subjects.join(" ").toLowerCase().includes(val)
    );

    renderList(filtered);
  });
}

function openPopularProfile(name) {
  requireAuth(() => {
    openProfile(name);
  });
}

// ===============================
// ELEMENTS
// ===============================
const overlay = document.getElementById("authOverlay");
const loginBtn = document.querySelector(".login");
const signupBtn = document.querySelector(".signup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const closeAuth = document.getElementById("closeAuth");

const goSignup = document.getElementById("goSignup");
const goLogin = document.getElementById("goLogin");

// ===============================
// OPEN MODAL
// ===============================
loginBtn.onclick = () => {
  overlay.style.display = "flex";
  showLogin();
};

signupBtn.onclick = () => {
  overlay.style.display = "flex";
  showSignup();
};

// ===============================
// CLOSE MODAL
// ===============================
closeAuth.onclick = () => overlay.style.display = "none";

overlay.onclick = (e) => {
  if (e.target === overlay) overlay.style.display = "none";
};

// ===============================
// SWITCH FORMS
// ===============================
function showLogin() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  document.getElementById("authTitle").innerText = "Welcome Back";
}

function showSignup() {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  document.getElementById("authTitle").innerText = "Create Account";
}

if (goSignup) goSignup.onclick = showSignup;
if (goLogin) goLogin.onclick = showLogin;

// ===============================
// PASSWORD TOGGLE 👁
// ===============================
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// ===============================
// ETHIOPIAN PHONE VALIDATION 🇪🇹
// ===============================
function validatePhone(phone) {
  const p = phone.replace(/\s+/g, "");

  if (/^9\d{8}$/.test(p)) return "+251" + p;
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);

  return null;
}

// ===============================
// LOGIN (DEMO)
// ===============================
function login() {
  const phoneInput = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;

  const phone = validatePhone(phoneInput);

  if (!phone || !pass) {
    alert("Enter valid Ethiopian phone and password");
    return;
  }

  console.log("LOGIN:", phone, pass);
  alert("Login successful (demo)");
}

// ===============================
// SIGNUP (UPDATED)
// ===============================
function signup() {
  const role = window.selectedRole;

  const first = document.getElementById("firstName").value.trim();
  const last = document.getElementById("lastName").value.trim();
  const name = first + " " + last;

  if (!first || !last) {
    alert("Enter first and last name");
    return;
  }

  const phoneInput = document.getElementById("signupPhone").value;
  const subcityVal = document.getElementById("subcity").value;
  const areaVal = document.getElementById("area").value;
  const pass = document.getElementById("signupPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  const phone = validatePhone(phoneInput);

  // ✅ check passwords match
  if (pass !== confirmPass) {
    alert("Passwords do not match");
    return;
  }

  // 🔴 BASIC VALIDATION
  if (!role || !name || !phone || !subcityVal || !areaVal || !pass || !confirmPass) {
    alert("Please fill all required fields");
    return;
  }

  // ===============================
  // ✅ PARENT
  // ===============================
  if (role === "parent") {
    console.log("PARENT SIGNUP:", {
      role,
      name,
      phone,
      subcity: subcityVal,
      area: areaVal,
      pass
    });

    alert("Parent signup successful (demo)");
    return;
  }

  // ===============================
  // ✅ USTAZ
  // ===============================
  if (role === "ustaz") {
    const exp = document.getElementById("experience").value;
    const gender = document.getElementById("gender").value;

    if (!exp || !gender) {
      alert("Fill experience and gender");
      return;
    }

    console.log("USTAZ SIGNUP:", {
      role,
      name,
      phone,
      subcity: subcityVal,
      area: areaVal,
      experience: exp,
      gender,
      pass
    });

    alert("Ustaz signup successful (demo)");
  }
}

// ===============================
// SUBCITY → AREA
// ===============================
const areas = {
  bole: ["Gerji", "CMC"],
  yeka: ["Megenagna"],
  kirkos: ["Kazanchis"]
};

const subcity = document.getElementById("subcity");
const area = document.getElementById("area");

if (subcity) {
  subcity.addEventListener("change", () => {
    area.innerHTML = `<option value="">Select Area</option>`;

    if (!areas[subcity.value]) return;

    areas[subcity.value].forEach(a => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      area.appendChild(opt);
    });
  });
}
// ===============================
// SECONDARY BUTTON HERE → SERVICE SECTION
// ===============================
document.getElementById("viewFieldsBtn").onclick = () => {
  document.getElementById("services").scrollIntoView({
    behavior: "smooth"
  });
};

// ===============================
// NAV ACTIVE LINK
// ===============================
// ===============================
// NAV ACTIVE LINK (FIXED)
// ===============================
const navLinks = document.querySelectorAll(".nav a");

function setActive(id) {
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + id) {
      link.classList.add("active");
    }
  });
}

// Click behavior (IMPORTANT FIX)
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").replace("#", "");
    setActive(id);
  });
});

// Scroll behavior (stable version)
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");

  let current = "home";

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();

    if (rect.top <= 200 && rect.bottom >= 200) {
      current = sec.id;
    }
  });

  setActive(current);
});
// ==============================
// BLOG PROTECTION (LOGIN REQUIRED)
// ==============================
document.querySelectorAll("#blog .card-link").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    requireAuth(() => {
      // later you can open blog page or article
      console.log("Opening blog article...");
    });
  });
});

// ==============================
// POPULAR HORIZONTAL SCROLL
// ==============================
function scrollPopular(direction) {
  const container = document.getElementById("popularList");

  if (!container) return;

  container.scrollBy({
    left: direction * 200,
    behavior: "smooth"
  });
}
