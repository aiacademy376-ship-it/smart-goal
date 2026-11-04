/* =========================================================
   SMARTGOAL — APPLICATION ENGINE
   Version 3.0 | Frontend-first | Local storage
========================================================= */

(() => {
  "use strict";

  /* -------------------- CONFIG -------------------- */

  const DATA_KEY = "smartgoal_v3_data";
  const SETTINGS_KEY = "smartgoal_v3_settings";
  const SESSION_KEY = "smartgoal_v3_session";

  const DEFAULT_SETTINGS = {
    language: "uz",
    theme: "light",
    colorTheme: "violet",
    difficulty: "auto",
    sound: false,
    reducedMotion: false,
    routineReminders: false,
    fontSize: "medium"
  };

  const PAGE_TITLES = {
    dashboard: "Bosh sahifa",
    goals: "Maqsadlarim",
    schedule: "Vazifalar",
    planner: "Kun tartibim",
    analytics: "Statistika",
    achievements: "Yutuqlarim",
    rewards: "Mukofotlar do‘koni",
    community: "Hamjamiyat",
    ai: "Smart AI",
    notifications: "Bildirishnomalar",
    settings: "Sozlamalar",
    profile: "Mening profilim"
  };

  const RANKS = [
    { level: 1, name: "Boshlovchi", xp: 0 },
    { level: 2, name: "Izlanuvchi", xp: 100 },
    { level: 3, name: "Harakatdagi", xp: 250 },
    { level: 4, name: "Intiluvchan", xp: 500 },
    { level: 5, name: "Tirishqoq", xp: 850 },
    { level: 6, name: "Mahoratli", xp: 1300 },
    { level: 7, name: "Strateg", xp: 1900 },
    { level: 8, name: "Yetakchi", xp: 2700 },
    { level: 9, name: "Usta", xp: 3700 },
    { level: 10, name: "Afsona", xp: 5000 }
  ];

  const STORE_ITEMS = [
    {
      id: "theme-ocean",
      name: "Ocean mavzusi",
      description: "Profilingiz va interfeysingiz uchun sokin ko‘k rang.",
      type: "theme",
      value: "ocean",
      price: 80,
      icon: "waves"
    },
    {
      id: "theme-emerald",
      name: "Emerald mavzusi",
      description: "Yashil va nafis ko‘rinish.",
      type: "theme",
      value: "emerald",
      price: 120,
      icon: "leaf"
    },
    {
      id: "theme-sunset",
      name: "Sunset mavzusi",
      description: "Iliq ranglardagi maxsus interfeys.",
      type: "theme",
      value: "sunset",
      price: 160,
      icon: "sunset"
    },
    {
      id: "theme-rose",
      name: "Rose mavzusi",
      description: "Nafis pushti ranglar uyg‘unligi.",
      type: "theme",
      value: "rose",
      price: 200,
      icon: "flower-2"
    },
    {
      id: "background-midnight",
      name: "Midnight fon",
      description: "Profil uchun qoramtir, maxsus fon.",
      type: "background",
      value: "midnight",
      price: 250,
      icon: "moon-star"
    },
    {
      id: "background-galaxy",
      name: "Galaxy fon",
      description: "Maxsus kosmik profil foni.",
      type: "background",
      value: "galaxy",
      price: 400,
      icon: "orbit"
    },
    {
      id: "background-royal",
      name: "Royal fon",
      description: "Noyob premium profil dizayni.",
      type: "background",
      value: "royal",
      price: 650,
      icon: "crown"
    },
    {
      id: "badge-focus",
      name: "Focus badge",
      description: "Diqqat va intizom ramzi.",
      type: "badge",
      value: "focus",
      price: 120,
      icon: "crosshair"
    },
    {
      id: "badge-diamond",
      name: "Diamond badge",
      description: "Maxsus premium belgi.",
      type: "badge",
      value: "diamond",
      price: 300,
      icon: "gem"
    },
    {
      id: "theme-sky",
      name: "Sky mavzusi",
      description: "Yengil moviy ranglar va sokin ko‘rinish.",
      type: "theme",
      value: "sky",
      price: 90,
      icon: "cloud-sun"
    },
    {
      id: "background-sakura",
      name: "Sakura profil foni",
      description: "Profilingizga nozik va yorqin uslub.",
      type: "background",
      value: "sakura",
      price: 220,
      icon: "flower-2"
    },
    {
      id: "background-nebula",
      name: "Nebula profil foni",
      description: "Yulduzli kosmik bezak.",
      type: "background",
      value: "nebula",
      price: 360,
      icon: "orbit"
    },
    {
      id: "badge-builder",
      name: "Builder belgisi",
      description: "Har kuni o‘z ustida ishlaydiganlar uchun.",
      type: "badge",
      value: "builder",
      price: 100,
      icon: "hammer"
    },
    {
      id: "avatar-frame-gold",
      name: "Oltin avatar ramkasi",
      description: "Profil rasmingiz uchun oltin bezak.",
      type: "avatar",
      value: "gold",
      price: 260,
      icon: "crown"
    },
    {
      id: "avatar-premium",
      name: "Premium avatar ramkasi",
      description: "Profil rasmingiz uchun maxsus ramka.",
      type: "avatar",
      value: "premium",
      price: 360,
      icon: "frame"
    },
    {
      id: "background-aurora",
      name: "Aurora profil foni",
      description: "Yashil va binafsha shimol yog‘dusi uslubidagi fon.",
      type: "background",
      value: "aurora",
      price: 520,
      icon: "sparkles"
    },
    {
      id: "background-forest",
      name: "Forest profil foni",
      description: "Tabiat ranglaridagi sokin profil foni.",
      type: "background",
      value: "forest",
      price: 480,
      icon: "trees"
    },
    {
      id: "background-sunrise",
      name: "Sunrise profil foni",
      description: "Yangi kun va yangi maqsadlar uchun iliq fon.",
      type: "background",
      value: "sunrise",
      price: 450,
      icon: "sunrise"
    },
    {
      id: "badge-scholar",
      name: "Scholar belgisi",
      description: "Bilim va muntazam o‘rganish ramzi.",
      type: "badge",
      value: "Scholar",
      price: 240,
      icon: "graduation-cap"
    },
    {
      id: "badge-explorer",
      name: "Explorer belgisi",
      description: "Yangi ko‘nikmalarni sinab ko‘rish ramzi.",
      type: "badge",
      value: "Explorer",
      price: 280,
      icon: "compass"
    },
    {
      id: "avatar-frame-neon",
      name: "Neon avatar ramkasi",
      description: "Profil rasmingiz uchun yorqin neon ramka.",
      type: "avatar",
      value: "neon",
      price: 420,
      icon: "zap"
    }
  ];

  const ACHIEVEMENTS = [
    {
      id: "first-task",
      name: "Birinchi qadam",
      description: "Birinchi vazifangizni bajaring.",
      icon: "flag",
      condition: data => data.tasks.some(task => task.completed)
    },
    {
      id: "five-tasks",
      name: "Harakat boshlandi",
      description: "5 ta vazifani bajaring.",
      icon: "list-checks",
      condition: data => data.tasks.filter(task => task.completed).length >= 5
    },
    {
      id: "ten-tasks",
      name: "Tinimsiz harakat",
      description: "10 ta vazifani bajaring.",
      icon: "zap",
      condition: data => data.tasks.filter(task => task.completed).length >= 10
    },
    {
      id: "first-goal",
      name: "Maqsad sari",
      description: "Birinchi maqsadingizni yakunlang.",
      icon: "target",
      condition: data => data.goals.some(goal => goal.progress >= 100)
    },
    {
      id: "three-goals",
      name: "Maqsadlar ustasi",
      description: "3 ta maqsadni yakunlang.",
      icon: "trophy",
      condition: data => data.goals.filter(goal => goal.progress >= 100).length >= 3
    },
    {
      id: "xp-500",
      name: "500 XP",
      description: "500 ochko to‘plang.",
      icon: "coins",
      condition: data => Number(data.xp || 0) + Number(data.spentXP || 0) >= 500
    },
    {
      id: "xp-1000",
      name: "Minglik marrasi",
      description: "1000 ochko to‘plang.",
      icon: "gem",
      condition: data => Number(data.xp || 0) + Number(data.spentXP || 0) >= 1000
    }
  ];

  /* -------------------- HELPERS -------------------- */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const uid = () => (
    window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  const safeJSON = (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const today = () => { const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-"); };

  const formatDate = value => {
    if (!value) return "Sana belgilanmagan";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "Sana belgilanmagan";

    return date.toLocaleDateString(getLocale(), {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getLocale = () => ({
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US"
  })[settings.language] || "uz-UZ";

  const formatNumber = value => new Intl.NumberFormat(getLocale()).format(value || 0);

  function icon(name, size = 18) {
    return `<i data-lucide="${escapeHTML(name)}" width="${size}" height="${size}"></i>`;
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* -------------------- STORAGE -------------------- */

  function createInitialData() {
    return {
      version: 3,
      profile: {
        name: "SmartGoal foydalanuvchisi",
        username: "",
        birthdate: "",
        birthdatePublic: false,
        age: null,
        bio: "",
        avatar: "",
        background: "default",
        avatarFrame: "default",
        createdAt: new Date().toISOString()
      },
      xp: 0,
      spentXP: 0,
      goals: [],
      tasks: [],
      dailyRoutine: [],
      activity: [],
      achievements: [],
      inventory: [],
      notifications: [
        {
          id: uid(),
          title: "SmartGoal’ga xush kelibsiz!",
          message: "Maqsadlaringizni belgilang va rivojlanishni boshlang.",
          date: new Date().toISOString(),
          read: false
        }
      ],
      memories: [],
      preferences: {
        difficulty: "auto"
      }
    };
  }

  function loadData() {
    const saved = safeJSON(localStorage.getItem(DATA_KEY), null);
    if (!saved || typeof saved !== "object") return createInitialData();
    const initial = createInitialData();
    const loaded = {
      ...initial,
      ...saved,
      profile: { ...initial.profile, ...(saved.profile || {}) },
      preferences: { ...initial.preferences, ...(saved.preferences || {}) },
      goals: Array.isArray(saved.goals) ? saved.goals : [],
      tasks: Array.isArray(saved.tasks) ? saved.tasks : [],
      dailyRoutine: Array.isArray(saved.dailyRoutine) ? saved.dailyRoutine : [],
      activity: Array.isArray(saved.activity) ? saved.activity : [],
      achievements: Array.isArray(saved.achievements) ? saved.achievements : [],
      inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
      notifications: Array.isArray(saved.notifications) ? saved.notifications : [],
      memories: Array.isArray(saved.memories) ? saved.memories : []
    };
    if (!Number(saved.spentXP) && loaded.inventory.length) {
      const legacyPrices = {"theme-ocean":250,"theme-emerald":400,"theme-sunset":550,"theme-rose":750,"background-midnight":1200,"background-galaxy":2500,"background-royal":5000,"badge-focus":900,"badge-diamond":3000,"avatar-premium":1800};
      loaded.spentXP = loaded.inventory.reduce((sum,item)=>sum+(legacyPrices[item?.id]||0),0);
    }
    return loaded;
  }

  function loadSettings() {
    const saved = safeJSON(localStorage.getItem(SETTINGS_KEY), {});
    return { ...DEFAULT_SETTINGS, ...(saved || {}) };
  }

  let data = loadData();
  let settings = loadSettings();
  let currentPage = "dashboard";
  let currentSettingsTab = "general";
  let storeFilter = "all";
  let taskListLimit = 50;
  let goalListLimit = 40;
  let memoryListLimit = 30;
  let toastTimeout = null;
  let remoteAuthenticated = false;
  let remoteSyncTimer = null;
  let remoteSyncRunning = false;
  let remoteSyncQueued = false;
  let aiConversation = [];
  let communityRelations = { incoming: [], outgoing: [], friends: [] };
  let communityLeaderboard = [];
  const taskActionsInFlight = new Set();
  const purchaseActionsInFlight = new Set();

  function saveData() {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
      if (remoteAuthenticated) scheduleRemoteSync();
      return true;
    } catch (error) {
      console.error("SmartGoal storage error:", error);
      showToast("Ma’lumotni saqlashda xatolik yuz berdi.", "error");
      return false;
    }
  }

  function scheduleRemoteSync() {
    if (remoteSyncTimer) clearTimeout(remoteSyncTimer);
    remoteSyncTimer = setTimeout(() => {
      remoteSyncTimer = null;
      syncDataToServer();
    }, 500);
  }

  async function syncDataToServer() {
    if (!remoteAuthenticated) return false;
    if (remoteSyncRunning) { remoteSyncQueued = true; return false; }
    remoteSyncRunning = true;
    let synced = false;
    try {
      const response = await fetch("/api/data", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });
      if (response.status === 401) {
        remoteAuthenticated = false;
        showAuthentication();
        showToast("Sessiya tugadi. Qayta kiring.", "error");
      } else if (!response.ok) {
        throw new Error("Ma’lumot serverga saqlanmadi.");
      } else {
        synced = true;
      }
    } catch (error) {
      console.error("SmartGoal sync error:", error);
      showToast("Internet yoki server bilan aloqa uzildi. Ma’lumot qurilmada saqlandi.", "error");
    } finally {
      remoteSyncRunning = false;
      if (remoteSyncQueued) {
        remoteSyncQueued = false;
        scheduleRemoteSync();
      }
    }
    return synced;
  }

  async function flushRemoteSync() {
    if (!remoteAuthenticated) return false;
    while (true) {
      if (remoteSyncTimer) {
        clearTimeout(remoteSyncTimer);
        remoteSyncTimer = null;
      }
      while (remoteSyncRunning) {
        await new Promise(resolve => setTimeout(resolve, 25));
      }
      if (remoteSyncTimer) {
        clearTimeout(remoteSyncTimer);
        remoteSyncTimer = null;
      }
      remoteSyncQueued = false;
      if (!await syncDataToServer()) return false;
      if (!remoteSyncRunning && !remoteSyncQueued && !remoteSyncTimer) return true;
    }
  }

  function saveSettings() {
    data.preferences = { ...(data.preferences || {}), ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Settings storage error:", error);
    }
    applySettings();
    saveData();
  }

  /* -------------------- AGE AND DIFFICULTY -------------------- */

  function calculateAge(birthdate) {
    if (!birthdate) return null;

    const birth = new Date(`${birthdate}T00:00:00`);
    const now = new Date();

    if (Number.isNaN(birth.getTime()) || birth > now) return null;

    let age = now.getFullYear() - birth.getFullYear();

    const birthdayNotReached =
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());

    if (birthdayNotReached) age--;

    return age >= 0 && age <= 120 ? age : null;
  }

  function getDifficulty() {
    if (settings.difficulty !== "auto") return settings.difficulty;

    const age = data.profile.age;

    if (age === null || age === undefined) return "adult";
    if (age <= 11) return "junior";
    if (age <= 17) return "senior";
    return "adult";
  }

  const UI_TEXT = {
    junior: {
      welcome: "Bugun nimaga erishamiz?",
      description: "Kichik qadamlar katta natijalarga olib boradi.",
      addTask: "Vazifa qo‘shish",
      addGoal: "Maqsad qo‘shish",
      emptyTasks: "Hali vazifalar yo‘q. Birinchi vazifangizni qo‘shing!",
      emptyGoals: "Hali maqsad yo‘q. O‘z maqsadingizni belgilang!"
    },
    senior: {
      welcome: "Bugungi rejalaringizga xush kelibsiz",
      description: "Vaqtingizni samarali boshqaring va natijalarni kuzating.",
      addTask: "Yangi vazifa",
      addGoal: "Yangi maqsad",
      emptyTasks: "Hozircha vazifalar mavjud emas.",
      emptyGoals: "Hozircha maqsadlar mavjud emas."
    },
    adult: {
      welcome: "Rivojlanishingizni boshqarishni davom ettiring",
      description: "Ustuvor vazifalarni belgilang, jarayonni kuzating va natijaga erishing.",
      addTask: "Vazifa yaratish",
      addGoal: "Maqsad yaratish",
      emptyTasks: "Rejalashtirilgan vazifalar mavjud emas.",
      emptyGoals: "Hozircha faol maqsadlar mavjud emas."
    }
  };

  function textForUser(key) {
    const level = getDifficulty();
    return UI_TEXT[level]?.[key] || UI_TEXT.adult[key] || "";
  }

  /* -------------------- XP AND RANKS -------------------- */

  function getRank(xp = Number(data.xp || 0) + Number(data.spentXP || 0)) {
    let rank = RANKS[0];

    for (const item of RANKS) {
      if (xp >= item.xp) rank = item;
    }

    const next = RANKS.find(item => item.level === rank.level + 1);

    return {
      ...rank,
      next,
      progress: next
        ? Math.min(100, ((xp - rank.xp) / (next.xp - rank.xp)) * 100)
        : 100,
      remaining: next ? Math.max(0, next.xp - xp) : 0
    };
  }

  function addXP(amount, reason = "Faollik") {
    const points = Math.max(0, Math.floor(Number(amount) || 0));
    if (!points) return;

    const oldRank = getRank().level;

    data.xp += points;
    data.activity.push({
      id: uid(),
      date: today(),
      xp: points,
      reason
    });

    data.activity = data.activity.slice(-180);

    const newRank = getRank().level;

    if (newRank > oldRank) {
      addNotification(
        "Yangi daraja!",
        `Tabriklaymiz! Siz ${newRank}-darajaga ko‘tarildingiz.`
      );
    }

    saveData();
  }

  async function spendXP(amount) {
    const points=Math.max(0,Math.floor(Number(amount)||0));
    if(!points||data.xp<points){showToast("Bu xarid uchun ochkolaringiz yetarli emas.","error");return false;}
    try{const response=await fetch("/api/xp/spend",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:points})});const result=await response.json().catch(()=>({}));if(!response.ok||!result.success)throw new Error(result.message||"XP yechilmadi.");data.xp=Number(result.xpBalance||0);data.spentXP=(Number(data.spentXP)||0)+points;saveData();return true;}
    catch(error){showToast(error.message||"XP yechishda xatolik yuz berdi.","error");return false;}
  }

  /* -------------------- NOTIFICATIONS -------------------- */

  function addNotification(title, message) {
    data.notifications.unshift({
      id: uid(),
      title,
      message,
      date: new Date().toISOString(),
      read: false
    });

    data.notifications = data.notifications.slice(0, 60);
    saveData();
    updateNotificationIndicators();
    if (currentPage === "notifications") render();
  }

  function unreadCount() {
    return data.notifications.filter(item => !item.read).length;
  }

  /* -------------------- TOAST AND MODAL -------------------- */

  function showToast(message, type = "success") {
    const toast = $("#toast");
    const messageElement = $("#toast-message");

    if (!toast || !messageElement) {
      console.log(`[SmartGoal] ${message}`);
      return;
    }

    messageElement.textContent = message;
    translateVisibleUI(toast);
    toast.classList.remove("hidden", "toast-error");

    const toastIcon = $(".toast-icon", toast);

    if (toastIcon) {
      toastIcon.innerHTML = icon(
        type === "error" ? "alert-circle" : "check-circle-2"
      );
    }

    if (type === "error") toast.classList.add("toast-error");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.add("hidden"), 3500);

    refreshIcons();
    playSound(type === "error" ? 180 : 650);
  }

  function openModal(title, body, footer = "", eyebrow = "SMARTGOAL") {
    const overlay = $("#modal-overlay");
    const titleElement = $("#modal-title");
    const bodyElement = $("#modal-body");
    const footerElement = $("#modal-footer");
    const eyebrowElement = $("#modal-eyebrow");

    if (!overlay || !titleElement || !bodyElement) return;

    titleElement.textContent = title;
    bodyElement.innerHTML = body;
    if (footerElement) footerElement.innerHTML = footer;
    if (eyebrowElement) eyebrowElement.textContent = eyebrow;

    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    refreshIcons();
    translateVisibleUI($("#modal-overlay"));
  }

  function closeModal() {
    $("#modal-overlay")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  /* -------------------- SOUND -------------------- */

  function playSound(frequency = 650) {
    if (!settings.sound) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
      oscillator.onended = () => context.close();
    } catch {
      // Audio is optional.
    }
  }

  /* -------------------- SETTINGS APPLICATION -------------------- */

  function applySettings() {
    const root = document.documentElement;

    const theme = settings.theme === "system"
      ? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : settings.theme;

    root.dataset.theme = theme;
    root.dataset.colorTheme = settings.colorTheme || "violet";
    root.dataset.fontSize = ["small","medium","large"].includes(settings.fontSize) ? settings.fontSize : "medium";

    const language = settings.language || "uz";
    root.lang = language;

    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#111522" : "#f5f7fb"
    );

    document.body.classList.toggle("reduced-motion", !!settings.reducedMotion);
  }

  /* -------------------- PROFILE -------------------- */

  function normalizedUsername(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/[^a-z0-9_.]/g, "");
  }

  function isValidUsername(value) {
    return /^[a-z0-9_][a-z0-9_.]{2,19}$/.test(value);
  }

  function updateProfileDisplay() {
    const name = data.profile.name || "Foydalanuvchi";
    const username = data.profile.username || "username";
    const avatar = data.profile.avatar;

    ["#sidebar-name", "#topbar-name"].forEach(selector => {
      const element = $(selector);
      if (element) element.textContent = name;
    });

    const usernameElement = $("#sidebar-username");
    if (usernameElement) usernameElement.textContent = `@${username}`;

    ["#sidebar-avatar", "#topbar-avatar"].forEach(selector => {
      const element = $(selector);
      if (!element) return;

      element.innerHTML = avatar
        ? `<img src="${escapeHTML(avatar)}" alt="Profil rasmi" loading="lazy" decoding="async">`
        : icon("user-round");
    });
  }

  function openProfileEditor() {
    const profile = data.profile;

    openModal(
      "Profilni tahrirlash",
      `
        <form id="profile-form" class="form-grid">
          <div class="form-field full-width">
            <label class="field-label" for="profile-name">Ism va familiya</label>
            <input class="field-input" id="profile-name" name="name"
              maxlength="70" required value="${escapeHTML(profile.name)}">
          </div>

          <div class="form-field full-width">
            <label class="field-label" for="profile-username">Username</label>
            <input class="field-input" id="profile-username" name="username"
              minlength="3" maxlength="20" required
              value="${escapeHTML(profile.username)}">
            <small>3–20 belgi. Faqat lotin harflari, raqam, nuqta va pastki chiziq.</small>
          </div>

          <div class="form-field full-width">
            <label class="field-label" for="profile-bio">Biografiya</label>
            <textarea class="field-textarea" id="profile-bio" name="bio"
              maxlength="240" placeholder="O‘zingiz haqingizda qisqacha...">${escapeHTML(profile.bio)}</textarea>
          </div>
          <div class="form-field full-width">
            <label class="checkbox-label"><input type="checkbox" name="birthdatePublic" ${profile.birthdatePublic ? "checked" : ""}><span>Tug‘ilgan kunim va yoshim profilimda hammaga ko‘rinsin</span></label>
          </div>

          <div class="form-field full-width">
            <label class="field-label" for="profile-avatar">Profil rasmi</label>
            <input class="field-input" id="profile-avatar" name="avatar"
              type="file" accept="image/png,image/jpeg,image/webp">
            <small>PNG, JPG yoki WEBP. Rasm 2 MB dan kichik bo‘lsin.</small>
          </div>
        </form>
      `,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="submit" form="profile-form">Saqlash</button>
      `
    );
  }

  async function saveProfile(form) {
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const username = normalizedUsername(formData.get("username"));
    const bio = String(formData.get("bio") || "").trim();
    const file = formData.get("avatar");
    if (name.length < 2) { showToast("Ism va familiyani to‘g‘ri kiriting.", "error"); return; }
    if (!isValidUsername(username)) { showToast("Username formati noto‘g‘ri.", "error"); return; }
    let avatar = data.profile.avatar || "";
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { showToast("Rasm 2 MB dan kichik bo‘lishi kerak.", "error"); return; }
      try { avatar = await resizeImage(file); } catch { showToast("Rasmni yuklashda xatolik yuz berdi.", "error"); return; }
    }
    if (remoteAuthenticated) {
      try {
        if (!await flushRemoteSync()) throw new Error("Ma’lumotlar serverga saqlanmadi. Qayta urinib ko‘ring.");
        const response = await fetch("/api/profile", {method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,username})});
        const result = await response.json().catch(()=>({}));
        if (!response.ok || !result.success) throw new Error(result.message || "Profil serverda saqlanmadi.");
      } catch (error) { showToast(error.message || "Profilni saqlashda xatolik.", "error"); return; }
    }
    data.profile.name = name;
    data.profile.username = username;
    data.profile.bio = bio;
    data.profile.avatar = avatar;
    data.profile.birthdatePublic = formData.get("birthdatePublic") === "on";
    saveData(); updateProfileDisplay(); closeModal(); render();
    showToast("Profil muvaffaqiyatli yangilandi.");
  }

  function resizeImage(file, maxDimension = 420, quality = 0.72) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = reject;

      reader.onload = () => {
        const image = new Image();

        image.onerror = reject;

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const max = Math.max(160, Math.min(1200, Number(maxDimension) || 420));
          const ratio = Math.min(1, max / Math.max(image.width, image.height));

          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", Math.max(0.45, Math.min(0.9, Number(quality) || 0.72))));
        };

        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  /* -------------------- AUTH DEMO -------------------- */

  function switchAuthTab(tab) {
    const loginForm = $("#login-form");
    const registerForm = $("#register-form");

    if (!loginForm || !registerForm) return;

    const isRegister = tab === "register";

    loginForm.classList.toggle("hidden", isRegister);
    registerForm.classList.toggle("hidden", !isRegister);

    $$("[data-auth-tab]").forEach(button => {
      button.classList.toggle("active", button.dataset.authTab === tab);
    });

    const title = $("#auth-title");
    const description = $("#auth-description");
    const eyebrow = $("#auth-eyebrow");
    const switchText = $("#auth-switch-text");

    if (title) title.textContent = isRegister ? "Yangi hisob yarating" : "Hisobingizga kiring";
    if (description) {
      description.textContent = isRegister
        ? "O‘zingiz haqingizdagi ma’lumotlarni kiriting."
        : "Davom etish uchun ma’lumotlaringizni kiriting.";
    }
    if (eyebrow) eyebrow.textContent = isRegister ? "SMARTGOAL’GA QO‘SHILING" : "XUSH KELIBSIZ";

    if (switchText) {
      switchText.innerHTML = isRegister
        ? `Hisobingiz bormi? <button type="button" class="text-button" data-auth-tab="login">Kirish</button>`
        : `Hali hisobingiz yo‘qmi? <button type="button" class="text-button" data-auth-tab="register">Hisob yarating</button>`;
    }

    refreshIcons();
  }

  function showApplication() {
    $("#auth-screen")?.classList.add("hidden");
    $("#app-shell")?.classList.remove("hidden");
    updateProfileDisplay();
    render();
  }

  function showAuthentication() {
    $("#auth-screen")?.classList.remove("hidden");
    $("#app-shell")?.classList.add("hidden");
  }

  async function registerRemote(form) {
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const birthdate = String(formData.get("birthdate") || "");
    const password = String(formData.get("password") || "");
    const terms = formData.get("terms");
    const age = calculateAge(birthdate);

    if (name.length < 2 || !email || age === null || !terms) {
      showToast("Barcha maydonlarni to‘g‘ri to‘ldiring.", "error");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      showToast("Parol 8–128 belgi bo‘lishi kerak.", "error");
      return;
    }

    let username = normalizedUsername(name.replace(/\s+/g, "."));
    if (!isValidUsername(username)) username = "user_" + Date.now().toString().slice(-8);

    const button = form.querySelector("button[type='submit']");
    const originalText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = "Hisob yaratilmoqda..."; }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, birthdate, password, termsAccepted: true })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi.");

      remoteAuthenticated = true;
      localStorage.removeItem(SESSION_KEY);
      data = createInitialData();
      data.profile.name = name;
      data.profile.birthdate = birthdate;
      data.profile.age = age;
      data.profile.username = username;
      data.profile.email = email;
      settings.difficulty = "auto";
      saveSettings();
      saveData();
      showApplication();
      showToast("SmartGoal’ga xush kelibsiz!");
    } catch (error) {
      showToast(error.message || "Server bilan bog‘lanib bo‘lmadi.", "error");
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText || "Hisob yaratish"; }
    }
  }

  async function loginRemote(form) {
    const formData = new FormData(form);
    const identifier = String(formData.get("identifier") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!identifier || !password) {
      showToast("Username yoki email va parolni kiriting.", "error");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    const originalText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = "Tekshirilmoqda..."; }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Kirish amalga oshmadi.");

      remoteAuthenticated = true;
      localStorage.removeItem(SESSION_KEY);
      await loadRemoteData();
      if (!data.profile.name || data.profile.name === "SmartGoal foydalanuvchisi") {
        data.profile.name = result.user?.name || "Foydalanuvchi";
        data.profile.email = result.user?.email || "";
        data.profile.username = result.user?.username || "";
        data.profile.birthdate = result.user?.birthdate || "";
        data.profile.age = calculateAge(data.profile.birthdate);
      }
      showApplication();
      checkAchievements();
      checkRoutineReminders();
      openRequestedProfile();
      showToast("Xush kelibsiz!");
    } catch (error) {
      remoteAuthenticated = false;
      showToast(error.message || "Server bilan bog‘lanib bo‘lmadi.", "error");
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText || "Kirish"; }
    }
  }

  async function loadRemoteData() {
    const response = await fetch("/api/data", { credentials: "same-origin" });
    if (!response.ok) throw new Error(response.status === 401 ? "Sessiya tugagan. Qayta kiring." : "Ma’lumotlarni yuklab bo‘lmadi.");
    const result = await response.json();
    if (!result.success || !result.data) throw new Error("Serverdan kelgan ma’lumot noto‘g‘ri.");
    localStorage.setItem(DATA_KEY, JSON.stringify(result.data));
    data = loadData();
    const remotePreferences = data.preferences || {};
    ["language","theme","colorTheme","fontSize","sound","reducedMotion","routineReminders","difficulty"].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(remotePreferences,key) && remotePreferences[key] !== undefined) settings[key] = remotePreferences[key];
    });
    data.preferences = { ...remotePreferences, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings();
    saveData();
    if (data.profile.birthdate) data.profile.age = calculateAge(data.profile.birthdate);
  }

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
    } catch (error) {
      console.warn("Serverdan chiqish so‘rovi bajarilmadi:", error);
    }
    remoteAuthenticated = false;
    localStorage.removeItem(SESSION_KEY);
    showAuthentication();
    showToast("Hisobdan chiqdingiz.");
  }

  /* -------------------- GOALS -------------------- */

  function openGoalForm(goalId = null) {
    const goal = data.goals.find(item => item.id === goalId);

    openModal(
      goal ? "Maqsadni tahrirlash" : "Yangi maqsad",
      `
        <form id="goal-form" class="form-grid">
          <input type="hidden" name="id" value="${escapeHTML(goal?.id || "")}">

          <div class="form-field full-width">
            <label class="field-label">Maqsad nomi</label>
            <input class="field-input" name="title" maxlength="100" required
              placeholder="Masalan: Ingliz tilini o‘rganish"
              value="${escapeHTML(goal?.title || "")}">
          </div>

          <div class="form-field full-width">
            <label class="field-label">Tavsif</label>
            <textarea class="field-textarea" name="description"
              maxlength="400" placeholder="Maqsadingiz haqida...">${escapeHTML(goal?.description || "")}</textarea>
          </div>

          <div class="form-field">
            <label class="field-label">Muddat</label>
            <input class="field-input" type="date" name="deadline"
              value="${escapeHTML(goal?.deadline || "")}">
          </div>

          <div class="form-field">
            <label class="field-label">Ustuvorlik</label>
            <select class="field-select" name="priority">
              <option value="low" ${goal?.priority === "low" ? "selected" : ""}>Past</option>
              <option value="medium" ${!goal || goal.priority === "medium" ? "selected" : ""}>O‘rta</option>
              <option value="high" ${goal?.priority === "high" ? "selected" : ""}>Yuqori</option>
            </select>
          </div>
        </form>
      `,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="submit" form="goal-form">Saqlash</button>
      `
    );
  }

  function saveGoal(form) {
    const fd = new FormData(form);
    const id = String(fd.get("id") || "");
    const title = String(fd.get("title") || "").trim();

    if (title.length < 2) {
      showToast("Maqsad nomini kiriting.", "error");
      return;
    }

    if (id) {
      const goal = data.goals.find(item => item.id === id);
      if (!goal) return;

      Object.assign(goal, {
        title,
        description: String(fd.get("description") || "").trim(),
        deadline: String(fd.get("deadline") || ""),
        priority: String(fd.get("priority") || "medium")
      });
    } else {
      data.goals.unshift({
        id: uid(),
        title,
        description: String(fd.get("description") || "").trim(),
        deadline: String(fd.get("deadline") || ""),
        priority: String(fd.get("priority") || "medium"),
        progress: 0,
        createdAt: today(),
        completed: false
      });
    }

    saveData();
    closeModal();
    render();
    showToast("Maqsad saqlandi.");
  }

  function deleteGoal(id) {
    const goal = data.goals.find(item => item.id === id);
    if (!goal) return;

    openModal(
      "Maqsadni o‘chirish",
      `<p>“${escapeHTML(goal.title)}” maqsadini o‘chirishni xohlaysizmi?</p>`,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="button" data-action="confirm-delete-goal" data-id="${escapeHTML(id)}">O‘chirish</button>
      `
    );
  }

  /* -------------------- TASKS -------------------- */

  function openTaskForm(taskId = null) {
    const task = data.tasks.find(item => item.id === taskId);
    openModal(task ? "Vazifani tahrirlash" : "Yangi vazifa", `
      <form id="task-form" class="form-grid">
        <input type="hidden" name="id" value="${escapeHTML(task?.id || "")}">
        <div class="form-field full-width">
          <label class="field-label">Vazifa nomi</label>
          <input class="field-input" name="title" maxlength="100" required placeholder="Masalan: 20 bet kitob o‘qish" value="${escapeHTML(task?.title || "")}">
        </div>
        <div class="form-field full-width">
          <label class="field-label">Qisqa mazmuni</label>
          <textarea class="field-textarea" name="description" rows="3" maxlength="500" required placeholder="Nimani bajarishingizni qisqacha yozing. Masalan: 20 bet o‘qib, 3 ta muhim fikrni yozib chiqish.">${escapeHTML(task?.description || "")}</textarea>
          <small>Qisqa va aniq izoh AI’ga ishning qiyinligi va mehnatini adolatli baholashga yordam beradi.</small>
        </div>
        <div class="form-field">
          <label class="field-label">Qaysi kuni bajariladi?</label>
          <input class="field-input" type="date" name="date" required value="${escapeHTML(task?.date || today())}">
        </div>
        <div class="form-field">
          <label class="field-label">Taxminiy bajarish vaqti</label>
          <select class="field-select" name="estimatedMinutes">
            ${[[15,"15 daqiqa"],[30,"30 daqiqa"],[45,"45 daqiqa"],[60,"1 soat"],[90,"1,5 soat"],[120,"2 soat"],[180,"3 soat"],[240,"4 soat"],[360,"6 soat"]].map(([value,label])=>`<option value="${value}" ${Number(task?.estimatedMinutes||30)===value?"selected":""}>${label}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Ustuvorlik</label>
          <select class="field-select" name="priority">
            <option value="low" ${task?.priority==="low"?"selected":""}>Past</option>
            <option value="medium" ${!task||task.priority==="medium"?"selected":""}>O‘rta</option>
            <option value="high" ${task?.priority==="high"?"selected":""}>Yuqori</option>
          </select>
        </div>
        <details class="form-field full-width task-extra-settings">
          <summary>Qo‘shimcha sozlama (ixtiyoriy)</summary>
          <label class="field-label" for="task-goal">Qaysi maqsadga tegishli?</label>
          <select class="field-select" id="task-goal" name="goalId"><option value="">Maqsadsiz vazifa</option>${data.goals.map(goal=>`<option value="${escapeHTML(goal.id)}" ${task?.goalId===goal.id?"selected":""}>${escapeHTML(goal.title)}</option>`).join("")}</select>
        </details>
      </form>`, `
      <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
      <button class="primary-button" type="submit" form="task-form">Saqlash</button>`);
  }

  function saveTask(form) {
    const fd = new FormData(form);
    const id = String(fd.get("id") || "");
    const title = String(fd.get("title") || "").trim();
    const description = String(fd.get("description") || "").trim().slice(0, 500);

    if (title.length < 2) {
      showToast("Vazifa nomini kiriting.", "error");
      return;
    }
    if (description.length < 5) {
      showToast("Vazifa nima haqida ekanini kamida bir jumla bilan yozing.", "error");
      return;
    }

    const values = {
      title,
      description,
      date: String(fd.get("date") || today()),
      priority: ["low","medium","high"].includes(String(fd.get("priority")||"medium")) ? String(fd.get("priority")||"medium") : "medium",
      estimatedMinutes: Math.max(5,Math.min(480,Number(fd.get("estimatedMinutes")||30)||30)),
      goalId: String(fd.get("goalId") || "")
    };

    if (id) {
      const task = data.tasks.find(item => item.id === id);
      if (!task) return;
      const scoreChanged = task.title !== values.title || task.description !== values.description || task.date !== values.date || task.priority !== values.priority || Number(task.estimatedMinutes||30) !== values.estimatedMinutes;
      Object.assign(task, values);
      if (scoreChanged && Number(task.xpEarned || 0) === 0) {
        task.completed = false;
        task.completedAt = null;
        task.xpAwarded = false;
      }
    } else {
      data.tasks.unshift({
        id: uid(), ...values, completed: false, xpAwarded: false, xpEarned: 0, completedAt: null, createdAt: new Date().toISOString()
      });
    }

    refreshGoalProgress();
    saveData();
    closeModal();
    render();
    showToast("Vazifa saqlandi.");
  }

  async function toggleTask(id) {
    if (taskActionsInFlight.has(id)) return;
    const task = data.tasks.find(item => item.id === id);
    if (!task) return;
    taskActionsInFlight.add(id);
    try {
      if (!task.completed) {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        render();
        if (!task.xpAwarded || Number(task.xpEarned || 0) === 0) {
          if (!remoteAuthenticated) {
            task.xpAwarded = false;
            task.xpEarned = 0;
            showToast(settings.language==="ru"?"Задача сохранена на устройстве. Войдите в аккаунт, чтобы получать XP от AI.":settings.language==="en"?"Task saved on this device. Sign in to earn AI-awarded XP.":"Vazifa qurilmada saqlandi. AI orqali XP olish uchun akkauntingizga kiring.", "error");
          } else {
            try {
              if (!await flushRemoteSync()) throw new Error("Vazifa serverga saqlanmadi. Internetni tekshirib, qayta urinib ko‘ring.");
              const response = await fetch("/api/tasks/complete", {
                method: "POST", credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: { id: task.id }, language: settings.language })
              });
              const result = await response.json().catch(() => ({}));
              if (!response.ok || !result.success) throw new Error(result.message || "AI vazifani baholay olmadi.");
              data.xp = Number(result.xpBalance ?? data.xp ?? 0);
              task.xpAwarded = true;
              task.xpEarned = Number(result.awarded || 0);
              if (task.xpEarned > 0) {
                data.activity.push({ id: uid(), date: today(), xp: task.xpEarned, reason: "AI baholadi: " + task.title });
                data.activity = data.activity.slice(-180);
              }
              if (result.notMeaningful) showToast(settings.language==="ru"?"AI не смог определить конкретную задачу. Уточните название или описание.":settings.language==="en"?"AI could not identify a clear task. Please clarify its title or description.":"AI bu vazifani aniq ish deb baholamadi. Nomini yoki qisqa mazmunini aniqroq yozing.", "error");
              else if (result.duplicateTask) showToast(result.reason || "Bugun shu mazmundagi vazifa uchun XP avval berilgan.", "error");
              else if (result.alreadyAwarded) showToast(settings.language==="ru"?"За эту задачу XP уже начислялись.":settings.language==="en"?"XP has already been awarded for this task.":"Bu vazifa uchun XP avval berilgan.", "error");
              else if (task.xpEarned > 0) showToast(settings.language==="ru"?"Оценка AI: +"+task.xpEarned+" XP · сложность "+(result.difficulty||"—")+"/5 · усилия "+(result.effort||"—")+"/5 · "+(result.onTime?"в срок":"с опозданием"):settings.language==="en"?"AI score: +"+task.xpEarned+" XP · difficulty "+(result.difficulty||"—")+"/5 · effort "+(result.effort||"—")+"/5 · "+(result.onTime?"on time":"late"):"AI bahosi: +" + task.xpEarned + " XP · qiyinlik " + (result.difficulty || "—") + "/5 · mehnat " + (result.effort || "—") + "/5 · " + (result.onTime ? "muddatida" : "kechikkan"));
              else showToast(result.reason || "AI vazifani tekshirdi, lekin bu safar XP ajratilmadi.", "error");
            } catch (error) {
              task.completed = false;
              task.completedAt = null;
              saveData();
              render();
              showToast(error.message || "XP hisoblashda xatolik.", "error");
              return;
            }
          }
        }
        if (task.goalId) {
          const goal = data.goals.find(item => item.id === task.goalId);
          if (goal) {
            const linked = data.tasks.filter(item => item.goalId === goal.id);
            const completed = linked.filter(item => item.completed).length;
            goal.progress = linked.length ? Math.round(completed / linked.length * 100) : goal.progress;
            if (goal.progress >= 100 && !goal.completed) {
              goal.completed = true;
              addNotification("Maqsad yakunlandi!", "“" + goal.title + "” maqsadini bajardingiz.");
            }
          }
        }
        refreshGoalProgress();
        checkAchievements();
      } else {
        task.completed = false;
        task.completedAt = null;
        refreshGoalProgress();
        showToast("Vazifa qayta ochildi. Avval berilgan XP qaytarib olinmaydi.");
      }
      saveData();
      render();
    } finally {
      taskActionsInFlight.delete(id);
    }
  }

  function deleteTask(id) {
    const task = data.tasks.find(item => item.id === id);
    if (!task) return;

    openModal(
      "Vazifani o‘chirish",
      `<p>“${escapeHTML(task.title)}” vazifasini o‘chirishni xohlaysizmi?</p>`,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="button" data-action="confirm-delete-task" data-id="${escapeHTML(id)}">O‘chirish</button>
      `
    );
  }

  /* -------------------- ACHIEVEMENTS -------------------- */

  function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      const alreadyEarned = data.achievements.includes(achievement.id);

      if (!alreadyEarned && achievement.condition(data)) {
        data.achievements.push(achievement.id);
        addNotification(
          "Yangi yutuq ochildi!",
          `Siz “${achievement.name}” yutug‘ini qo‘lga kiritdingiz.`
        );
      }
    });

    saveData();
  }

  /* -------------------- STORE -------------------- */

  function purchaseItem(id) {
    const item = STORE_ITEMS.find(product => product.id === id);
    if (!item) return;

    const owned = data.inventory.some(product => product.id === id);

    if (owned) {
      showToast("Bu mahsulot sizda allaqachon mavjud.", "error");
      return;
    }

    const canAfford = Number(data.xp) >= item.price;
    const missingXP = Math.max(0, item.price - (Number(data.xp) || 0));

    openModal(
      "Xaridni tasdiqlash",
      `
        <div class="empty-state">
          <div class="empty-state-icon">${icon(item.icon, 28)}</div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.description)}</p>
          <strong>${formatNumber(item.price)} XP</strong>
          <p>${canAfford
            ? `Balansingiz: ${formatNumber(data.xp)} XP`
            : `Balansingiz: ${formatNumber(data.xp)} XP. Yana ${formatNumber(missingXP)} XP kerak.`}</p>
        </div>
      `,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="button" data-action="confirm-purchase" data-id="${escapeHTML(id)}" ${canAfford ? "" : "disabled"}>${canAfford ? "Xarid qilish" : "XP yetarli emas"}</button>
      `
    );
  }

  async function confirmPurchase(id) {
    if (purchaseActionsInFlight.has(id)) return;
    const item = STORE_ITEMS.find(product => product.id === id);
    if (!item) return;
    purchaseActionsInFlight.add(id);
    const button = document.querySelector("[data-action='confirm-purchase']");
    if (button) button.disabled = true;
    try {
      if (data.inventory.some(product => product.id === id)) {
        showToast("Bu mahsulot sizda allaqachon mavjud.", "error"); closeModal(); return;
      }
      let purchasedItem;
      if (remoteAuthenticated) {
        if (!await flushRemoteSync()) throw new Error("Ma’lumotlar serverga saqlanmadi. Qayta urinib ko‘ring.");
        const response = await fetch("/api/store/purchase", {method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:id})});
        const result = await response.json().catch(()=>({}));
        if (!response.ok || !result.success) throw new Error(result.message || "Xaridni amalga oshirib bo‘lmadi.");
        data.xp = Number(result.xpBalance || 0);
        data.spentXP = (Number(data.spentXP)||0) + item.price;
        purchasedItem = result.item;
      } else {
        if (Number(data.xp) < item.price) throw new Error("Bu xarid uchun XP yetarli emas.");
        data.xp = Number(data.xp) - item.price;
        data.spentXP = (Number(data.spentXP)||0) + item.price;
        purchasedItem = {id:item.id,type:item.type,value:item.value,purchasedAt:new Date().toISOString()};
      }
      data.inventory.push(purchasedItem || {id:item.id,type:item.type,value:item.value,purchasedAt:new Date().toISOString()});
      saveData(); closeModal(); render();
      showToast(`${item.name} muvaffaqiyatli xarid qilindi!`);
    } catch (error) {
      showToast(error.message || "Xarid vaqtida xatolik yuz berdi.", "error");
    } finally {
      purchaseActionsInFlight.delete(id);
      const currentButton = document.querySelector("[data-action='confirm-purchase']");
      if (currentButton) currentButton.disabled = false;
    }
  }

  function useItem(id) {
    const owned = data.inventory.find(item => item.id === id);
    const product = STORE_ITEMS.find(item => item.id === id);

    if (!owned || !product) return;

    if (owned.type === "theme") {
      settings.colorTheme = owned.value;
      saveSettings();
    } else if (owned.type === "background") {
      data.profile.background = owned.value;
      saveData();
    } else if (owned.type === "avatar") {
      data.profile.avatarFrame = owned.value;
      saveData();
    } else if (owned.type === "badge") {
      data.profile.activeBadge = owned.value;
      saveData();
    }

    render();
    showToast("Mahsulot profilingizga qo‘llandi.");
  }

  /* -------------------- ACTIVITY AND CHART -------------------- */

  function getLastSevenDays() {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");

      const xp = data.activity
        .filter(item => item.date === key)
        .reduce((sum, item) => sum + item.xp, 0);

      result.push({
        key,
        label: date.toLocaleDateString(getLocale(), { weekday: "short" }),
        xp
      });
    }

    return result;
  }

  function chartMarkup() {
    const days = getLastSevenDays();
    const max = Math.max(50, ...days.map(day => day.xp));
    const width = 640;
    const height = 205;
    const left = 28;
    const right = 12;
    const top = 15;
    const bottom = 35;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    const points = days.map((day, index) => {
      const x = left + (chartWidth / 6) * index;
      const y = top + chartHeight - (day.xp / max) * chartHeight;
      return { ...day, x, y };
    });

    const line = points.map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    ).join(" ");

    const area = `${line} L ${points[6].x} ${top + chartHeight} L ${points[0].x} ${top + chartHeight} Z`;

    return `
      <div class="chart-container">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="So‘nggi yetti kunlik XP grafigi">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--primary)" />
              <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
            </linearGradient>
          </defs>

          ${[0, 1, 2, 3].map(index => {
            const y = top + (chartHeight / 3) * index;
            return `<line class="chart-grid-line" x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"/>`;
          }).join("")}

          <path class="chart-area" d="${area}"/>
          <path class="chart-line" d="${line}"/>

          ${points.map(point => `
            <circle class="chart-point" cx="${point.x}" cy="${point.y}" r="4">
              <title>${escapeHTML(point.label)}: ${point.xp} XP</title>
            </circle>
            <text class="chart-label" x="${point.x}" y="${height - 8}" text-anchor="middle">${escapeHTML(point.label)}</text>
          `).join("")}
        </svg>
      </div>
    `;
  }

  /* -------------------- PAGE LAYOUT HELPERS -------------------- */

  function pageHeader(label, title, description, button = "") {
    return `
      <div class="section-heading">
        <div>
          <span class="section-label">${escapeHTML(label)}</span>
          <h2>${escapeHTML(title)}</h2>
          <p>${escapeHTML(description)}</p>
        </div>
        ${button}
      </div>
    `;
  }

  function actionButton(action, label, iconName = "plus", extra = "") {
    return `
      <button class="primary-button" type="button" data-action="${escapeHTML(action)}" ${extra}>
        ${icon(iconName, 16)}
        <span>${escapeHTML(label)}</span>
      </button>
    `;
  }

  function emptyState(title, description, iconName = "inbox") {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon(iconName, 26)}</div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
      </div>
    `;
  }

  /* -------------------- DASHBOARD PAGE -------------------- */

  function getDailyCoachTip() {
    const overdue=data.tasks.filter(task=>!task.completed&&task.date&&task.date<today()).length;
    const todayPending=data.tasks.filter(task=>!task.completed&&task.date===today()).length;
    const active=data.goals.filter(goal=>!goal.completed);
    const lang=settings.language||"uz";
    const copy={
      uz:{
        overdueTitle:"Avval kechikkan ishlarni yengillashtiring",
        overdueText:n=>n+" ta vazifa muddati o‘tgan. Hammasini birdan bajarishga urinmang: eng muhim bittasini tanlab, 20–25 daqiqa ishlang.",
        todayTitle:"Bugun ustuvorlikni tanlang",
        todayText:n=>"Bugun "+n+" ta vazifa bor. Eng muhim 3 tasini tanlang, ular orasida qisqa tanaffus qiling.",
        goalTitle:"Yangi maqsad sari qadam qo‘ying",
        goalText:"Keyingi 30 kun ichida erishmoqchi bo‘lgan bitta aniq natijani belgilang.",
        routineTitle:"Kun tartibini shakllantiring",
        routineText:"Uyg‘onish, o‘qish yoki ish va dam olish vaqtlarini belgilang. Barqaror tartib maqsadlarga erishishni osonlashtiradi.",
        defaultTitle:"Kichik, muntazam qadamlar katta natija beradi",
        defaultText:"Bugun faol maqsadlaringizdan bittasiga tegishli vazifani bajaring. Kechqurun natijani ko‘rib, ertangi kunni rejalashtiring."
      },
      ru:{
        overdueTitle:"Сначала разберите просроченные задачи",
        overdueText:n=>n+" задач просрочено. Не пытайтесь сделать всё сразу: выберите одну самую важную и поработайте над ней 20–25 минут.",
        todayTitle:"Выберите главный приоритет на сегодня",
        todayText:n=>"На сегодня запланировано "+n+" задач. Выберите три самые важные и делайте короткие перерывы.",
        goalTitle:"Сделайте шаг к новой цели",
        goalText:"Определите один конкретный результат, которого хотите достичь в ближайшие 30 дней.",
        routineTitle:"Сформируйте распорядок дня",
        routineText:"Укажите время пробуждения, учёбы или работы и отдыха. Регулярный распорядок помогает достигать целей.",
        defaultTitle:"Небольшие регулярные шаги приводят к большим результатам",
        defaultText:"Сегодня выполните одну задачу, связанную с активной целью. Вечером оцените результат и спланируйте завтра."
      },
      en:{
        overdueTitle:"Start by simplifying overdue tasks",
        overdueText:n=>n+" tasks are overdue. Do not try to do everything at once: choose the most important one and work on it for 20–25 minutes.",
        todayTitle:"Choose today's top priority",
        todayText:n=>"You have "+n+" tasks planned for today. Pick the three most important and take short breaks between them.",
        goalTitle:"Take a step toward a new goal",
        goalText:"Choose one specific result you want to achieve in the next 30 days.",
        routineTitle:"Build a daily routine",
        routineText:"Set your wake-up, study or work, and rest times. A steady routine makes goals easier to reach.",
        defaultTitle:"Small, consistent steps lead to big results",
        defaultText:"Complete one task linked to an active goal today. Review your progress tonight and plan tomorrow."
      }
    };
    const t=copy[lang]||copy.uz;
    if(overdue)return {title:t.overdueTitle,text:t.overdueText(overdue)};
    if(todayPending>4)return {title:t.todayTitle,text:t.todayText(todayPending)};
    if(!active.length)return {title:t.goalTitle,text:t.goalText};
    if(!(data.dailyRoutine||[]).length)return {title:t.routineTitle,text:t.routineText};
    return {title:t.defaultTitle,text:t.defaultText};
  }

  function renderDashboard() {
    const completed = data.tasks.filter(task => task.completed).length;
    const activeGoals = data.goals.filter(goal => !goal.completed).length;
    const todayTasks = data.tasks.filter(task => task.date === today());
    const completedToday = todayTasks.filter(task => task.completed).length;
    const rank = getRank();
    const coachTip = getDailyCoachTip();

    const tasksHTML = todayTasks.length
      ? todayTasks.slice(0, 5).map(task => `
          <div class="task-item ${task.completed ? "task-completed" : ""}">
            <input class="task-checkbox" type="checkbox"
              data-action="toggle-task" data-id="${escapeHTML(task.id)}"
              ${task.completed ? "checked" : ""} aria-label="Vazifani bajarildi deb belgilash">

            <div class="task-info">
              <strong>${escapeHTML(task.title)}</strong>
              <small>${escapeHTML(formatDate(task.date))} · ${Number(task.estimatedMinutes||30)} daqiqa</small>
            </div>

            <span class="task-reward">${icon("zap", 12)} AI: 0–15 XP</span>
          </div>
        `).join("")
      : emptyState("Buguncha vazifalar yo‘q", textForUser("emptyTasks"), "calendar-check");

    const goalsHTML = data.goals.length
      ? data.goals.filter(goal => !goal.completed).slice(0, 4).map(goal => `
          <div class="goal-item">
            <div class="goal-item-header">
              <div>
                <strong>${escapeHTML(goal.title)}</strong>
                <small>${goal.deadline ? `Muddat: ${escapeHTML(formatDate(goal.deadline))}` : "Muddat belgilanmagan"}</small>
              </div>
              <span class="goal-percentage">${getGoalProgress(goal).progress}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${getGoalProgress(goal).progress}%"></div>
            </div>
          </div>
        `).join("")
      : emptyState("Maqsadlar hali yo‘q", textForUser("emptyGoals"), "target");

    return `
      <section class="welcome-banner">
        <div class="welcome-content">
          <span class="eyebrow">SMARTGOAL • ${escapeHTML(formatDate(today()))}</span>
          <h2>${escapeHTML(textForUser("welcome"))}</h2>
          <p>${escapeHTML(textForUser("description"))}</p>
          <div class="welcome-actions">
            ${actionButton("add-task", textForUser("addTask"), "plus")}
            <button class="secondary-button" type="button" data-page="goals">
              ${icon("target", 15)} Maqsadlarim
            </button>
          </div>
        </div>
        <div class="welcome-visual">${icon("trending-up", 70)}</div>
      </section>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-icon purple">${icon("zap")}</span>
          </div>
          <p class="stat-label">Jami XP</p>
          <div class="stat-value">${formatNumber(data.xp)}</div>
          <span class="stat-change">${icon("trending-up")} ${rank.name}</span>
        </div>

        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-icon green">${icon("check-circle-2")}</span>
          </div>
          <p class="stat-label">Bajarilgan vazifalar</p>
          <div class="stat-value">${formatNumber(completed)}</div>
          <span class="stat-change">${completedToday} ta bugun</span>
        </div>

        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-icon blue">${icon("target")}</span>
          </div>
          <p class="stat-label">Faol maqsadlar</p>
          <div class="stat-value">${formatNumber(activeGoals)}</div>
          <span class="stat-change">Rejalaringiz sari</span>
        </div>

        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-icon orange">${icon("award")}</span>
          </div>
          <p class="stat-label">Yutuqlar</p>
          <div class="stat-value">${formatNumber(data.achievements.length)}</div>
          <span class="stat-change">Qo‘lga kiritilgan</span>
        </div>
      </div>

      <section class="card daily-coach-card">
        <div class="daily-coach-icon">${icon("sparkles",22)}</div>
        <div><span class="eyebrow">SMARTGOAL MASLAHATI</span><h3>${escapeHTML(coachTip.title)}</h3><p>${escapeHTML(coachTip.text)}</p></div>
        <div class="daily-coach-actions"><button class="secondary-button" type="button" data-action="generate-daily-advice">${icon("sparkles",14)} AI’dan shaxsiy maslahat</button><button class="card-action" type="button" data-page="ai">AI bilan suhbat ${icon("arrow-right",14)}</button></div>
      </section>
      <section class="card daily-ai-advice-output hidden" id="daily-ai-advice-card" aria-live="polite"><div class="card-header"><h3 class="card-title">AI tavsiyasi</h3><button class="card-action" type="button" data-action="close-daily-advice">Yopish</button></div><div id="daily-ai-advice-output" class="card-description"></div></section>

      <div class="dashboard-grid">
        <div class="dashboard-column">
          <section class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Faollik grafigi</h3>
                <p class="card-description">So‘nggi 7 kun ichidagi to‘plangan XP</p>
              </div>
              <button class="card-action" type="button" data-page="analytics">Batafsil ${icon("arrow-right", 13)}</button>
            </div>
            ${chartMarkup()}
          </section>

          <section class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Bugungi vazifalar</h3>
                <p class="card-description">${completedToday}/${todayTasks.length} ta bajarildi</p>
              </div>
              <button class="card-action" type="button" data-action="add-task">+ Qo‘shish</button>
            </div>
            ${tasksHTML}
          </section>
        </div>

        <div class="dashboard-column">
          <section class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Maqsadlarim</h3>
                <p class="card-description">Hozirgi rivojlanish jarayoni</p>
              </div>
              <button class="card-action" type="button" data-page="goals">Barchasi ${icon("arrow-right", 13)}</button>
            </div>
            <div class="goal-list">${goalsHTML}</div>
          </section>

          <section class="level-card">
            <span class="section-label">SIZNING DARAJANGIZ</span>
            <div class="level-number">Level ${rank.level}</div>
            <div class="level-title">${escapeHTML(rank.name)}</div>
            <p class="level-description">
              ${rank.next
                ? `Keyingi darajaga o‘tish uchun yana ${formatNumber(rank.remaining)} XP to‘plang.`
                : "Siz eng yuqori mavjud darajaga yetdingiz!"}
            </p>
            <div class="progress-track" style="margin-top:16px">
              <div class="progress-fill" style="width:${rank.progress}%"></div>
            </div>
            <div class="goal-footer">
              <span>${formatNumber(Number(data.xp||0)+Number(data.spentXP||0))} XP</span>
              <span>${rank.next ? `${formatNumber(rank.next.xp)} XP` : "MAX"}</span>
            </div>
            <button class="card-action" type="button" data-page="profile" style="margin-top:16px">
              Darajamni ko‘rish ${icon("arrow-right", 13)}
            </button>
          </section>
        </div>
      </div>
    `;
  }

  /* -------------------- GOALS PAGE -------------------- */

  function refreshGoalProgress() {
    for (const goal of data.goals) {
      const linked=data.tasks.filter(task=>task.goalId===goal.id);
      if (!linked.length) {
        if (goal.completed) { goal.completed=false; goal.progress=0; }
        continue;
      }
      const completed=linked.filter(task=>task.completed).length;
      goal.progress=Math.round(completed/linked.length*100);
      goal.completed=completed===linked.length;
    }
  }

  function getGoalProgress(goal) {
    const linked = data.tasks.filter(task => task.goalId === goal.id);
    const completed = linked.filter(task => task.completed).length;
    const progress = linked.length ? Math.round(completed / linked.length * 100) : Math.max(0,Math.min(100,Number(goal.progress)||0));
    const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline+"T12:00:00").getTime()-new Date(today()+"T12:00:00").getTime())/86400000) : null;
    return { total:linked.length, completed, remaining:Math.max(0,linked.length-completed), progress, daysLeft };
  }

  function renderGoals() {
    const goals = data.goals;
    const visibleGoals = goals.slice(0,goalListLimit);
    const goalStats = new Map(goals.map(goal => [goal.id,getGoalProgress(goal)]));
    const progressFor = goal => goalStats.get(goal.id) || getGoalProgress(goal);

    return `
      ${pageHeader(
        "REJALARINGIZ",
        "Maqsadlarim",
        "Katta natijalarga kichik qadamlar orqali erishing.",
        actionButton("add-goal", "Maqsad qo‘shish")
      )}

      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">Jami maqsadlar</p>
          <div class="stat-value">${goals.length}</div>
        </div>
        <div class="stat-card">
          <p class="stat-label">Faol maqsadlar</p>
          <div class="stat-value">${goals.filter(g => !g.completed).length}</div>
        </div>
        <div class="stat-card">
          <p class="stat-label">Yakunlangan</p>
          <div class="stat-value">${goals.filter(g => g.completed).length}</div>
        </div>
        <div class="stat-card">
          <p class="stat-label">O‘rtacha progress</p>
          <div class="stat-value">${goals.length ? Math.round(goals.reduce((sum, goal) => sum + progressFor(goal).progress, 0) / goals.length) : 0}%</div>
        </div>
      </div>

      <div class="goal-list">
        ${goals.length ? visibleGoals.map(goal => { const progress=progressFor(goal); return `
          <article class="goal-item">
            <div class="goal-item-header">
              <div>
                <strong>${escapeHTML(goal.title)}</strong>
                <small>${escapeHTML(goal.description || "Maqsad tavsifi kiritilmagan")}</small>
                <small>${goal.deadline ? `Muddat: ${escapeHTML(formatDate(goal.deadline))}` : "Muddat belgilanmagan"}</small>
              </div>
              <span class="goal-percentage">${progress.progress}%</span>
            </div>

            <div class="progress-track">
              <div class="progress-fill" style="width:${progress.progress}%"></div>
            </div>

            <div class="goal-progress-detail"><span>${progress.total ? `${progress.completed}/${progress.total} vazifa bajarildi · yana ${progress.remaining} ta qoldi` : "Vazifalarni shu maqsadga bog‘lab, rivojlanishni kuzating."}</span><span>${progress.daysLeft===null ? "Muddat yo‘q" : progress.daysLeft<0 ? "Muddat o‘tgan" : progress.daysLeft===0 ? "Bugun oxirgi kun" : `Yana ${progress.daysLeft} kun`}</span></div>
            <div class="goal-footer">
              <span>${goal.completed ? "Yakunlangan" : `Ustuvorlik: ${escapeHTML(goal.priority || "medium")}`}</span>
              <span>
                <button class="card-action" type="button" data-action="edit-goal" data-id="${escapeHTML(goal.id)}">Tahrirlash</button>
                <button class="card-action" type="button" data-action="delete-goal" data-id="${escapeHTML(goal.id)}">O‘chirish</button>
              </span>
            </div>
          </article>
        `; }).join("") : emptyState("Maqsadlar mavjud emas", "Birinchi maqsadingizni yarating va unga qadam-baqadam yaqinlashing.", "target")}
        ${goals.length > goalListLimit ? `<button class="secondary-button task-load-more" type="button" data-action="load-more-goals">Yana ${Math.min(40,goals.length-goalListLimit)} ta maqsadni ko‘rsatish</button>` : ""}
      </div>
    `;
  }

  /* -------------------- SCHEDULE PAGE -------------------- */

  function renderSchedule() {
    const tasks = [...data.tasks].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const visibleTasks = tasks.slice(0, taskListLimit);

    return `
      ${pageHeader(
        "KUNLIK REJA",
        "Vazifalar",
        "Vazifalaringizni tartibga soling va bajarilganlarini belgilang.",
        actionButton("add-task", "Vazifa qo‘shish")
      )}

      <section class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Barcha vazifalar</h3>
            <p class="card-description">${tasks.filter(t => t.completed).length} / ${tasks.length} ta bajarilgan</p>
          </div>
        </div>

        <div class="task-list">
          ${tasks.length ? visibleTasks.map(task => `
            <div class="task-item ${task.completed ? "task-completed" : ""}">
              <input class="task-checkbox" type="checkbox"
                data-action="toggle-task" data-id="${escapeHTML(task.id)}"
                ${task.completed ? "checked" : ""}>

              <div class="task-info">
                <strong>${escapeHTML(task.title)}</strong>
                <small>${escapeHTML(formatDate(task.date))} · ${Number(task.estimatedMinutes||30)} daqiqa</small>
              </div>

              <span class="task-reward">${icon("zap", 12)} AI: 0–15 XP</span>

              <button class="icon-button" type="button"
                data-action="edit-task" data-id="${escapeHTML(task.id)}"
                aria-label="Tahrirlash">${icon("pencil", 15)}</button>

              <button class="icon-button" type="button"
                data-action="delete-task" data-id="${escapeHTML(task.id)}"
                aria-label="O‘chirish">${icon("trash-2", 15)}</button>
            </div>
          `).join("") : emptyState("Vazifalar mavjud emas", "Yangi vazifa qo‘shib rejangizni boshlang.", "calendar-check")}
        </div>
        ${tasks.length > taskListLimit ? `<button class="secondary-button task-load-more" type="button" data-action="load-more-tasks">Yana ${Math.min(50,tasks.length-taskListLimit)} ta vazifani ko‘rsatish</button>` : ""}
      </section>
    `;
  }

  /* -------------------- PLANNER PAGE -------------------- */

  function renderPlanner() {
    const activeGoals = data.goals.filter(goal => !goal.completed);
    const pendingTasks = data.tasks.filter(task => !task.completed);
    const routine = [...(data.dailyRoutine || [])].sort((a,b) => String(a.time).localeCompare(String(b.time)));

    return `
      ${pageHeader("VAQTNI BOSHQARISH","Kun tartibim","Kunlik rejangiz, odatlaringiz va maqsadlaringizni bir joyda boshqaring.")}

      <section class="card routine-card">
        <div class="card-header">
          <div><span class="eyebrow">SIZNING SHAXSIY REJANGIZ</span><h3 class="card-title">Kun tartibim</h3><p class="card-description">Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.</p></div>
          ${actionButton("add-routine","Band qo‘shish","plus")}
        </div>
        <div class="routine-list">
          ${routine.length ? routine.map(item => `
            <article class="routine-item">
              <time>${escapeHTML(item.time || "--:--")}</time>
              <div class="routine-item-content"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.description || "")}</small></div>
              <div class="routine-item-actions">
                <button class="icon-button" type="button" data-action="edit-routine" data-id="${escapeHTML(item.id)}" aria-label="Tahrirlash">${icon("pencil",15)}</button>
                <button class="icon-button" type="button" data-action="delete-routine" data-id="${escapeHTML(item.id)}" aria-label="O‘chirish">${icon("trash-2",15)}</button>
              </div>
            </article>`).join("") : emptyState("Kun tartibi hali tuzilmagan","Masalan, 07:00 — uyg‘onish, 07:15 — badantarbiya kabi bandlar qo‘shing.","sunrise")}
        </div>
        <div class="routine-ai">
          <div><strong>${icon("sparkles",16)} AI bilan kun tartibini tuzish</strong><small>Uyg‘onish vaqtingiz, o‘qish/ish jadvalingiz va odatlaringizni yozing. Eslatmalar sahifa ochiq turganda ishlaydi.</small></div>
          <textarea id="routine-ai-prompt" class="field-textarea" rows="2" maxlength="700" placeholder="Masalan: 07:00 da uyg‘onaman, 08:30 da maktabga ketaman, 14:00 da qaytaman. Kechqurun ingliz tili o‘rganmoqchiman."></textarea>
          <button class="primary-button" type="button" data-action="generate-routine">${icon("sparkles",15)} Menga kun tartibi tuz</button>
          <button class="secondary-button" type="button" data-action="enable-routine-reminders">${icon("bell",15)} ${settings.routineReminders ? "Eslatmalar yoqilgan" : "Vaqtida eslatib tur"}</button>
        </div>
      </section>

      <section class="card" style="margin-top:20px">
        <div class="card-header"><div><h3 class="card-title">Bugungi vazifalar</h3><p class="card-description">${escapeHTML(formatDate(today()))}</p></div>${actionButton("add-task","Vazifa qo‘shish")}</div>
        ${pendingTasks.filter(task => task.date === today()).length
          ? `<div class="task-list">${pendingTasks.filter(task => task.date === today()).map(task => `<div class="task-item"><input class="task-checkbox" type="checkbox" data-action="toggle-task" data-id="${escapeHTML(task.id)}"><div class="task-info"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.description || formatDate(task.date))}</small></div><span class="task-reward">${icon("zap",12)} AI: 0–15 XP</span></div>`).join("")}</div>`
          : emptyState("Bugungi vazifalar yo‘q","Yangi vazifa qo‘shib, kunlik rejangizni boshlang.","calendar-check")}
      </section>

      <section class="card" style="margin-top:20px">
        <div class="card-header"><div><h3 class="card-title">Maqsadlar asosida tavsiyalar</h3><p class="card-description">AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.</p></div><button class="card-action" type="button" data-action="generate-ai-plan">AI reja tuzsin</button></div>
        <div id="ai-plan-output" class="card-description" style="white-space:pre-wrap;margin:12px 0"></div>
        ${activeGoals.length ? activeGoals.map(goal => `<div class="goal-item"><div class="goal-item-header"><div><strong>${escapeHTML(goal.title)}</strong><small>${escapeHTML(goal.description || "Maqsadga erishish uchun muntazam ishlang.")}</small></div><span class="goal-percentage">${getGoalProgress(goal).progress}%</span></div><p class="card-description">Tavsiya: ushbu maqsad uchun bugun kamida bitta kichik vazifa belgilang.</p></div>`).join("") : emptyState("Faol maqsad yo‘q","Avval maqsad yarating.","target")}
      </section>
    `;
  }

  function openRoutineForm(id = null) {
    const item = (data.dailyRoutine || []).find(row => row.id === id);
    openModal(item ? "Kun tartibini tahrirlash" : "Kun tartibiga yangi band", `
      <form id="routine-form" class="form-grid">
        <input type="hidden" name="id" value="${escapeHTML(item?.id || "")}">
        <div class="form-field"><label class="field-label">Vaqt</label><input class="field-input" type="time" name="time" required value="${escapeHTML(item?.time || "07:00")}"></div>
        <div class="form-field full-width"><label class="field-label">Nima qilasiz?</label><input class="field-input" name="title" maxlength="90" required placeholder="Masalan: Uyg‘onish" value="${escapeHTML(item?.title || "")}"></div>
        <div class="form-field full-width"><label class="field-label">Qisqa izoh (ixtiyoriy)</label><textarea class="field-textarea" name="description" maxlength="180" rows="2" placeholder="Masalan: Suv ichish va xonani shamollatish">${escapeHTML(item?.description || "")}</textarea></div>
      </form>`, `
      <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
      <button class="primary-button" type="submit" form="routine-form">Saqlash</button>`);
  }

  function saveRoutine(form) {
    const fd = new FormData(form), id = String(fd.get("id") || "");
    const time = String(fd.get("time") || ""), title = String(fd.get("title") || "").trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time) || title.length < 2) { showToast("Vaqt va mashg‘ulot nomini to‘g‘ri kiriting.", "error"); return; }
    if ((data.dailyRoutine || []).some(item => item.time === time && item.id !== id)) { showToast("Bu vaqtga boshqa mashg‘ulot belgilangan. Boshqa vaqt tanlang.", "error"); return; }
    const values = { time, title, description: String(fd.get("description") || "").trim().slice(0,180) };
    if (id) { const item = data.dailyRoutine.find(row => row.id === id); if (item) Object.assign(item, values); }
    else data.dailyRoutine.push({ id: uid(), ...values });
    data.dailyRoutine.sort((a,b) => a.time.localeCompare(b.time));
    saveData(); closeModal(); render(); showToast("Kun tartibi saqlandi.");
  }

  async function enableRoutineReminders() {
    if (!("Notification" in window)) {
      settings.routineReminders=true; saveSettings(); render();
      showToast("Ilova ichidagi kun tartibi eslatmalari yoqildi.");
      return;
    }
    if (Notification.permission === "denied") {
      settings.routineReminders=true; saveSettings(); render();
      showToast("Ilova ichidagi eslatmalar yoqildi. Brauzer xabarlari bloklangan.");
      return;
    }
    const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    settings.routineReminders=true; saveSettings(); render();
    showToast(permission==="granted" ? "Kun tartibi eslatmalari yoqildi." : "Ilova ichidagi eslatmalar yoqildi. Brauzer xabarlariga ruxsat berilmadi.");
  }

  function checkDueTaskNotifications() {
    const day=today();
    let added=0;
    for (const task of (data.tasks||[]).filter(item=>!item.completed && item.date===day).slice(0,80)) {
      const key="smartgoal_task_due_"+day+"_"+task.id;
      if (localStorage.getItem(key)) continue;
      localStorage.setItem(key,"1");
      data.notifications.unshift({id:uid(),title:"Bugungi vazifa",message:task.title+" — bugun bajarish rejalashtirilgan.",date:new Date().toISOString(),read:false});
      added++;
    }
    if (added) {
      data.notifications=data.notifications.slice(0,60);
      saveData(); updateNotificationIndicators();
      if (currentPage==="notifications") render();
    }
  }

  function checkRoutineReminders() {
    checkDueTaskNotifications();
    if (!settings.routineReminders || !Array.isArray(data.dailyRoutine) || !data.dailyRoutine.length) return;
    const now = new Date(), time = String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
    const day = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
    for (const item of data.dailyRoutine) {
      if (item.time !== time) continue;
      const key = "smartgoal_routine_reminder_"+day+"_"+item.id;
      if (localStorage.getItem(key)) continue;
      localStorage.setItem(key,"1");
      addNotification("Kun tartibi vaqti!", item.title + (item.description ? " — "+item.description : ""));
      if ("Notification" in window && Notification.permission === "granted") {
        try { new Notification("SmartGoal · "+item.title,{body:item.description || "Rejangizdagi navbatdagi ish vaqti keldi."}); } catch {}
      }
    }
  }

  async function generateRoutine() {
    const input = $("#routine-ai-prompt"), prompt = String(input?.value || "").trim();
    if (!prompt) { showToast("Avval kuningiz haqida qisqacha yozing.", "error"); return; }
    const button = document.querySelector("[data-action='generate-routine']");
    if (button) { button.disabled = true; button.textContent = settings.language==="ru"?"AI составляет распорядок...":settings.language==="en"?"AI is building your routine...":"AI reja tuzmoqda..."; }
    try {
      const response = await fetch("/api/ai", { method:"POST", credentials:"same-origin", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"routine",prompt,language:settings.language}) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "AI kun tartibini tuza olmadi.");
      const match = String(result.answer || "").match(/\[[\s\S]*\]/);
      if (!match) throw new Error("AI reja formatini tushunib bo‘lmadi. Qayta urinib ko‘ring.");
      const items = JSON.parse(match[0]);
      if (!Array.isArray(items) || !items.length) throw new Error("AI bo‘sh kun tartibi qaytardi.");
      const usedTimes = new Set();
      const cleaned = items.slice(0,14).filter(item => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(item.time || "")) && String(item.title || "").trim().length >= 2 && !usedTimes.has(item.time) && usedTimes.add(item.time)).map(item => ({id:uid(),time:item.time,title:String(item.title).slice(0,90),description:String(item.description || "").slice(0,180)}));
      if (!cleaned.length) throw new Error("AI yaratgan vaqtlar noto‘g‘ri formatda.");
      data.dailyRoutine = cleaned.sort((a,b) => a.time.localeCompare(b.time));
      saveData(); render(); showToast("AI kun tartibingizni tayyorladi. Xohlasangiz, bandlarni tahrirlang.");
    } catch (error) { showToast(error.message || "AI xatolik berdi.", "error"); }
    finally { if (button) { button.disabled = false; button.innerHTML = icon("sparkles",15) + " Menga kun tartibi tuz"; translateVisibleUI(button); refreshIcons(); } }
  }

  /* -------------------- ANALYTICS PAGE -------------------- */

  function renderAnalytics() {
    const completed = data.tasks.filter(task => task.completed).length;
    const total = data.tasks.length;
    const completion = total ? Math.round(completed / total * 100) : 0;
    const weeklyXP = getLastSevenDays().reduce((sum, day) => sum + day.xp, 0);

    return `
      ${pageHeader(
        "NATIJALARINGIZ",
        "Statistika",
        "Faolligingiz va rivojlanishingizni tahlil qiling."
      )}

      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">Jami XP</p>
          <div class="stat-value">${formatNumber(data.xp)}</div>
        </div>
        <div class="stat-card">
          <p class="stat-label">Bu haftadagi XP</p>
          <div class="stat-value">${formatNumber(weeklyXP)}</div>
        </div>
        <div class="stat-card">
          <p class="stat-label">Bajarilgan vazifalar</p>
          <div class="stat-value">${completed}</div>
        </div>
        <div class="stat-card">
          <p class="stat-label">Bajarilish foizi</p>
          <div class="stat-value">${completion}%</div>
        </div>
      </div>

      <section class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Haftalik faollik</h3>
            <p class="card-description">Har kuni to‘plangan XP</p>
          </div>
        </div>
        ${chartMarkup()}
      </section>

      <section class="card" style="margin-top:20px">
        <h3 class="card-title">Maqsadlar sari bosib o‘tilgan yo‘l</h3>
        <p class="card-description">Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.</p>
        ${data.goals.length ? data.goals.map(goal => { const progress=getGoalProgress(goal); return `<div class="goal-progress-analytics"><div class="goal-item-header"><strong>${escapeHTML(goal.title)}</strong><span class="goal-percentage">${progress.progress}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${progress.progress}%"></div></div><div class="goal-progress-detail"><span>${progress.completed} / ${progress.total} vazifa bajarildi · ${progress.remaining} ta qoldi</span><span>${progress.daysLeft===null?"Muddat yo‘q":progress.daysLeft<0?Math.abs(progress.daysLeft)+" kun kechikkan":progress.daysLeft===0?"Bugun oxirgi kun":progress.daysLeft+" kun qoldi"}</span></div></div>`; }).join("") : emptyState("Hali maqsad yo‘q","Maqsad yarating va unga tegishli vazifalarni belgilang.","target")}
      </section>

      <section class="card" style="margin-top:20px">
        <h3 class="card-title">Umumiy natijalar</h3>
        <div class="setting-row">
          <div class="setting-info"><strong>Maqsadlar</strong><small>Yaratilgan maqsadlar soni</small></div>
          <strong>${data.goals.length}</strong>
        </div>
        <div class="setting-row">
          <div class="setting-info"><strong>Yutuqlar</strong><small>Qo‘lga kiritilgan yutuqlar</small></div>
          <strong>${data.achievements.length}</strong>
        </div>
        <div class="setting-row">
          <div class="setting-info"><strong>Xaridlar</strong><small>Do‘kondan olingan mahsulotlar</small></div>
          <strong>${data.inventory.length}</strong>
        </div>
      </section>
    `;
  }

  /* -------------------- ACHIEVEMENTS PAGE -------------------- */

  function renderAchievements() {
    const memories=Array.isArray(data.memories)?data.memories:[];
    const visibleMemories=memories.slice(0,memoryListLimit);
    return `
      ${pageHeader(
        "SIZNING NATIJALARINGIZ",
        "Yutuqlarim",
        "Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.",
        actionButton("add-memory", "Yutuq qo‘shish", "plus")
      )}

      <section class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">SmartGoal yutuqlari</h3>
            <p class="card-description">${data.achievements.length} / ${ACHIEVEMENTS.length} ta ochilgan</p>
          </div>
        </div>

        <div class="badge-grid">
          ${ACHIEVEMENTS.map(item => {
            const earned = data.achievements.includes(item.id);
            return `
              <div class="achievement-card ${earned ? "" : "locked"}">
                <div class="achievement-icon">${icon(earned ? item.icon : "lock", 23)}</div>
                <strong>${escapeHTML(item.name)}</strong>
                <small>${escapeHTML(item.description)}</small>
                <small>${earned ? "Qo‘lga kiritilgan" : "Hali ochilmagan"}</small>
              </div>
            `;
          }).join("")}
        </div>
      </section>

      <section class="card" style="margin-top:20px">
        <div class="card-header">
          <div>
            <h3 class="card-title">Shaxsiy xotiralar</h3>
            <p class="card-description">Sertifikatlar, muhim kunlar va esdaliklar.</p>
          </div>
        </div>

        ${memories.length ? visibleMemories.map(memory => `
          <article class="notification-item">
            <div class="achievement-icon">${icon(memory.type === "certificate" ? "file-badge" : "bookmark", 20)}</div>
            <div>
              <strong>${escapeHTML(memory.title)}</strong>
              ${memory.image ? `<img class="memory-image" src="${escapeHTML(memory.image)}" alt="${escapeHTML(memory.title)}" loading="lazy" decoding="async">` : ""}
              <p>${escapeHTML(memory.description || "")}</p>
              <small>${escapeHTML(formatDate(memory.date))}</small>
            </div>
            <button class="icon-button" type="button" data-action="delete-memory" data-id="${escapeHTML(memory.id)}">${icon("trash-2", 14)}</button>
          </article>
        `).join("") : emptyState("Xotiralar hali yo‘q", "Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.", "bookmark")}
        ${memories.length > memoryListLimit ? `<button class="secondary-button task-load-more" type="button" data-action="load-more-memories">Yana ${Math.min(30,memories.length-memoryListLimit)} ta xotirani ko‘rsatish</button>` : ""}
      </section>
    `;
  }

  function openMemoryForm() {
    openModal(
      "Yangi yutuq yoki xotira",
      `
        <form id="memory-form" class="form-grid">
          <div class="form-field full-width">
            <label class="field-label">Sarlavha</label>
            <input class="field-input" name="title" maxlength="100" required placeholder="Masalan: Birinchi sertifikatim">
          </div>
          <div class="form-field full-width">
            <label class="field-label">Tavsif</label>
            <textarea class="field-textarea" name="description" maxlength="500" placeholder="Bu kun nima uchun muhim?"></textarea>
          </div>
          <div class="form-field">
            <label class="field-label">Turi</label>
            <select class="field-select" name="type">
              <option value="memory">Shaxsiy xotira</option>
              <option value="certificate">Sertifikat</option>
              <option value="milestone">Muhim natija</option>
            </select>
          </div>
          <div class="form-field">
            <label class="field-label">Sana</label>
            <input class="field-input" type="date" name="date" value="${today()}">
          </div>
          <div class="form-field full-width">
            <label class="field-label">Yutuq rasmi (ixtiyoriy)</label>
            <input class="field-input" type="file" name="image" accept="image/png,image/jpeg,image/webp">
            <small>Sertifikat yoki esdalik rasmini qo‘shing. Rasm avtomatik kichraytiriladi.</small>
          </div>
        </form>
      `,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="submit" form="memory-form">Saqlash</button>
      `
    );
  }

  async function saveMemory(form) {
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();

    if (title.length < 2) {
      showToast("Sarlavha kiriting.", "error");
      return;
    }

    const file = fd.get("image");
    let image = "";
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) { showToast("Rasm 4 MB dan kichik bo‘lishi kerak.", "error"); return; }
      try { image = await resizeImage(file, 320, 0.6); } catch { showToast("Rasmni yuklab bo‘lmadi.", "error"); return; }
    }
    if (image && data.memories.filter(item => item.image).length >= 8) { showToast("Profil va yutuqlar uchun jami 8 tagacha rasm saqlash mumkin.", "error"); return; }
    data.memories.unshift({
      id: uid(),
      title,
      description: String(fd.get("description") || "").trim(),
      type: String(fd.get("type") || "memory"),
      date: String(fd.get("date") || today()),
      image
    });
    data.memories = data.memories.slice(0,100);

    saveData();
    closeModal();
    render();
    showToast("Xotirangiz saqlandi.");
  }

  /* -------------------- STORE PAGE -------------------- */

  function renderRewards() {
    const visibleItems = STORE_ITEMS.filter(item => storeFilter === "all" || item.type === storeFilter);
    const categories = [{id:"all",label:"Barchasi"},{id:"theme",label:"Mavzular"},{id:"background",label:"Profil fonlari"},{id:"badge",label:"Belgilar"},{id:"avatar",label:"Avatar ramkalari"}];
    return `
      ${pageHeader("MAXSUS IMKONIYATLAR","Mukofotlar do‘koni","XP bilan profilingiz va SmartGoal ko‘rinishini o‘zingizga moslang.")}
      <section class="welcome-banner" style="min-height:120px"><div class="welcome-content"><span class="eyebrow">SIZNING BALANSINGIZ</span><h2>${formatNumber(data.xp)} XP</h2><p>Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.</p></div><div class="welcome-visual">${icon("shopping-bag",65)}</div></section>
      <div class="store-categories" role="group" aria-label="Do‘kon kategoriyalari">
        ${categories.map(item => `<button type="button" class="store-category ${storeFilter===item.id?"active":""}" data-store-filter="${item.id}">${item.label}</button>`).join("")}
      </div>
      <div class="store-grid">
        ${visibleItems.map(item => {
          const owned = data.inventory.some(product => product.id === item.id);
          const canAfford = Number(data.xp) >= item.price;
          return `<article class="store-item"><div class="store-preview">${icon(item.icon,45)}</div><div class="store-content"><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description)}</p><div class="store-price"><strong>${formatNumber(item.price)} XP</strong>${owned ? `<button class="secondary-button" type="button" data-action="use-item" data-id="${escapeHTML(item.id)}">Qo‘llash</button>` : `<button class="primary-button" type="button" data-action="buy-item" data-id="${escapeHTML(item.id)}" ${canAfford?"":"disabled"}>${canAfford?"Xarid":"XP yetarli emas"}</button>`}</div></div></article>`;
        }).join("") || emptyState("Bu kategoriyada mahsulot yo‘q","Boshqa kategoriyani tanlang.","package")}
      </div>
      <section class="card" style="margin-top:22px"><h3 class="card-title">Sizning kolleksiyangiz</h3><p class="card-description">Sotib olgan mahsulotlaringiz shu yerda saqlanadi.</p><div class="badge-grid" style="margin-top:16px">
        ${data.inventory.length ? data.inventory.map(owned => { const item=STORE_ITEMS.find(product=>product.id===owned.id); return item ? `<div class="achievement-card"><div class="achievement-icon">${icon(item.icon,22)}</div><strong>${escapeHTML(item.name)}</strong><button class="card-action" type="button" data-action="use-item" data-id="${escapeHTML(item.id)}">Qo‘llash</button></div>` : ""; }).join("") : emptyState("Kolleksiyangiz hozircha bo‘sh","Do‘kondan birinchi mahsulotingizni xarid qiling.","package")}
      </div></section>
    `;
  }

  /* -------------------- COMMUNITY PAGE -------------------- */

  function renderCommunity() {
    setTimeout(loadCommunityRelations, 0);
    setTimeout(loadCommunityLeaderboard, 0);
    return `
      ${pageHeader(
        "HAMJAMIYAT",
        "Foydalanuvchilar",
        "Username orqali boshqa foydalanuvchilarni toping."
      )}

      <section class="card">
        <div class="form-field">
          <label class="field-label" for="community-search">Username bo‘yicha qidirish</label>
          <div class="input-wrap">
            ${icon("search")}
            <input id="community-search" type="search" placeholder="@username">
          </div>
          <small>Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.</small>
        </div>

        <div id="community-results" style="margin-top:20px">
          ${emptyState("Qidiruvga tayyor", "Username kiriting. Haqiqiy foydalanuvchilar ro‘yxati backend bilan ulanadi.", "users")}
        </div>
      </section>

      <section class="card community-leaderboard-card" style="margin-top:20px">
        <div class="card-header"><div><h3 class="card-title">Eng faol foydalanuvchilar</h3><p class="card-description">Jami ishlab topilgan XP bo‘yicha reyting.</p></div><button class="card-action" type="button" data-action="refresh-leaderboard">Yangilash</button></div>
        <div id="community-leaderboard">${communityLeaderboard.length ? communityLeaderboard.map(user=>`<div class="leaderboard-row"><span class="leaderboard-rank">#${user.rank}</span><div class="leaderboard-user"><button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(user.username)}"><strong>${escapeHTML(user.name)}</strong></button><small>@${escapeHTML(user.username)} · Level ${getRank(Number(user.totalEarnedXP||0)).level}</small></div><strong class="leaderboard-xp">${formatNumber(user.totalEarnedXP)} XP</strong></div>`).join("") : emptyState("Reyting yuklanmoqda","Eng faol foydalanuvchilar ro‘yxati olinmoqda.","trophy")}</div>
      </section>

      <section class="card" style="margin-top:20px">
        <div class="card-header">
          <h3 class="card-title">Do‘stlik so‘rovlari</h3>
          <button class="card-action" type="button" data-action="refresh-friends">Yangilash</button>
        </div>
        <div id="community-relations">
          ${emptyState("Yuklanmoqda...", "Do‘stlik ma’lumotlari olinmoqda.", "users")}
        </div>
      </section>

      <section class="card" style="margin-top:20px">
        <h3 class="card-title">Sizning darajangiz</h3>
        <p class="card-description">Boshqalar profilingizni ko‘rganda darajangiz va yutuqlaringizni ko‘rishi mumkin bo‘ladi.</p>
        <div class="profile-meta">
          <span>${icon("at-sign")} @${escapeHTML(data.profile.username || "username")}</span>
          <span>${icon("award")} Level ${getRank().level} · ${escapeHTML(getRank().name)}</span>
        </div>
      </section>
    `;
  }

  /* -------------------- AI PAGE -------------------- */

  function renderAI() {
    const welcome={
      uz:"Salom! Men SmartGoal AI murabbiyiman. Maqsadlaringiz, kun tartibingiz va vazifalaringizni birga yaxshilaymiz. Istalgan mavzuda savol berishingiz mumkin.",
      ru:"Здравствуйте! Я AI-наставник SmartGoal. Давайте вместе улучшим ваши цели, распорядок дня и задачи. Вы также можете задавать вопросы на любые темы.",
      en:"Hello! I am your SmartGoal AI coach. Let's improve your goals, daily routine and tasks together. You can also ask me about any topic."
    };
    const quick={
      uz:{today:"Maqsadlarimni tahlil qilib, bugun nima qilishim kerakligini ayt.",routine:"Kun tartibimni yaxshilashga yordam ber.",tasks:"Vazifalarimni qiyinligi va muddatiga qarab tartibla.",motivation:"Motivatsiyam tushib ketdi. Amaliy maslahat ber."},
      ru:{today:"Проанализируй мои цели и скажи, что мне лучше сделать сегодня.",routine:"Помоги улучшить мой распорядок дня.",tasks:"Распредели мои задачи по сложности и срокам.",motivation:"У меня снизилась мотивация. Дай практический совет."},
      en:{today:"Review my goals and tell me what I should focus on today.",routine:"Help me improve my daily routine.",tasks:"Prioritize my tasks by difficulty and deadlines.",motivation:"My motivation is low. Give me practical advice."}
    }[settings.language]||{
      today:"Maqsadlarimni tahlil qilib, bugun nima qilishim kerakligini ayt.",
      routine:"Kun tartibimni yaxshilashga yordam ber.",
      tasks:"Vazifalarimni qiyinligi va muddatiga qarab tartibla.",
      motivation:"Motivatsiyam tushib ketdi. Amaliy maslahat ber."
    };
    const messages=aiConversation.length?aiConversation:[{role:"assistant",content:welcome[settings.language]||welcome.uz}];
    const activeGoals=data.goals.filter(goal=>!goal.completed).length;
    const openTasks=data.tasks.filter(task=>!task.completed).length;
    return `
      ${pageHeader("SHAXSIY YORDAMCHI","Smart AI","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.")}
      <section class="ai-panel"><span class="eyebrow">SMARTGOAL INTELLIGENCE</span><h2>Har kuni yaxshiroq natija sari.</h2><p>AI maqsadlaringiz, vazifalaringiz va kun tartibingizni hisobga olib, amaliy maslahat beradi. Boshqa mavzularda ham bemalol so‘rashingiz mumkin.</p><div class="ai-context-pills"><span>${icon("target",14)} ${activeGoals} faol maqsad</span><span>${icon("list-checks",14)} ${openTasks} bajarilmagan vazifa</span><span>${icon("calendar-clock",14)} ${(data.dailyRoutine||[]).length} kun tartibi bandi</span></div></section>
      <section class="card ai-chat-card" style="margin-top:20px">
        <div class="card-header"><div><h3 class="card-title">AI bilan suhbat</h3><p class="card-description">AI siz yozgan tilda javob beradi.</p></div><button class="card-action" type="button" data-action="clear-ai-chat">Suhbatni tozalash</button></div>
        <div class="ai-quick-prompts"><button type="button" data-ai-prompt="${escapeHTML(quick.today)}">Bugungi rejam</button><button type="button" data-ai-prompt="${escapeHTML(quick.routine)}">Kun tartibim</button><button type="button" data-ai-prompt="${escapeHTML(quick.tasks)}">Vazifalarim</button><button type="button" data-ai-prompt="${escapeHTML(quick.motivation)}">Motivatsiya</button></div>
        <div class="ai-chat" id="ai-chat" aria-live="polite">${messages.map(item=>'<div class="ai-message '+(item.role==="user"?"user":"")+'">'+escapeHTML(item.content)+'</div>').join("")}</div>
        <form id="ai-form" class="ai-input-row" style="margin-top:18px"><input name="message" placeholder="Savolingizni yozing..." maxlength="500" required autocomplete="off"><button class="primary-button" type="submit" aria-label="Yuborish">${icon("send",16)}</button></form>
      </section>`;
  }

  async function sendAIMessage(form) {
    const input=form.elements.message,message=String(input.value||"").trim();if(!message)return;const chat=$("#ai-chat");if(!chat)return;
    aiConversation.push({role:"user",content:message});aiConversation=aiConversation.slice(-12);const typingText=settings.language==="ru"?"AI печатает...":settings.language==="en"?"AI is typing...":"AI javob yozmoqda...";chat.insertAdjacentHTML("beforeend",'<div class="ai-message user">'+escapeHTML(message)+'</div><div class="ai-message" id="ai-typing">'+escapeHTML(typingText)+'</div>');
    input.value="";const submit=form.querySelector("button[type='submit']");if(submit)submit.disabled=true;chat.scrollTop=chat.scrollHeight;
    try{const response=await fetch("/api/ai",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"chat",message,history:aiConversation.slice(0,-1),language:settings.language})});const result=await response.json().catch(()=>({}));if(!response.ok||!result.success)throw new Error(result.message||"AI bilan bog‘lanib bo‘lmadi.");aiConversation.push({role:"assistant",content:result.answer});aiConversation=aiConversation.slice(-12);$("#ai-typing")?.remove();chat.insertAdjacentHTML("beforeend",'<div class="ai-message">'+escapeHTML(result.answer)+'</div>');}
    catch(error){$("#ai-typing")?.remove();const msg=error.message||"AI hozircha javob bera olmadi.";if(aiConversation.at(-1)?.role==="user"&&aiConversation.at(-1)?.content===message)aiConversation.pop();chat.insertAdjacentHTML("beforeend",'<div class="ai-message">'+escapeHTML(msg)+'</div>');}
    finally{if(submit)submit.disabled=false;chat.scrollTop=chat.scrollHeight;}
  }
  async function generateDailyAdvice() {
    const card=$("#daily-ai-advice-card"),output=$("#daily-ai-advice-output"),button=document.querySelector("[data-action='generate-daily-advice']");
    if(!card||!output)return;
    card.classList.remove("hidden");
    output.textContent=settings.language==="ru"?"Анализирую ваши цели и задачи...":settings.language==="en"?"Reviewing your goals and tasks...":"Maqsad va vazifalaringiz tahlil qilinmoqda...";
    if(button)button.disabled=true;
    const prompts={
      uz:"Bugungi maqsadlarim, vazifalarim, kun tartibim va oxirgi natijalarimni tahlil qil. Menga aynan hozir foydali bo‘ladigan 3 ta aniq, real va ustuvor maslahat ber. Har bir maslahat nima uchun kerakligini qisqa tushuntir. Ma’lumot yetishmasa, taxmin qilma.",
      ru:"Проанализируй мои цели, задачи, распорядок дня и последние результаты. Дай 3 конкретных, реалистичных и приоритетных совета, полезных именно сейчас. Кратко объясни каждый совет. Не выдумывай недостающие данные.",
      en:"Analyze my goals, tasks, daily routine and recent progress. Give me 3 specific, realistic, prioritized recommendations that are useful right now. Briefly explain each one. Do not invent missing information."
    };
    try{
      const response=await fetch("/api/ai",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"chat",message:prompts[settings.language]||prompts.uz,language:settings.language,history:[]})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.success)throw new Error(result.message||"AI maslahat bera olmadi.");
      output.textContent=result.answer;
    }catch(error){output.textContent=error.message||"AI bilan aloqa uzildi.";}
    finally{if(button)button.disabled=false;}
  }

  async function generateAIPlan() {
    const output=$("#ai-plan-output"),button=document.querySelector("[data-action='generate-ai-plan']");if(!output)return;if(button)button.disabled=true;output.textContent=settings.language==="ru"?"AI анализирует ваши цели и задачи...":settings.language==="en"?"AI is analyzing your goals and tasks...":"AI maqsadlaringiz va vazifalaringizni tahlil qilmoqda...";
    try{const response=await fetch("/api/ai",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"plan",language:settings.language})});const result=await response.json().catch(()=>({}));if(!response.ok||!result.success)throw new Error(result.message||"AI reja tuza olmadi.");output.textContent=result.answer;}
    catch(error){output.textContent=error.message||"AI reja tuzishda xatolik yuz berdi.";}
    finally{if(button)button.disabled=false;}
  }

  /* -------------------- NOTIFICATIONS PAGE -------------------- */

  function renderNotifications() {
    return `
      ${pageHeader(
        "YANGILIKLAR",
        "Bildirishnomalar",
        "Faolligingiz va yutuqlaringiz haqidagi xabarlar."
      )}

      <section class="card">
        <div class="card-header">
          <h3 class="card-title">Barcha bildirishnomalar</h3>
          <button class="card-action" type="button" data-action="mark-all-read">Barchasini o‘qilgan qilish</button>
        </div>

        <div class="notification-list">
          ${data.notifications.length ? data.notifications.map(item => `
            <article class="notification-item ${item.read ? "" : "unread"}">
              <div class="achievement-icon">${icon(item.title.includes("yutuq") ? "trophy" : "bell", 19)}</div>
              <div>
                <strong>${escapeHTML(item.title)}</strong>
                <p>${escapeHTML(item.message)}</p>
                <small>${escapeHTML(new Date(item.date).toLocaleString(getLocale()))}</small>
              </div>
              ${!item.read ? `<button class="card-action" type="button" data-action="read-notification" data-id="${escapeHTML(item.id)}">O‘qildi</button>` : ""}
            </article>
          `).join("") : emptyState("Bildirishnomalar yo‘q", "Yangi xabarlar shu yerda paydo bo‘ladi.", "bell")}
        </div>
      </section>
    `;
  }

  /* -------------------- PROFILE PAGE -------------------- */

  function renderProfile() {
    const rank = getRank();
    const profile = data.profile;
    const completedTasks = data.tasks.filter(task => task.completed).length;
    const totalEarnedXP = Number(data.xp || 0) + Number(data.spentXP || 0);
    const customizationScore = [profile.background && profile.background !== "default", profile.avatarFrame && profile.avatarFrame !== "default", Boolean(profile.activeBadge)].filter(Boolean).length;

    const backgroundStyles = {
      default: "linear-gradient(120deg,#5145cf,#9282f6)",
      midnight: "linear-gradient(120deg,#101827,#283958)",
      galaxy: "radial-gradient(circle at 80% 20%,#7256c9,#161b43 65%)",
      royal: "linear-gradient(120deg,#7c4a20,#d3a24b)",
      sakura: "linear-gradient(120deg,#e7a5bd,#8b6bba)",
      nebula: "radial-gradient(circle at 25% 25%,#a35ac8,#111b3c 70%)",
      aurora: "linear-gradient(130deg,#123d43,#5b4a9a 55%,#a3d5c6)",
      forest: "linear-gradient(130deg,#102f26,#39745a 55%,#b4c99a)",
      sunrise: "linear-gradient(130deg,#713f57,#e18c70 55%,#f5d99a)"
    };

    const bg = backgroundStyles[profile.background] || backgroundStyles.default;

    return `
      <div class="profile-cover" style="background:${bg}"></div>

      <section class="profile-main-card">
        <div class="profile-avatar-wrap">
          <span class="avatar avatar-frame-${escapeHTML(profile.avatarFrame || "default")}">
            ${profile.avatar
              ? `<img src="${escapeHTML(profile.avatar)}" alt="Profil rasmi" loading="lazy" decoding="async">`
              : icon("user-round", 42)}
          </span>
          <button class="profile-edit-avatar" type="button" data-action="edit-profile" aria-label="Profilni tahrirlash">
            ${icon("pencil", 15)}
          </button>
        </div>

        <div class="profile-name">${escapeHTML(profile.name || "Foydalanuvchi")}</div>
        <div class="profile-username">@${escapeHTML(profile.username || "username")}</div>
        <small class="profile-decoration-score">Profil bezagi: ${[profile.background && profile.background!=="default",profile.avatarFrame && profile.avatarFrame!=="default",Boolean(profile.activeBadge)].filter(Boolean).length} / 3</small>
        ${profile.activeBadge ? `<span class="profile-active-badge">${icon("award",13)} ${escapeHTML(profile.activeBadge)}</span>` : ""}

        <p class="profile-bio">${escapeHTML(profile.bio || "Hali biografiya qo‘shilmagan.")}</p>

        <div class="profile-meta">
          ${profile.birthdatePublic && profile.age !== null && profile.age !== undefined ? `<span>${icon("calendar")} ${profile.age} yosh</span>` : ""}
          <span>${icon("calendar-days")} ${escapeHTML(formatDate((profile.createdAt || "").slice(0, 10)))}</span>
          <span>${icon("check-circle")} ${completedTasks} ta vazifa</span>
        </div>

        <div class="profile-actions">
          <button class="primary-button" type="button" data-action="edit-profile">${icon("pencil", 15)} Profilni tahrirlash</button>
          <button class="secondary-button" type="button" data-action="share-profile">${icon("share-2", 15)} Profilni ulashish</button>
        </div>
      </section>

      <div class="dashboard-grid">
        <section class="level-card">
          <span class="section-label">SIZNING DARAJANGIZ</span>
          <div class="level-number">Level ${rank.level}</div>
          <div class="level-title">${escapeHTML(rank.name)}</div>
          <p class="level-description">
            Mukammal bo‘lish shart emas. Muhimi, har kuni oldinga yurish.
          </p>

          <div class="progress-track" style="margin-top:17px">
            <div class="progress-fill" style="width:${rank.progress}%"></div>
          </div>

          <div class="goal-footer">
            <span>${formatNumber(totalEarnedXP)} XP</span>
            <span>${rank.next ? `${formatNumber(rank.next.xp)} XP` : "MAX"}</span>
          </div>
        </section>

        <section class="card">
          <h3 class="card-title">Profil statistikasi</h3>
          <div class="setting-row">
            <div class="setting-info"><strong>Jami XP</strong></div>
            <strong>${formatNumber(data.xp)}</strong>
          </div>
          <div class="setting-row">
            <div class="setting-info"><strong>Jami ishlab topilgan XP</strong><small>Do‘konda sarflangan XP ham qo‘shilgan</small></div>
            <strong>${formatNumber(Number(data.xp||0)+Number(data.spentXP||0))}</strong>
          </div>
          <div class="setting-row">
            <div class="setting-info"><strong>Sarflangan XP</strong></div>
            <strong>${formatNumber(data.spentXP||0)}</strong>
          </div>
          <div class="setting-row">
            <div class="setting-info"><strong>Bajarilgan vazifalar</strong></div>
            <strong>${completedTasks}</strong>
          </div>
          <div class="setting-row">
            <div class="setting-info"><strong>Yutuqlar</strong></div>
            <strong>${data.achievements.length}</strong>
          </div>
          <div class="setting-row">
            <div class="setting-info"><strong>Profil bezagi</strong><small>Fon, avatar ramkasi va maxsus belgi</small></div>
            <strong>${customizationScore} / 3</strong>
          </div>
        </section>
      </div>

      <section class="card" style="margin-top:20px">
        <div class="card-header">
          <h3 class="card-title">Olingan badge’lar</h3>
          <button class="card-action" type="button" data-page="achievements">Barcha yutuqlar</button>
        </div>
        <div class="badge-grid">
          ${data.achievements.length
            ? data.achievements.map(id => {
                const achievement = ACHIEVEMENTS.find(item => item.id === id);
                return achievement ? `
                  <div class="achievement-card">
                    <div class="achievement-icon">${icon(achievement.icon, 22)}</div>
                    <strong>${escapeHTML(achievement.name)}</strong>
                  </div>
                ` : "";
              }).join("")
            : emptyState("Hali badge yo‘q", "Vazifalarni bajaring va yutuqlarni oching.", "award")}
        </div>
      </section>
    `;
  }

  /* -------------------- SETTINGS PAGE -------------------- */

  function renderSettings() {
    const age = data.profile.age;
    const difficulty = getDifficulty();

    return `
      ${pageHeader(
        "SHAXSIY MOSLAMALAR",
        "Sozlamalar",
        "SmartGoal’ni o‘zingizga moslang."
      )}

      <div class="settings-layout">
        <nav class="settings-nav" aria-label="Sozlamalar bo‘limlari">
          <button type="button" class="${currentSettingsTab === "general" ? "active" : ""}" data-settings-tab="general">${icon("sliders-horizontal")} Umumiy</button>
          <button type="button" class="${currentSettingsTab === "appearance" ? "active" : ""}" data-settings-tab="appearance">${icon("palette")} Ko‘rinish</button>
          <button type="button" class="${currentSettingsTab === "difficulty" ? "active" : ""}" data-settings-tab="difficulty">${icon("brain")} Murakkablik</button>
          <button type="button" class="${currentSettingsTab === "sound" ? "active" : ""}" data-settings-tab="sound">${icon("volume-2")} Ovoz</button>
          <button type="button" class="${currentSettingsTab === "data" ? "active" : ""}" data-settings-tab="data">${icon("database")} Ma’lumotlar</button>
        </nav>

        <div class="settings-panel">
          ${renderSettingsPanel(age, difficulty)}
        </div>
      </div>
    `;
  }

  function renderSettingsPanel(age, difficulty) {
    if (currentSettingsTab === "appearance") {
      return `
        <div class="settings-section">
          <h3>Interfeys ko‘rinishi</h3>
          <p>O‘zingizga qulay rang va mavzuni tanlang.</p>

          <div class="setting-row">
            <div class="setting-info"><strong>Kun / tun rejimi</strong><small>Interfeys ranglarini o‘zgartirish</small></div>
            <select class="field-select" style="max-width:150px" data-setting="theme">
              <option value="light" ${settings.theme === "light" ? "selected" : ""}>Yorug‘</option>
              <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Qorong‘i</option>
              <option value="system" ${settings.theme === "system" ? "selected" : ""}>Qurilma bo‘yicha</option>
            </select>
          </div>
          <div class="setting-row">
            <div class="setting-info"><strong>Matn o‘lchami</strong><small>O‘qish uchun qulay hajmni tanlang.</small></div>
            <select class="field-select" style="max-width:150px" data-setting="fontSize">
              <option value="small" ${settings.fontSize==="small"?"selected":""}>Kichik</option>
              <option value="medium" ${!settings.fontSize||settings.fontSize==="medium"?"selected":""}>O‘rtacha</option>
              <option value="large" ${settings.fontSize==="large"?"selected":""}>Katta</option>
            </select>
          </div>

          <div class="settings-section">
            <h3>Rang mavzusi</h3>
            <p>Ba’zi ranglar do‘kondan ochko evaziga olinadi.</p>
            <div class="theme-options">
              ${["violet", "ocean", "sky", "emerald", "sunset", "rose"].map(theme => {
                const free = theme === "violet";
                const owned = data.inventory.some(item => item.id === `theme-${theme}`);
                const available = free || owned;
                return `
                  <button type="button"
                    class="theme-option ${settings.colorTheme === theme ? "active" : ""}"
                    data-color-theme="${theme}"
                    data-action="${available ? "set-theme" : "locked-theme"}"
                    title="${theme}${available ? "" : " — do‘kondan xarid qiling"}">
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      `;
    }

    if (currentSettingsTab === "difficulty") {
      return `
        <div class="settings-section">
          <h3>Interfeys murakkabligi</h3>
          <p>Matnlar, tushuntirishlar va interfeysning murakkabligini o‘zingizga moslang.</p>

          <div class="setting-row">
            <div class="setting-info">
              <strong>Avtomatik tanlash</strong>
              <small>${age === null ? "Yosh aniqlanmagan" : `Tug‘ilgan sanangiz bo‘yicha yosh: ${age}`}</small>
            </div>
            <input type="radio" name="difficulty" value="auto" ${settings.difficulty === "auto" ? "checked" : ""}>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Kichik yoshdagilar uchun</strong><small>Sodda matnlar va tushunarli interfeys.</small></div>
            <input type="radio" name="difficulty" value="junior" ${settings.difficulty === "junior" ? "checked" : ""}>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Yuqori sinf va o‘smirlar uchun</strong><small>Muvozanatli, batafsilroq interfeys.</small></div>
            <input type="radio" name="difficulty" value="senior" ${settings.difficulty === "senior" ? "checked" : ""}>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Kattalar uchun</strong><small>Professional va batafsil interfeys.</small></div>
            <input type="radio" name="difficulty" value="adult" ${settings.difficulty === "adult" ? "checked" : ""}>
          </div>

          <p style="margin-top:15px">Hozirgi tanlov: <strong>${escapeHTML(difficulty)}</strong></p>
        </div>
      `;
    }

    if (currentSettingsTab === "sound") {
      return `
        <div class="settings-section">
          <h3>Ovoz va animatsiyalar</h3>
          <p>Bildirish va harakatlarni o‘zingizga moslang.</p>

          <div class="setting-row">
            <div class="setting-info"><strong>Ovoz effektlari</strong><small>Vazifa bajarilganda qisqa ovoz.</small></div>
            <button class="toggle ${settings.sound ? "active" : ""}" type="button" data-action="toggle-sound" aria-label="Ovoz sozlamasi"></button>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Kamaytirilgan animatsiya</strong><small>Harakatlar sonini kamaytirish.</small></div>
            <button class="toggle ${settings.reducedMotion ? "active" : ""}" type="button" data-action="toggle-motion" aria-label="Animatsiya sozlamasi"></button>
          </div>
        </div>
      `;
    }

    if (currentSettingsTab === "data") {
      return `
        <div class="settings-section">
          <h3>Ma’lumotlaringiz</h3>
          <p>Ma’lumotlarni zaxiralash yoki qayta tiklash.</p>

          <div class="setting-row">
            <div class="setting-info"><strong>Ma’lumotlarni eksport qilish</strong><small>Profil, vazifalar va maqsadlarni JSON faylga saqlash.</small></div>
            <button class="secondary-button" type="button" data-action="export-data">${icon("download")} Eksport</button>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Zaxira nusxasini tiklash</strong><small>Oldin saqlangan SmartGoal faylini yuklash.</small></div>
            <button class="secondary-button" type="button" data-action="import-data">${icon("upload")} Import</button>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Ma’lumotlarni tozalash</strong><small>Mahalliy demo ma’lumotlarini o‘chirish.</small></div>
            <button class="secondary-button" type="button" data-action="reset-data">${icon("trash-2")} Tozalash</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="settings-section">
        <h3>Umumiy sozlamalar</h3>
        <p>Til va shaxsiy ma’lumotlar.</p>

        <div class="setting-row">
          <div class="setting-info"><strong>Interfeys tili</strong><small>SmartGoal tilini tanlang.</small></div>
          <select class="field-select" style="max-width:150px" data-setting="language">
            <option value="uz" ${settings.language === "uz" ? "selected" : ""}>O‘zbekcha</option>
            <option value="ru" ${settings.language === "ru" ? "selected" : ""}>Русский</option>
            <option value="en" ${settings.language === "en" ? "selected" : ""}>English</option>
          </select>
        </div>

        <div class="setting-row">
          <div class="setting-info"><strong>Ism va familiya</strong><small>${escapeHTML(data.profile.name)}</small></div>
          <button class="secondary-button" type="button" data-action="edit-profile">Tahrirlash</button>
        </div>

        <div class="setting-row">
          <div class="setting-info"><strong>Username</strong><small>@${escapeHTML(data.profile.username || "username")}</small></div>
          <button class="secondary-button" type="button" data-action="edit-profile">Tahrirlash</button>
        </div>

        <div class="setting-row">
          <div class="setting-info"><strong>Tug‘ilgan sana</strong><small>${data.profile.birthdate ? escapeHTML(formatDate(data.profile.birthdate)) : "Kiritilmagan"}</small></div>
          <button class="secondary-button" type="button" data-action="edit-birthdate">O‘zgartirish</button>
        </div>
      </div>
    `;
  }

  function openBirthdateEditor() {
    openModal(
      "Tug‘ilgan sanani o‘zgartirish",
      `
        <form id="birthdate-form">
          <label class="field-label" for="new-birthdate">Tug‘ilgan sana</label>
          <input class="field-input" id="new-birthdate" name="birthdate"
            type="date" max="${today()}" required
            value="${escapeHTML(data.profile.birthdate || "")}">
        </form>
      `,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="submit" form="birthdate-form">Saqlash</button>
      `
    );
  }

  /* -------------------- DATA EXPORT / IMPORT -------------------- */

  function exportData() {
    const backup = {
      exportedAt: new Date().toISOString(),
      data,
      settings
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `smartgoal-backup-${today()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showToast("Zaxira fayli tayyorlandi.");
  }

  function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        showToast("Fayl hajmi 5 MB dan oshmasligi kerak.", "error");
        return;
      }

      try {
        const backup = safeJSON(await file.text(), null);
        const imported = backup?.data || backup;

        if (!imported || !Array.isArray(imported.tasks) || !Array.isArray(imported.goals)) {
          throw new Error("Invalid backup");
        }

        data = {
          ...createInitialData(),
          ...imported,
          profile: { ...createInitialData().profile, ...(imported.profile || {}) }
        };

        if (backup.settings) {
          settings = { ...DEFAULT_SETTINGS, ...backup.settings };
          saveSettings();
        }

        saveData();
        updateProfileDisplay();
        render();
        showToast("Ma’lumotlar tiklandi.");
      } catch {
        showToast("Bu SmartGoal zaxira fayli emas yoki buzilgan.", "error");
      }
    });

    input.click();
  }

  function resetData() {
    openModal(
      "Ma’lumotlarni tozalash",
      "<p>Barcha mahalliy ma’lumotlar, XP, vazifalar va maqsadlar o‘chiriladi. Bu amalni ortga qaytarib bo‘lmaydi.</p>",
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="button" data-action="confirm-reset">Barchasini o‘chirish</button>
      `
    );
  }

  /* -------------------- SEARCH -------------------- */

  function toggleSearch(show) {
    const search = $("#global-search");
    if (!search) return;

    search.classList.toggle("hidden", show === false ? true : !search.classList.contains("hidden"));

    if (!search.classList.contains("hidden")) {
      $("#global-search-input")?.focus();
    }
  }

  function runGlobalSearch(value) {
    const query = String(value || "").trim().toLowerCase();
    if (!query) return;

    const task = data.tasks.find(item => item.title.toLowerCase().includes(query));
    if (task) {
      navigate("schedule");
      showToast(`Vazifa topildi: ${task.title}`);
      return;
    }

    const goal = data.goals.find(item => item.title.toLowerCase().includes(query));
    if (goal) {
      navigate("goals");
      showToast(`Maqsad topildi: ${goal.title}`);
      return;
    }

    navigate("community");
    const communityInput = $("#community-search");
    if (communityInput) {
      communityInput.value = value;
      communityInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  /* -------------------- NAVIGATION -------------------- */

  const UI_TRANSLATIONS = {
    ru: {
      "Bosh sahifa":"Главная","Maqsadlarim":"Мои цели","Vazifalar":"Задачи","Rejalashtiruvchi":"Планировщик","Statistika":"Статистика","Yutuqlarim":"Мои достижения","Mukofotlar do‘koni":"Магазин наград","Hamjamiyat":"Сообщество","Smart AI":"Smart AI","Bildirishnomalar":"Уведомления","Sozlamalar":"Настройки","Mening profilim":"Мой профиль",
      "Maqsad qo‘shish":"Добавить цель","Yangi maqsad":"Новая цель","Vazifa qo‘shish":"Добавить задачу","Yangi vazifa":"Новая задача","Saqlash":"Сохранить","Bekor qilish":"Отмена","O‘chirish":"Удалить","Tahrirlash":"Изменить","Bugungi vazifalar":"Задачи на сегодня","Barcha vazifalar":"Все задачи","Maqsadlar":"Цели","Faol maqsadlar":"Активные цели","Yakunlangan":"Завершено","O‘rtacha progress":"Средний прогресс","Jami XP":"Всего XP","Bu haftadagi XP":"XP за неделю","Bajarilgan vazifalar":"Выполненные задачи","Bajarilish foizi":"Процент выполнения","Kun tartibim":"Мой распорядок дня","Band qo‘shish":"Добавить пункт","Menga kun tartibi tuz":"Составить распорядок","Vaqtida eslatib tur":"Напоминать вовремя","Yutuq qo‘shish":"Добавить достижение","Shaxsiy xotiralar":"Личные воспоминания","Xarid":"Купить","Qo‘llash":"Применить","XP yetarli emas":"Недостаточно XP","Yorug‘":"Светлая","Qorong‘i":"Тёмная","Qurilma bo‘yicha":"Как на устройстве","Umumiy sozlamalar":"Общие настройки","Interfeys tili":"Язык интерфейса","Profilni tahrirlash":"Редактировать профиль","Username":"Имя пользователя","Tug‘ilgan sana":"Дата рождения","Qisqa mazmuni":"Краткое описание","Vazifa nomi":"Название задачи","Qaysi kuni bajariladi?":"Когда выполнить?","Vaqt":"Время","Nima qilasiz?":"Что будете делать?","Do‘st bo‘lish":"Добавить в друзья","Do‘stlar":"Друзья","Foydalanuvchilar":"Пользователи","Qidirilmoqda...":"Поиск...","Foydalanuvchi topilmadi":"Пользователь не найден","Kunlik reja":"План на день","AI reja tuzsin":"Пусть AI составит план","Maqsadlar asosida tavsiyalar":"Рекомендации по целям","Shaxsiy yordamchi":"Личный помощник","AI bilan suhbat":"Чат с AI","Profil statistikasi":"Статистика профиля","Sizning darajangiz":"Ваш уровень","Kolleksiyangiz hozircha bo‘sh":"Коллекция пока пуста"
    },
    en: {
      "Bosh sahifa":"Home","Maqsadlarim":"My goals","Vazifalar":"Tasks","Rejalashtiruvchi":"Planner","Statistika":"Statistics","Yutuqlarim":"My achievements","Mukofotlar do‘koni":"Rewards shop","Hamjamiyat":"Community","Smart AI":"Smart AI","Bildirishnomalar":"Notifications","Sozlamalar":"Settings","Mening profilim":"My profile",
      "Maqsad qo‘shish":"Add goal","Yangi maqsad":"New goal","Vazifa qo‘shish":"Add task","Yangi vazifa":"New task","Saqlash":"Save","Bekor qilish":"Cancel","O‘chirish":"Delete","Tahrirlash":"Edit","Bugungi vazifalar":"Today's tasks","Barcha vazifalar":"All tasks","Maqsadlar":"Goals","Faol maqsadlar":"Active goals","Yakunlangan":"Completed","O‘rtacha progress":"Average progress","Jami XP":"Total XP","Bu haftadagi XP":"XP this week","Bajarilgan vazifalar":"Completed tasks","Bajarilish foizi":"Completion rate","Kun tartibim":"My daily routine","Band qo‘shish":"Add item","Menga kun tartibi tuz":"Build my routine","Vaqtida eslatib tur":"Remind me on time","Yutuq qo‘shish":"Add achievement","Shaxsiy xotiralar":"Personal memories","Xarid":"Buy","Qo‘llash":"Apply","XP yetarli emas":"Not enough XP","Yorug‘":"Light","Qorong‘i":"Dark","Qurilma bo‘yicha":"System default","Umumiy sozlamalar":"General settings","Interfeys tili":"Interface language","Profilni tahrirlash":"Edit profile","Username":"Username","Tug‘ilgan sana":"Birthday","Qisqa mazmuni":"Short description","Vazifa nomi":"Task title","Qaysi kuni bajariladi?":"Due date","Vaqt":"Time","Nima qilasiz?":"What will you do?","Do‘st bo‘lish":"Add friend","Do‘stlar":"Friends","Foydalanuvchilar":"Users","Qidirilmoqda...":"Searching...","Foydalanuvchi topilmadi":"User not found","Kunlik reja":"Daily plan","AI reja tuzsin":"Generate AI plan","Maqsadlar asosida tavsiyalar":"Goal-based suggestions","Shaxsiy yordamchi":"Personal assistant","AI bilan suhbat":"Chat with AI","Profil statistikasi":"Profile statistics","Sizning darajangiz":"Your level","Kolleksiyangiz hozircha bo‘sh":"Your collection is empty"
    }
  };

  Object.assign(UI_TRANSLATIONS.ru, {
    "Bugun nimaga erishamiz?":"Чего достигнем сегодня?","Kichik qadamlar katta natijalarga olib boradi.":"Маленькие шаги приводят к большим результатам.","Rivojlanishingizni boshqarishni davom ettiring":"Продолжайте управлять своим развитием","Ustuvor vazifalarni belgilang, jarayonni kuzating va natijaga erishing.":"Определяйте приоритеты, следите за процессом и достигайте результата.","Buguncha vazifalar yo‘q":"На сегодня задач нет","Maqsadlar hali yo‘q":"Пока нет целей","Faollik grafigi":"График активности","So‘nggi 7 kun ichidagi to‘plangan XP":"XP за последние 7 дней","Batafsil":"Подробнее","Qo‘shish":"Добавить","Hozirgi rivojlanish jarayoni":"Текущий прогресс","Darajamni ko‘rish":"Посмотреть мой уровень","Umumiy natijalar":"Общие результаты","Xaridlar":"Покупки","Yaratilgan maqsadlar soni":"Количество созданных целей","Sertifikatlar, muhim kunlar va esdaliklar.":"Сертификаты, важные дни и воспоминания.","Sizning kolleksiyangiz":"Ваша коллекция","Umumiy":"Общие","Ko‘rinish":"Внешний вид","Murakkablik":"Сложность","Ovoz":"Звук","Ma’lumotlar":"Данные","Matn o‘lchami":"Размер текста","Kichik":"Маленький","O‘rtacha":"Средний","Katta":"Большой","Yangi yutuq yoki xotira":"Новое достижение или воспоминание","Sarlavha":"Заголовок","Tavsif":"Описание","Turi":"Тип","Sana":"Дата","Shaxsiy xotira":"Личное воспоминание","Sertifikat":"Сертификат","Muhim natija":"Важный результат","Profilni ulashish":"Поделиться профилем","Yutuq rasmi (ixtiyoriy)":"Фото достижения (необязательно)","Tug‘ilgan kunim va yoshim profilimda hammaga ko‘rinsin":"Показывать мой день рождения и возраст в профиле","AI bilan maslahatlashish":"Обсудить с AI"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Bugun nimaga erishamiz?":"What will we achieve today?","Kichik qadamlar katta natijalarga olib boradi.":"Small steps lead to big results.","Rivojlanishingizni boshqarishni davom ettiring":"Keep managing your growth","Ustuvor vazifalarni belgilang, jarayonni kuzating va natijaga erishing.":"Set priorities, track your progress and reach your goals.","Buguncha vazifalar yo‘q":"No tasks for today","Maqsadlar hali yo‘q":"No goals yet","Faollik grafigi":"Activity chart","So‘nggi 7 kun ichidagi to‘plangan XP":"XP earned over the last 7 days","Batafsil":"Details","Qo‘shish":"Add","Hozirgi rivojlanish jarayoni":"Current progress","Darajamni ko‘rish":"View my level","Umumiy natijalar":"Overall results","Xaridlar":"Purchases","Yaratilgan maqsadlar soni":"Number of goals created","Sertifikatlar, muhim kunlar va esdaliklar.":"Certificates, important days and memories.","Sizning kolleksiyangiz":"Your collection","Umumiy":"General","Ko‘rinish":"Appearance","Murakkablik":"Difficulty","Ovoz":"Sound","Ma’lumotlar":"Data","Matn o‘lchami":"Text size","Kichik":"Small","O‘rtacha":"Medium","Katta":"Large","Yangi yutuq yoki xotira":"New achievement or memory","Sarlavha":"Title","Tavsif":"Description","Turi":"Type","Sana":"Date","Shaxsiy xotira":"Personal memory","Sertifikat":"Certificate","Muhim natija":"Milestone","Profilni ulashish":"Share profile","Yutuq rasmi (ixtiyoriy)":"Achievement photo (optional)","Tug‘ilgan kunim va yoshim profilimda hammaga ko‘rinsin":"Show my birthday and age on my profile","AI bilan maslahatlashish":"Ask AI"
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "REJALARINGIZ":"ВАШИ ПЛАНЫ","Katta natijalarga kichik qadamlar orqali erishing.":"Достигайте больших результатов маленькими шагами.","Jami maqsadlar":"Всего целей","O‘rtacha progress":"Средний прогресс","Maqsad tavsifi kiritilmagan":"Описание цели не добавлено","Muddat belgilanmagan":"Срок не указан","Vazifalarni shu maqsadga bog‘lab, rivojlanishni kuzating.":"Свяжите задачи с этой целью и отслеживайте прогресс.","Yana":"Осталось","kun":"дней","KUNLIK REJA":"ПЛАН НА ДЕНЬ","Vazifalaringizni tartibga soling va bajarilganlarini belgilang.":"Упорядочивайте задачи и отмечайте выполненные.","Vazifalar mavjud emas":"Задач пока нет","Yangi vazifa qo‘shib rejangizni boshlang.":"Добавьте первую задачу, чтобы начать планирование.","VAQTNI BOSHQARISH":"УПРАВЛЕНИЕ ВРЕМЕНЕМ","Kunlik rejangiz, odatlaringiz va maqsadlaringizni bir joyda boshqaring.":"Управляйте распорядком, привычками и целями в одном месте.","SIZNING SHAXSIY REJANGIZ":"ВАШ ЛИЧНЫЙ ПЛАН","Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.":"Назначьте время каждому делу. AI поможет составить план.","AI bilan kun tartibini tuzish":"Составить распорядок с AI","Uyg‘onish vaqtingiz, o‘qish/ish jadvalingiz va odatlaringizni yozing.":"Укажите время пробуждения, учёбы/работы и привычки.","Bugungi vazifalar":"Задачи на сегодня","Maqsadlar asosida tavsiyalar":"Рекомендации по целям","AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.":"AI проанализирует ваши цели и задачи и составит практичный план.","NATIJALARINGIZ":"ВАШИ РЕЗУЛЬТАТЫ","Faolligingiz va rivojlanishingizni tahlil qiling.":"Анализируйте активность и прогресс.","Haftalik faollik":"Активность за неделю","Har kuni to‘plangan XP":"XP за каждый день","Maqsadlar sari bosib o‘tilgan yo‘l":"Путь к вашим целям","Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.":"Выполненные задачи и оставшиеся шаги для каждой цели.","Yutuqlarim":"Мои достижения","Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.":"Сохраняйте важные дни, сертификаты и личные достижения.","SmartGoal yutuqlari":"Достижения SmartGoal","ta ochilgan":"открыто","Hali ochilmagan":"Пока не открыто","Xotiralar hali yo‘q":"Воспоминаний пока нет","Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.":"Сохраните первое достижение или памятный день.","MAXSUS IMKONIYATLAR":"ОСОБЫЕ ВОЗМОЖНОСТИ","XP bilan profilingiz va SmartGoal ko‘rinishini o‘zingizga moslang.":"Настройте профиль и SmartGoal за XP.","SIZNING BALANSINGIZ":"ВАШ БАЛАНС","Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.":"Каждое настоящее достижение открывает новые возможности.","Barchasi":"Все","Mavzular":"Темы","Profil fonlari":"Фоны профиля","Belgilar":"Значки","Avatar ramkalari":"Рамки аватара","Do‘kondan birinchi mahsulotingizni xarid qiling.":"Купите первый предмет в магазине.","HAMJAMIYAT":"СООБЩЕСТВО","Username orqali boshqa foydalanuvchilarni toping.":"Находите других пользователей по имени пользователя.","Username bo‘yicha qidirish":"Поиск по имени пользователя","Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.":"Введите не менее 3 символов. Показываются пользователи, чьи имена начинаются с введённых символов.","Do‘stlik so‘rovlari":"Запросы в друзья","Yangilash":"Обновить","Kelgan so‘rovlar":"Входящие запросы","Yuborilgan so‘rovlar":"Отправленные запросы","Do‘stlaringiz":"Ваши друзья","Qidiruvga tayyor":"Готово к поиску","Username kiriting.":"Введите имя пользователя.","Foydalanuvchi topilmadi":"Пользователь не найден","SHAXSIY YORDAMCHI":"ЛИЧНЫЙ ПОМОЩНИК","Har kuni yaxshiroq natija sari.":"К лучшим результатам каждый день.","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.":"Ответы на вопросы, чёткие планы и полезные советы для ваших целей.","AI siz yozgan tilda javob beradi.":"AI отвечает на языке вашего сообщения.","Suhbatni tozalash":"Очистить чат","Bugungi rejam":"Мой план на сегодня","Motivatsiya":"Мотивация","Umumiy sozlamalar":"Общие настройки","SmartGoal’ni o‘zingizga moslang.":"Настройте SmartGoal под себя.","Interfeys ko‘rinishi":"Внешний вид интерфейса","O‘zingizga qulay rang va mavzuni tanlang.":"Выберите удобные цвета и тему.","Rang mavzusi":"Цветовая тема","Ba’zi ranglar do‘kondan ochko evaziga olinadi.":"Некоторые цвета доступны за XP в магазине.","Interfeys murakkabligi":"Сложность интерфейса","Matnlar, tushuntirishlar va interfeysning murakkabligini o‘zingizga moslang.":"Настройте сложность текста, объяснений и интерфейса.","Avtomatik tanlash":"Автоматический выбор","Kichik yoshdagilar uchun":"Для младшего возраста","Yuqori sinf va o‘smirlar uchun":"Для старших школьников и подростков","Profilni muvaffaqiyatli yangilandi.":"Профиль успешно обновлён.","Tug‘ilgan sana yangilandi.":"Дата рождения обновлена.","Maqsad saqlandi.":"Цель сохранена.","Vazifa saqlandi.":"Задача сохранена.","Kun tartibi saqlandi.":"Распорядок сохранён.","Yutuq qo‘shish":"Добавить достижение","Qisqa mazmuni":"Краткое содержание","Qaysi kuni bajariladi?":"На какой день запланировано?","Savolingizni yozing...":"Напишите свой вопрос...","Savolingizni yozing":"Напишите свой вопрос"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "REJALARINGIZ":"YOUR PLANS","Katta natijalarga kichik qadamlar orqali erishing.":"Reach big results through small steps.","Jami maqsadlar":"Total goals","O‘rtacha progress":"Average progress","Maqsad tavsifi kiritilmagan":"No goal description added","Muddat belgilanmagan":"No deadline set","Vazifalarni shu maqsadga bog‘lab, rivojlanishni kuzating.":"Link tasks to this goal to track progress.","Yana":"Remaining","kun":"days","KUNLIK REJA":"DAILY PLAN","Vazifalaringizni tartibga soling va bajarilganlarini belgilang.":"Organize your tasks and mark completed ones.","Vazifalar mavjud emas":"No tasks yet","Yangi vazifa qo‘shib rejangizni boshlang.":"Add a task to start planning.","VAQTNI BOSHQARISH":"TIME MANAGEMENT","Kunlik rejangiz, odatlaringiz va maqsadlaringizni bir joyda boshqaring.":"Manage your daily routine, habits and goals in one place.","SIZNING SHAXSIY REJANGIZ":"YOUR PERSONAL ROUTINE","Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.":"Set a time for each activity. AI can help build your schedule.","AI bilan kun tartibini tuzish":"Build a routine with AI","Uyg‘onish vaqtingiz, o‘qish/ish jadvalingiz va odatlaringizni yozing.":"Enter your wake-up time, school/work schedule and habits.","Bugungi vazifalar":"Today's tasks","Maqsadlar asosida tavsiyalar":"Goal-based suggestions","AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.":"AI analyzes your goals and tasks to create a practical plan.","NATIJALARINGIZ":"YOUR RESULTS","Faolligingiz va rivojlanishingizni tahlil qiling.":"Analyze your activity and progress.","Haftalik faollik":"Weekly activity","Har kuni to‘plangan XP":"XP earned each day","Maqsadlar sari bosib o‘tilgan yo‘l":"Progress toward your goals","Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.":"Completed work and remaining steps for each goal.","Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.":"Save important days, certificates and personal achievements.","SmartGoal yutuqlari":"SmartGoal achievements","ta ochilgan":"unlocked","Hali ochilmagan":"Not unlocked yet","Xotiralar hali yo‘q":"No memories yet","Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.":"Save your first achievement or memorable day.","MAXSUS IMKONIYATLAR":"SPECIAL FEATURES","XP bilan profilingiz va SmartGoal ko‘rinishini o‘zingizga moslang.":"Customize your profile and SmartGoal with XP.","SIZNING BALANSINGIZ":"YOUR BALANCE","Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.":"Every real achievement unlocks new possibilities.","Barchasi":"All","Mavzular":"Themes","Profil fonlari":"Profile backgrounds","Belgilar":"Badges","Avatar ramkalari":"Avatar frames","Do‘kondan birinchi mahsulotingizni xarid qiling.":"Purchase your first item from the shop.","HAMJAMIYAT":"COMMUNITY","Username orqali boshqa foydalanuvchilarni toping.":"Find other users by username.","Username bo‘yicha qidirish":"Search by username","Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.":"Enter at least 3 characters. Users whose usernames start with your search will appear.","Do‘stlik so‘rovlari":"Friend requests","Yangilash":"Refresh","Kelgan so‘rovlar":"Incoming requests","Yuborilgan so‘rovlar":"Sent requests","Do‘stlaringiz":"Your friends","Qidiruvga tayyor":"Ready to search","Username kiriting.":"Enter a username.","Foydalanuvchi topilmadi":"User not found","SHAXSIY YORDAMCHI":"PERSONAL ASSISTANT","Har kuni yaxshiroq natija sari.":"Toward better results every day.","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.":"Answers to your questions, clear plans and useful advice for your goals.","AI siz yozgan tilda javob beradi.":"AI replies in the language you write in.","Suhbatni tozalash":"Clear chat","Bugungi rejam":"My plan for today","Motivatsiya":"Motivation","Umumiy sozlamalar":"General settings","SmartGoal’ni o‘zingizga moslang.":"Make SmartGoal yours.","Interfeys ko‘rinishi":"Interface appearance","O‘zingizga qulay rang va mavzuni tanlang.":"Choose colors and a theme that work for you.","Rang mavzusi":"Color theme","Ba’zi ranglar do‘kondan ochko evaziga olinadi.":"Some colors can be unlocked with XP in the shop.","Interfeys murakkabligi":"Interface complexity","Matnlar, tushuntirishlar va interfeysning murakkabligini o‘zingizga moslang.":"Adjust text, explanations and interface complexity.","Avtomatik tanlash":"Automatic selection","Kichik yoshdagilar uchun":"For younger users","Yuqori sinf va o‘smirlar uchun":"For older students and teens","Tug‘ilgan sana yangilandi.":"Birthday updated.","Maqsad saqlandi.":"Goal saved.","Vazifa saqlandi.":"Task saved.","Kun tartibi saqlandi.":"Daily routine saved.","Qisqa mazmuni":"Short summary","Qaysi kuni bajariladi?":"Which day should it be done?","Savolingizni yozing...":"Type your question..."
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Ocean mavzusi":"Тема Ocean","Emerald mavzusi":"Тема Emerald","Sunset mavzusi":"Тема Sunset","Rose mavzusi":"Тема Rose","Sky mavzusi":"Тема Sky","Midnight fon":"Фон Midnight","Galaxy fon":"Фон Galaxy","Royal fon":"Фон Royal","Sakura profil foni":"Фон профиля Sakura","Nebula profil foni":"Фон профиля Nebula","Focus badge":"Значок Focus","Diamond badge":"Значок Diamond","Builder belgisi":"Значок Builder","Oltin avatar ramkasi":"Золотая рамка аватара","Premium avatar ramkasi":"Премиальная рамка аватара","Profilingiz va interfeysingiz uchun sokin ko‘k rang.":"Спокойный синий цвет для профиля и интерфейса.","Yashil va nafis ko‘rinish.":"Элегантная зелёная тема.","Iliq ranglardagi maxsus interfeys.":"Особая тёплая цветовая тема.","Nafis pushti ranglar uyg‘unligi.":"Нежная розовая цветовая гамма.","Profil uchun qoramtir, maxsus fon.":"Особый тёмный фон профиля.","Maxsus kosmik profil foni.":"Космический фон профиля.","Noyob premium profil dizayni.":"Уникальный премиальный дизайн профиля.","Diqqat va intizom ramzi.":"Символ концентрации и дисциплины.","Maxsus premium belgi.":"Особый премиальный значок.","Profil rasmingiz uchun oltin bezak.":"Золотое оформление фотографии профиля.","Profil rasmingiz uchun maxsus ramka.":"Особая рамка для фотографии профиля.","Yashil va nafis ko‘rinish.":"Элегантная зелёная тема.","Sokin moviy ranglar.":"Спокойные голубые оттенки.","Qo‘lga kiritilgan":"Получено","Hali ochilmagan":"Ещё не открыто","Oddiy":"Обычный","Muhim":"Важное","Juda muhim":"Очень важно","Past":"Низкий","O‘rta":"Средний","Yuqori":"Высокий","Bajarish sanasi":"Дата выполнения","Taxminiy bajarish vaqti":"Примерное время выполнения","Qo‘shimcha sozlama (ixtiyoriy)":"Дополнительные настройки (необязательно)"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Ocean mavzusi":"Ocean theme","Emerald mavzusi":"Emerald theme","Sunset mavzusi":"Sunset theme","Rose mavzusi":"Rose theme","Sky mavzusi":"Sky theme","Midnight fon":"Midnight background","Galaxy fon":"Galaxy background","Royal fon":"Royal background","Sakura profil foni":"Sakura profile background","Nebula profil foni":"Nebula profile background","Focus badge":"Focus badge","Diamond badge":"Diamond badge","Builder belgisi":"Builder badge","Oltin avatar ramkasi":"Gold avatar frame","Premium avatar ramkasi":"Premium avatar frame","Profilingiz va interfeysingiz uchun sokin ko‘k rang.":"A calm blue look for your profile and interface.","Yashil va nafis ko‘rinish.":"An elegant green theme.","Iliq ranglardagi maxsus interfeys.":"A special warm-colored interface.","Nafis pushti ranglar uyg‘unligi.":"An elegant blend of pink tones.","Profil uchun qoramtir, maxsus fon.":"A special dark profile background.","Maxsus kosmik profil foni.":"A special cosmic profile background.","Noyob premium profil dizayni.":"A unique premium profile design.","Diqqat va intizom ramzi.":"A symbol of focus and discipline.","Maxsus premium belgi.":"A special premium badge.","Profil rasmingiz uchun oltin bezak.":"A gold decoration for your profile photo.","Profil rasmingiz uchun maxsus ramka.":"A special frame for your profile photo.","Qo‘lga kiritilgan":"Unlocked","Hali ochilmagan":"Not unlocked yet","Oddiy":"Normal","Muhim":"Important","Juda muhim":"Very important","Past":"Low","O‘rta":"Medium","Yuqori":"High","Bajarish sanasi":"Due date","Taxminiy bajarish vaqti":"Estimated time","Qo‘shimcha sozlama (ixtiyoriy)":"Additional settings (optional)"
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Taxminiy bajarish vaqti":"Примерная длительность",
    "15 daqiqa":"15 минут","30 daqiqa":"30 минут","45 daqiqa":"45 минут","1 soat":"1 час","1,5 soat":"1,5 часа","2 soat":"2 часа","3 soat":"3 часа","4 soat":"4 часа","6 soat":"6 часов",
    "Ustuvorlik":"Приоритет","AI’dan shaxsiy maslahat":"Персональный совет от AI","AI tavsiyasi":"Совет AI","AI bilan suhbat":"Чат с AI",
    "Kun tartibim":"Мой распорядок дня","Menga kun tartibi tuz":"Составить мой распорядок","Band qo‘shish":"Добавить пункт распорядка",
    "Profilni tahrirlash":"Редактировать профиль","Biografiya":"Биография","O‘zingiz haqingizda qisqacha...":"Кратко о себе...",
    "Vazifa qurilmada saqlandi. AI orqali XP olish uchun akkauntingizga kiring.":"Задача сохранена на устройстве. Войдите в аккаунт, чтобы получать XP от AI.",
    "AI bu vazifani aniq ish deb baholamadi. Nomini yoki qisqa mazmunini aniqroq yozing.":"AI не смог определить конкретную задачу. Уточните название или описание.",
    "Vazifa qayta ochildi. Avval berilgan XP qaytarib olinmaydi.":"Задача снова открыта. Ранее начисленные XP не возвращаются.",
    "Suhbatni tozalash":"Очистить чат","Bugungi rejam":"Мой план на сегодня","Vazifalarim":"Мои задачи","Motivatsiya":"Мотивация",
    "Bajarish sanasi":"Дата выполнения","Qaysi kuni bajariladi?":"На какой день запланировано?","Qisqa mazmuni":"Краткое описание"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Taxminiy bajarish vaqti":"Estimated duration",
    "15 daqiqa":"15 minutes","30 daqiqa":"30 minutes","45 daqiqa":"45 minutes","1 soat":"1 hour","1,5 soat":"1.5 hours","2 soat":"2 hours","3 soat":"3 hours","4 soat":"4 hours","6 soat":"6 hours",
    "Ustuvorlik":"Priority","AI’dan shaxsiy maslahat":"Get a personal AI tip","AI tavsiyasi":"AI recommendation","AI bilan suhbat":"Chat with AI",
    "Kun tartim":"My daily routine","Menga kun tartibi tuz":"Build my daily routine","Band qo‘shish":"Add routine item",
    "Profilni tahrirlash":"Edit profile","Biografiya":"Bio","O‘zingiz haqingizda qisqacha...":"A little about yourself...",
    "Vazifa qurilmada saqlandi. AI orqali XP olish uchun akkauntingizga kiring.":"Task saved on this device. Sign in to earn AI-awarded XP.",
    "AI bu vazifani aniq ish deb baholamadi. Nomini yoki qisqa mazmunini aniqroq yozing.":"AI could not identify a clear task. Please clarify its title or description.",
    "Vazifa qayta ochildi. Avval berilgan XP qaytarib olinmaydi.":"Task reopened. Previously earned XP is not refunded.",
    "Suhbatni tozalash":"Clear chat","Bugungi rejam":"My plan for today","Vazifalarim":"My tasks","Motivatsiya":"Motivation",
    "Bajarish sanasi":"Due date","Qaysi kuni bajariladi?":"Which day should it be done?","Qisqa mazmuni":"Short description"
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Aurora profil foni":"Фон профиля Aurora","Forest profil foni":"Лесной фон профиля","Sunrise profil foni":"Фон профиля Sunrise",
    "Scholar belgisi":"Значок Scholar","Explorer belgisi":"Значок Explorer","Neon avatar ramkasi":"Неоновая рамка аватара",
    "Yashil va binafsha shimol yog‘dusi uslubidagi fon.":"Фон в стиле северного сияния.",
    "Tabiat ranglaridagi sokin profil foni.":"Спокойный фон профиля в природных тонах.",
    "Yangi kun va yangi maqsadlar uchun iliq fon.":"Тёплый фон для нового дня и новых целей.",
    "Bilim va muntazam o‘rganish ramzi.":"Символ знаний и регулярного обучения.",
    "Yangi ko‘nikmalarni sinab ko‘rish ramzi.":"Символ исследования новых навыков.",
    "Profil rasmingiz uchun yorqin neon ramka.":"Яркая неоновая рамка для фото профиля.",
    "Eslatmalar sahifa ochiq turganda ishlaydi.":"Напоминания работают, пока страница открыта."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Aurora profil foni":"Aurora profile background","Forest profil foni":"Forest profile background","Sunrise profil foni":"Sunrise profile background",
    "Scholar belgisi":"Scholar badge","Explorer belgisi":"Explorer badge","Neon avatar ramkasi":"Neon avatar frame",
    "Yashil va binafsha shimol yog‘dusi uslubidagi fon.":"A green and violet northern-lights inspired background.",
    "Tabiat ranglaridagi sokin profil foni.":"A calm nature-inspired profile background.",
    "Yangi kun va yangi maqsadlar uchun iliq fon.":"A warm background for a fresh day and new goals.",
    "Bilim va muntazam o‘rganish ramzi.":"A symbol of knowledge and consistent learning.",
    "Yangi ko‘nikmalarni sinab ko‘rish ramzi.":"A symbol of exploring new skills.",
    "Profil rasmingiz uchun yorqin neon ramka.":"A bright neon frame for your profile photo.",
    "Eslatmalar sahifa ochiq turganda ishlaydi.":"Reminders work while the page is open."
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "SMARTGOAL MASLAHATI":"СОВЕТ SMARTGOAL","Faollik grafigi":"График активности","Maqsadlarim":"Мои цели","Hozirgi rivojlanish jarayoni":"Текущий прогресс","Darajamni ko‘rish":"Посмотреть мой уровень","Keyingi darajaga o‘tish uchun yana":"До следующего уровня осталось","Siz eng yuqori mavjud darajaga yetdingiz!":"Вы достигли максимального уровня!",
    "Jami maqsadlar":"Всего целей","Maqsad nomi":"Название цели","Maqsad tavsifi":"Описание цели","Maqsad tavsifi kiritilmagan":"Описание цели не добавлено","Muddat belgilanmagan":"Срок не указан","Maqsadni o‘chirish":"Удалить цель","Maqsadni tahrirlash":"Редактировать цель",
    "KUNLIK REJA":"ПЛАН НА ДЕНЬ","Barcha vazifalar":"Все задачи","Vazifalaringizni tartibga soling va bajarilganlarini belgilang.":"Упорядочивайте задачи и отмечайте выполненные.","Vazifa nomini kiriting.":"Введите название задачи.","Vazifa haqida qisqa mazmun kiriting.":"Добавьте краткое описание задачи.","Vazifa nima haqida ekanini kamida bir jumla bilan yozing.":"Опишите задачу хотя бы одним предложением.","Maqsadsiz vazifa":"Задача без цели","Qo‘shimcha sozlama (ixtiyoriy)":"Дополнительные настройки (необязательно)",
    "SIZNING SHAXSIY REJANGIZ":"ВАШ ЛИЧНЫЙ РАСПОРЯДОК","Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.":"Назначьте время каждому делу. AI поможет составить распорядок.","AI bilan kun tartibini tuzish":"Составить распорядок с AI","Bugungi vazifalar":"Задачи на сегодня","Maqsadlar asosida tavsiyalar":"Рекомендации по целям","AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.":"AI проанализирует ваши цели и задачи и предложит практичный план.",
    "NATIJALARINGIZ":"ВАШИ РЕЗУЛЬТАТЫ","Faolligingiz va rivojlanishingizni tahlil qiling.":"Анализируйте свою активность и развитие.","Haftalik faollik":"Активность за неделю","Har kuni to‘plangan XP":"XP, полученные каждый день","Maqsadlar sari bosib o‘tilgan yo‘l":"Прогресс к целям","Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.":"Выполненные задачи и оставшиеся шаги по каждой цели.","Yaratilgan maqsadlar soni":"Количество созданных целей","Qo‘lga kiritilgan yutuqlar":"Полученные достижения","Do‘kondan olingan mahsulotlar":"Покупки в магазине",
    "SIZNING NATIJALARINGIZ":"ВАШИ РЕЗУЛЬТАТЫ","Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.":"Сохраняйте важные дни, сертификаты и личные достижения.","SmartGoal yutuqlari":"Достижения SmartGoal","Shaxsiy xotiralar":"Личные воспоминания","Xotiralar hali yo‘q":"Воспоминаний пока нет","Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.":"Сохраните первое достижение или памятный день.",
    "MAXSUS IMKONIYATLAR":"ОСОБЫЕ ВОЗМОЖНОСТИ","SIZNING BALANSINGIZ":"ВАШ БАЛАНС","Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.":"Каждое настоящее достижение открывает новые возможности.","Bu kategoriyada mahsulot yo‘q":"В этой категории пока нет товаров","Boshqa kategoriyani tanlang.":"Выберите другую категорию.","Sizning kolleksiyangiz":"Ваша коллекция","Do‘kondan birinchi mahsulotingizni xarid qiling.":"Купите первый товар в магазине.",
    "HAMJAMIYAT":"СООБЩЕСТВО","Username orqali boshqa foydalanuvchilarni toping.":"Находите пользователей по имени пользователя.","Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.":"Введите не менее 3 символов. Будут показаны пользователи с таким началом имени.","Kelgan so‘rovlar":"Входящие запросы","Yuborilgan so‘rovlar":"Отправленные запросы","Do‘stlaringiz":"Ваши друзья","Sizning darajangiz":"Ваш уровень",
    "SHAXSIY YORDAMCHI":"ЛИЧНЫЙ ПОМОЩНИК","Har kuni yaxshiroq natija sari.":"К лучшим результатам каждый день.","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.":"Ответы на вопросы, чёткие планы и полезные советы для ваших целей.","AI siz yozgan tilda javob beradi.":"AI отвечает на языке вашего сообщения.","Bugungi rejam":"Мой план на сегодня","Vazifalarim":"Мои задачи","Motivatsiya":"Мотивация",
    "Profil statistikasi":"Статистика профиля","Profil bezagi":"Оформление профиля","Fon, avatar ramkasi va maxsus belgi":"Фон, рамка аватара и значок","Biografiya":"Биография","O‘zingiz haqingizda qisqacha...":"Кратко о себе..."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "SMARTGOAL MASLAHATI":"SMARTGOAL TIP","Faollik grafigi":"Activity chart","Maqsadlarim":"My goals","Hozirgi rivojlanish jarayoni":"Current progress","Darajamni ko‘rish":"View my level","Keyingi darajaga o‘tish uchun yana":"Remaining to the next level","Siz eng yuqori mavjud darajaga yetdingiz!":"You have reached the highest available level!",
    "Jami maqsadlar":"Total goals","Maqsad nomi":"Goal title","Maqsad tavsifi":"Goal description","Maqsad tavsifi kiritilmagan":"No goal description added","Muddat belgilanmagan":"No deadline set","Maqsadni o‘chirish":"Delete goal","Maqsadni tahrirlash":"Edit goal",
    "KUNLIK REJA":"DAILY PLAN","Barcha vazifalar":"All tasks","Vazifalaringizni tartibga soling va bajarilganlarini belgilang.":"Organize your tasks and mark completed ones.","Vazifa nomini kiriting.":"Enter a task title.","Vazifa haqida qisqa mazmun kiriting.":"Add a short task summary.","Vazifa nima haqida ekanini kamida bir jumla bilan yozing.":"Describe the task in at least one sentence.","Maqsadsiz vazifa":"Task without a goal","Qo‘shimcha sozlama (ixtiyoriy)":"Additional settings (optional)",
    "SIZNING SHAXSIY REJANGIZ":"YOUR PERSONAL ROUTINE","Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.":"Set a time for each activity. AI can help build your routine.","AI bilan kun tartibini tuzish":"Build a routine with AI","Bugungi vazifalar":"Today's tasks","Maqsadlar asosida tavsiyalar":"Goal-based suggestions","AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.":"AI analyzes your goals and tasks to create a practical plan.",
    "NATIJALARINGIZ":"YOUR RESULTS","Faolligingiz va rivojlanishingizni tahlil qiling.":"Analyze your activity and progress.","Haftalik faollik":"Weekly activity","Har kuni to‘plangan XP":"XP earned each day","Maqsadlar sari bosib o‘tilgan yo‘l":"Progress toward your goals","Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.":"Completed tasks and remaining steps for each goal.","Yaratilgan maqsadlar soni":"Number of goals created","Qo‘lga kiritilgan yutuqlar":"Achievements earned","Do‘kondan olingan mahsulotlar":"Items purchased from the shop",
    "SIZNING NATIJALARINGIZ":"YOUR RESULTS","Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.":"Save important days, certificates and personal achievements.","SmartGoal yutuqlari":"SmartGoal achievements","Shaxsiy xotiralar":"Personal memories","Xotiralar hali yo‘q":"No memories yet","Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.":"Save your first achievement or memorable day.",
    "MAXSUS IMKONIYATLAR":"SPECIAL FEATURES","SIZNING BALANSINGIZ":"YOUR BALANCE","Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.":"Every real achievement unlocks new possibilities.","Bu kategoriyada mahsulot yo‘q":"No items in this category","Boshqa kategoriyani tanlang.":"Choose another category.","Sizning kolleksiyangiz":"Your collection","Do‘kondan birinchi mahsulotingizni xarid qiling.":"Purchase your first item from the shop.",
    "HAMJAMIYAT":"COMMUNITY","Username orqali boshqa foydalanuvchilarni toping.":"Find other users by username.","Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.":"Enter at least 3 characters. Users whose usernames start with your query will appear.","Kelgan so‘rovlar":"Incoming requests","Yuborilgan so‘rovlar":"Sent requests","Do‘stlaringiz":"Your friends","Sizning darajangiz":"Your level",
    "SHAXSIY YORDAMCHI":"PERSONAL ASSISTANT","Har kuni yaxshiroq natija sari.":"Toward better results every day.","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.":"Answers to your questions, clear plans and useful advice for your goals.","AI siz yozgan tilda javob beradi.":"AI replies in the language you write in.","Bugungi rejam":"My plan for today","Vazifalarim":"My tasks","Motivatsiya":"Motivation",
    "Profil statistikasi":"Profile statistics","Profil bezagi":"Profile customization","Fon, avatar ramkasi va maxsus belgi":"Background, avatar frame and special badge","Biografiya":"Bio","O‘zingiz haqingizda qisqacha...":"A little about yourself..."
  });

  const translationOriginalText = new WeakMap();
  const translationOriginalAttributes = new WeakMap();

  Object.assign(UI_TRANSLATIONS.ru, {
    "Masalan: 20 bet kitob o‘qish":"Например: прочитать 20 страниц книги","Nimani bajarishingizni qisqacha yozing. Masalan: 20 bet o‘qib, 3 ta muhim fikrni yozib chiqish.":"Кратко опишите задачу. Например: прочитать 20 страниц и записать 3 главные мысли.","Qaysi maqsadga tegishli?":"К какой цели относится?","Maqsadsiz vazifa":"Без привязки к цели","Masalan: 07:00 da uyg‘onaman, 08:30 da maktabga ketaman, 14:00 da qaytaman. Kechqurun ingliz tili o‘rganmoqchiman.":"Например: просыпаюсь в 07:00, ухожу в школу в 08:30, возвращаюсь в 14:00. Вечером хочу учить английский."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Masalan: 20 bet kitob o‘qish":"Example: read 20 pages of a book","Nimani bajarishingizni qisqacha yozing. Masalan: 20 bet o‘qib, 3 ta muhim fikrni yozib chiqish.":"Briefly describe what you will do. Example: read 20 pages and write down 3 key ideas.","Qaysi maqsadga tegishli?":"Which goal is this linked to?","Maqsadsiz vazifa":"No linked goal","Masalan: 07:00 da uyg‘onaman, 08:30 da maktabga ketaman, 14:00 da qaytaman. Kechqurun ingliz tili o‘rganmoqchiman.":"Example: I wake up at 7:00, leave for school at 8:30, return at 14:00, and want to study English in the evening."
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Eng faol foydalanuvchilar":"Самые активные пользователи","Jami ishlab topilgan XP bo‘yicha reyting.":"Рейтинг по общему количеству заработанных XP.","Reyting hozircha bo‘sh":"Рейтинг пока пуст","Birinchi XP yig‘gan foydalanuvchi bo‘ling.":"Станьте первым, кто заработает XP."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Eng faol foydalanuvchilar":"Top active users","Jami ishlab topilgan XP bo‘yicha reyting.":"Ranked by total XP earned.","Reyting hozircha bo‘sh":"The leaderboard is empty","Birinchi XP yig‘gan foydalanuvchi bo‘ling.":"Be the first to earn XP."
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Maqsadlarimni tahlil qilib, bugun nima qilishim kerakligini ayt.":"Проанализируй мои цели и скажи, что мне делать сегодня.","Kun tartibimni yaxshilashga yordam ber.":"Помоги улучшить мой распорядок дня.","Vazifalarimni qiyinligi va muddatiga qarab tartibla.":"Распредели мои задачи по сложности и срокам.","Motivatsiyam tushib ketdi. Amaliy maslahat ber.":"У меня пропала мотивация. Дай практический совет.","Bugun nimaga erishamiz?":"Чего мы достигнем сегодня?","Hali vazifalar yo‘q. Birinchi vazifangizni qo‘shing!":"Задач пока нет. Добавьте первую задачу!","Hali maqsad yo‘q. O‘z maqsadingizni belgilang!":"Целей пока нет. Поставьте свою первую цель!","Bugungi rejalaringizga xush kelibsiz":"Добро пожаловать к планированию дня","Yangi hisob yarating":"Создайте новый аккаунт","O‘zingiz haqingizdagi ma’lumotlarni kiriting.":"Введите информацию о себе.","Davom etish uchun ma’lumotlaringizni kiriting.":"Введите данные, чтобы продолжить.","SMARTGOAL’GA QO‘SHILING":"ПРИСОЕДИНЯЙТЕСЬ К SMARTGOAL","XUSH KELIBSIZ":"С ВОЗВРАЩЕНИЕМ","Barcha maydonlarni to‘g‘ri to‘ldiring.":"Заполните все поля правильно.","Parol 8–128 belgi bo‘lishi kerak.":"Пароль должен содержать от 8 до 128 символов.","Ro‘yxatdan o‘tishda xatolik yuz berdi.":"Ошибка при регистрации.","Server bilan bog‘lanib bo‘lmadi.":"Не удалось связаться с сервером.","Maqsadni tahrirlash":"Изменить цель","Maqsad nomini kiriting.":"Введите название цели.","Maqsad saqlandi.":"Цель сохранена.","Maqsadni o‘chirish":"Удалить цель","Vazifani tahrirlash":"Изменить задачу","Vazifa nomini kiriting.":"Введите название задачи.","Vazifa nima haqida ekanini kamida bir jumla bilan yozing.":"Кратко опишите задачу хотя бы одним предложением.","Vazifa qurilmada saqlandi. AI orqali XP olish uchun akkauntingizga kiring.":"Задача сохранена на устройстве. Войдите в аккаунт, чтобы получать XP после оценки AI.","Vazifa serverga saqlanmadi. Internetni tekshirib, qayta urinib ko‘ring.":"Задача не сохранена на сервере. Проверьте интернет и повторите попытку.","Maqsad yakunlandi!":"Цель достигнута!","Vazifani o‘chirish":"Удалить задачу","Yangi yutuq ochildi!":"Открыто новое достижение!","Xaridni amalga oshirib bo‘lmadi.":"Не удалось выполнить покупку.","Mahsulot profilingizga qo‘llandi.":"Предмет применён к вашему профилю.","Siz eng yuqori mavjud darajaga yetdingiz!":"Вы достигли максимального уровня!","Ma’lumotni saqlashda xatolik yuz berdi.":"Ошибка сохранения данных.","Ma’lumot serverga saqlanmadi.":"Данные не сохранены на сервере.","Internet yoki server bilan aloqa uzildi. Ma’lumot qurilmada saqlandi.":"Связь с интернетом или сервером потеряна. Данные сохранены на устройстве.","Ma’lumotlarni yuklab bo‘lmadi.":"Не удалось загрузить данные.","Serverdan kelgan ma’lumot noto‘g‘ri.":"Сервер вернул некорректные данные.","Serverdan chiqish so‘rovi bajarilmadi:":"Не удалось выполнить выход с сервера:","Yangi xabarlar shu yerda paydo bo‘ladi.":"Новые уведомления появятся здесь.","Hali biografiya qo‘shilmagan.":"Биография пока не добавлена.","Hali badge yo‘q":"Значков пока нет","Sozlamalar bo‘limlari":"Разделы настроек","Tug‘ilgan sanani o‘zgartirish":"Изменить дату рождения","Ma’lumotlar tiklandi.":"Данные восстановлены.","Ma’lumotlarni tozalash":"Очистить данные"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Maqsadlarimni tahlil qilib, bugun nima qilishim kerakligini ayt.":"Analyze my goals and tell me what I should do today.","Kun tartibimni yaxshilashga yordam ber.":"Help me improve my daily routine.","Vazifalarimni qiyinligi va muddatiga qarab tartibla.":"Prioritize my tasks by difficulty and deadlines.","Motivatsiyam tushib ketdi. Amaliy maslahat ber.":"I have lost motivation. Give me practical advice.","Bugun nimaga erishamiz?":"What will we achieve today?","Hali vazifalar yo‘q. Birinchi vazifangizni qo‘shing!":"No tasks yet. Add your first task!","Hali maqsad yo‘q. O‘z maqsadingizni belgilang!":"No goals yet. Set your first goal!","Bugungi rejalaringizga xush kelibsiz":"Welcome to your daily planner","Yangi hisob yarating":"Create a new account","O‘zingiz haqingizdagi ma’lumotlarni kiriting.":"Enter your information.","Davom etish uchun ma’lumotlaringizni kiriting.":"Enter your details to continue.","SMARTGOAL’GA QO‘SHILING":"JOIN SMARTGOAL","XUSH KELIBSIZ":"WELCOME BACK","Barcha maydonlarni to‘g‘ri to‘ldiring.":"Please complete all fields correctly.","Parol 8–128 belgi bo‘lishi kerak.":"Password must be 8–128 characters.","Ro‘yxatdan o‘tishda xatolik yuz berdi.":"Registration failed.","Server bilan bog‘lanib bo‘lmadi.":"Could not connect to the server.","Maqsadni tahrirlash":"Edit goal","Maqsad nomini kiriting.":"Enter a goal title.","Maqsad saqlandi.":"Goal saved.","Maqsadni o‘chirish":"Delete goal","Vazifani tahrirlash":"Edit task","Vazifa nomini kiriting.":"Enter a task title.","Vazifa nima haqida ekanini kamida bir jumla bilan yozing.":"Briefly describe the task in at least one sentence.","Vazifa qurilmada saqlandi. AI orqali XP olish uchun akkauntingizga kiring.":"Task saved on this device. Sign in to receive AI-assessed XP.","Vazifa serverga saqlanmadi. Internetni tekshirib, qayta urinib ko‘ring.":"Task was not saved to the server. Check your connection and try again.","Maqsad yakunlandi!":"Goal completed!","Vazifani o‘chirish":"Delete task","Yangi yutuq ochildi!":"New achievement unlocked!","Xaridni amalga oshirib bo‘lmadi.":"Purchase failed.","Mahsulot profilingizga qo‘llandi.":"Item applied to your profile.","Siz eng yuqori mavjud darajaga yetdingiz!":"You reached the highest available level!","Ma’lumotni saqlashda xatolik yuz berdi.":"An error occurred while saving data.","Ma’lumot serverga saqlanmadi.":"Data was not saved to the server.","Internet yoki server bilan aloqa uzildi. Ma’lumot qurilmada saqlandi.":"Connection to the internet or server was lost. Data was saved on this device.","Ma’lumotlarni yuklab bo‘lmadi.":"Could not load data.","Serverdan kelgan ma’lumot noto‘g‘ri.":"The server returned invalid data.","Serverdan chiqish so‘rovi bajarilmadi:":"The server sign-out request failed:","Yangi xabarlar shu yerda paydo bo‘ladi.":"New notifications will appear here.","Hali biografiya qo‘shilmagan.":"No biography added yet.","Hali badge yo‘q":"No badges yet","Sozlamalar bo‘limlari":"Settings sections","Tug‘ilgan sanani o‘zgartirish":"Change birthday","Ma’lumotlar tiklandi.":"Data restored.","Ma’lumotlarni tozalash":"Clear data"
  });

  function translateVisibleUI(root = document.body) {
    if (!root) return;
    const dictionary = UI_TRANSLATIONS[settings.language] || {};
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script,style,textarea,input,select,option,[contenteditable='true']")) continue;
      if (!translationOriginalText.has(node)) translationOriginalText.set(node, node.nodeValue || "");
      const original = translationOriginalText.get(node), trimmed = original.trim();
      if (!trimmed) continue;
      node.nodeValue = original.replace(trimmed, dictionary[trimmed] || trimmed);
    }
    root.querySelectorAll("input[placeholder],textarea[placeholder],button[aria-label],button[title],[data-ai-prompt]").forEach(element => {
      let originals = translationOriginalAttributes.get(element);
      if (!originals) { originals = {}; translationOriginalAttributes.set(element, originals); }
      ["placeholder","aria-label","title","data-ai-prompt"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute) || "";
        const original = originals[attribute];
        element.setAttribute(attribute, dictionary[original] || original);
      });
    });
  }

  function navigate(page) {
    if (!PAGE_TITLES[page]) return;

    currentPage = page;

    $$(".nav-link").forEach(button => {
      button.classList.toggle("active", button.dataset.page === page);
    });

    const title = $("#page-title");
    if (title) title.textContent = PAGE_TITLES[page];

    $("#sidebar")?.classList.remove("open");
    render();
  }

  /* -------------------- RENDER -------------------- */

  function render() {
    const content = $("#content");
    if (!content) return;

    const pages = {
      dashboard: renderDashboard,
      goals: renderGoals,
      schedule: renderSchedule,
      planner: renderPlanner,
      analytics: renderAnalytics,
      achievements: renderAchievements,
      rewards: renderRewards,
      community: renderCommunity,
      ai: renderAI,
      notifications: renderNotifications,
      settings: renderSettings,
      profile: renderProfile
    };

    content.innerHTML = (pages[currentPage] || renderDashboard)();
    translateVisibleUI(document.body);

    updateProfileDisplay();
    updateSidebarPoints();
    updateNotificationIndicators();
    updateCurrentDate();
    refreshIcons();
  }

  function updateSidebarPoints() {
    const element = $("#sidebar-xp");
    if (element) element.textContent = `${formatNumber(data.xp)} XP`;
  }

  function updateNotificationIndicators() {
    const count = unreadCount();
    const dot = $("#notification-dot");
    const indicator = $(".notification-indicator");

    if (dot) dot.style.display = count ? "block" : "none";
    if (indicator) indicator.style.display = count ? "block" : "none";
  }

  function updateCurrentDate() {
    const element = $("#current-date");
    if (!element) return;

    element.textContent = new Date().toLocaleDateString(getLocale(), {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  /* -------------------- EVENT HANDLING -------------------- */

  function handleClick(event) {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      event.preventDefault();
      navigate(pageButton.dataset.page);
      return;
    }

    const authTab = event.target.closest("[data-auth-tab]");
    if (authTab) {
      switchAuthTab(authTab.dataset.authTab);
      return;
    }

    const aiPrompt = event.target.closest("[data-ai-prompt]");
    if (aiPrompt) { const input=$("#ai-form input[name='message']"); if(input){input.value=aiPrompt.dataset.aiPrompt||""; $("#ai-form")?.requestSubmit();} return; }

    const storeCategory = event.target.closest("[data-store-filter]");
    if (storeCategory) { storeFilter = storeCategory.dataset.storeFilter || "all"; render(); return; }

    const settingsTab = event.target.closest("[data-settings-tab]");
    if (settingsTab) {
      currentSettingsTab = settingsTab.dataset.settingsTab;
      render();
      return;
    }

    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;

    const action = actionElement.dataset.action;
    const id = actionElement.dataset.id;

    switch (action) {
      case "view-profile":
        openPublicProfile(actionElement.dataset.username);
        break;
      case "send-friend-request":
        sendFriendRequest(actionElement.dataset.userId);
        break;
      case "respond-friend":
        respondFriendRequest(actionElement.dataset.requestId, actionElement.dataset.decision);
        break;
      case "refresh-friends":
        loadCommunityRelations();
        break;
      case "refresh-leaderboard":
        loadCommunityLeaderboard();
        break;
      case "generate-ai-plan":
        generateAIPlan();
        break;
      case "generate-daily-advice":
        generateDailyAdvice();
        break;
      case "close-daily-advice":
        $("#daily-ai-advice-card")?.classList.add("hidden");
        break;
      case "add-routine":
        openRoutineForm();
        break;
      case "edit-routine":
        openRoutineForm(id);
        break;
      case "delete-routine":
        data.dailyRoutine = (data.dailyRoutine || []).filter(item => item.id !== id);
        saveData(); render(); showToast("Kun tartibidan band o‘chirildi.");
        break;
      case "generate-routine":
        generateRoutine();
        break;
      case "clear-ai-chat":
        aiConversation = [];
        render();
        break;
      case "enable-routine-reminders":
        enableRoutineReminders();
        break;
      case "add-goal":
        openGoalForm();
        break;
      case "edit-goal":
        openGoalForm(id);
        break;
      case "delete-goal":
        deleteGoal(id);
        break;
      case "confirm-delete-goal":
        data.goals = data.goals.filter(item => item.id !== id);
        saveData();
        closeModal();
        render();
        showToast("Maqsad o‘chirildi.");
        break;

      case "load-more-tasks":
        taskListLimit += 50;
        render();
        break;
      case "load-more-goals":
        goalListLimit += 40;
        render();
        break;
      case "load-more-memories":
        memoryListLimit += 30;
        render();
        break;
      case "add-task":
        openTaskForm();
        break;
      case "edit-task":
        openTaskForm(id);
        break;
      case "delete-task":
        deleteTask(id);
        break;
      case "confirm-delete-task":
        data.tasks = data.tasks.filter(item => item.id !== id);
        refreshGoalProgress();
        saveData();
        closeModal();
        render();
        showToast("Vazifa o‘chirildi.");
        break;

      case "edit-profile":
        openProfileEditor();
        break;
      case "share-profile":
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(`${location.origin}/?profile=${encodeURIComponent(data.profile.username || "")}`)
            .then(() => showToast("Profil havolasi nusxalandi."))
            .catch(() => showToast("Havolani nusxalab bo‘lmadi.", "error"));
        } else {
          showToast(`Username: @${data.profile.username}`);
        }
        break;

      case "add-memory":
        openMemoryForm();
        break;
      case "delete-memory":
        data.memories = data.memories.filter(item => item.id !== id);
        saveData();
        render();
        showToast("Xotira o‘chirildi.");
        break;

      case "buy-item":
        purchaseItem(id);
        break;
      case "confirm-purchase":
        confirmPurchase(id);
        break;
      case "use-item":
        useItem(id);
        break;
      case "set-theme":
        settings.colorTheme = actionElement.dataset.colorTheme;
        saveSettings();
        render();
        showToast("Rang mavzusi o‘zgartirildi.");
        break;
      case "locked-theme":
        navigate("rewards");
        showToast("Bu mavzuni avval do‘kondan xarid qiling.");
        break;

      case "toggle-sound":
        settings.sound = !settings.sound;
        saveSettings();
        render();
        showToast(settings.sound ? "Ovoz yoqildi." : "Ovoz o‘chirildi.");
        break;
      case "toggle-motion":
        settings.reducedMotion = !settings.reducedMotion;
        saveSettings();
        render();
        break;

      case "export-data":
        exportData();
        break;
      case "import-data":
        importData();
        break;
      case "reset-data":
        resetData();
        break;
      case "confirm-reset":
        data = createInitialData();
        saveData();
        closeModal();
        render();
        showToast("Mahalliy ma’lumotlar tozalandi.");
        break;

      case "edit-birthdate":
        openBirthdateEditor();
        break;

      case "mark-all-read":
        data.notifications.forEach(item => item.read = true);
        saveData();
        render();
        break;
      case "read-notification": {
        const notification = data.notifications.find(item => item.id === id);
        if (notification) notification.read = true;
        saveData();
        render();
        break;
      }

      case "close-modal":
        closeModal();
        break;
      case "close-toast":
        $("#toast")?.classList.add("hidden");
        break;
      case "open-sidebar":
        $("#sidebar")?.classList.add("open");
        break;
      case "close-sidebar":
        $("#sidebar")?.classList.remove("open");
        break;
      case "toggle-search":
        toggleSearch();
        break;
      case "close-search":
        $("#global-search")?.classList.add("hidden");
        break;
      case "logout":
        logout();
        break;
      case "forgot-password":
        showToast("Parolni tiklash backend ulanganda qo‘shiladi.");
        break;
      case "toggle-password": {
        const input = document.getElementById(actionElement.dataset.target);
        if (!input) break;
        input.type = input.type === "password" ? "text" : "password";
        break;
      }
    }
  }

  function handleChange(event) {
    const target = event.target;

    if (target.matches("[data-action='toggle-task']")) {
      toggleTask(target.dataset.id);
      return;
    }

    if (target.matches("[data-setting]")) {
      const key = target.dataset.setting;
      if (!["language", "theme", "fontSize"].includes(key)) return;

      settings[key] = target.value;
      saveSettings();
      render();
      return;
    }

    if (target.matches("input[name='difficulty']")) {
      settings.difficulty = target.value;
      saveSettings();
      render();
      showToast("Interfeys murakkabligi yangilandi.");
      return;
    }
  }

  function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    switch (form.getAttribute("id")) {
      case "login-form":
        event.preventDefault();
        loginRemote(form);
        break;
      case "register-form":
        event.preventDefault();
        registerRemote(form);
        break;
      case "profile-form":
        event.preventDefault();
        saveProfile(form);
        break;
      case "goal-form":
        event.preventDefault();
        saveGoal(form);
        break;
      case "task-form":
        event.preventDefault();
        saveTask(form);
        break;
      case "routine-form":
        event.preventDefault();
        saveRoutine(form);
        break;
      case "memory-form":
        event.preventDefault();
        saveMemory(form);
        break;
      case "birthdate-form": {
        event.preventDefault();
        const birthdate = String(new FormData(form).get("birthdate") || "");
        const age = calculateAge(birthdate);

        if (age === null) {
          showToast("Tug‘ilgan sanani tekshiring.", "error");
          return;
        }

        data.profile.birthdate = birthdate;
        data.profile.age = age;
        saveData();
        closeModal();
        render();
        showToast("Tug‘ilgan sana yangilandi.");
        break;
      }
      case "ai-form":
        event.preventDefault();
        sendAIMessage(form);
        break;
    }
  }

  let communitySearchSequence = 0;
  let communitySearchTimer = null;

  function openRequestedProfile() {
    const params=new URLSearchParams(window.location.search);
    const username=params.get("profile");
    if(!username) return;
    window.history.replaceState({},document.title,window.location.pathname);
    setTimeout(()=>openPublicProfile(username),0);
  }

  async function loadCommunityLeaderboard() {
    const container=$("#community-leaderboard");
    if(!container)return;
    try{
      const response=await fetch("/api/users/leaderboard",{credentials:"same-origin"});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.success)throw new Error(result.message||"Reyting yuklanmadi.");
      communityLeaderboard=Array.isArray(result.users)?result.users:[];
      if(!communityLeaderboard.length){container.innerHTML=emptyState("Reyting hozircha bo‘sh","Birinchi XP yig‘gan foydalanuvchi bo‘ling.","trophy");return;}
      container.innerHTML=communityLeaderboard.map(user=>`<div class="leaderboard-row"><span class="leaderboard-rank">#${user.rank}</span><div class="leaderboard-user"><button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(user.username)}"><strong>${escapeHTML(user.name)}</strong></button><small>@${escapeHTML(user.username)} · Level ${getRank(Number(user.totalEarnedXP||0)).level}</small></div><strong class="leaderboard-xp">${formatNumber(user.totalEarnedXP)} XP</strong></div>`).join("");
      refreshIcons();
    }catch(error){container.innerHTML=emptyState("Reyting yuklanmadi",error.message||"Server bilan aloqa uzildi.","alert-circle");}
  }

  async function openPublicProfile(username) {
    if (!username) return;
    openModal("Foydalanuvchi profili", '<div class="profile-loading">Profil yuklanmoqda...</div>', '<button class="secondary-button" type="button" data-action="close-modal">Yopish</button>');
    try {
      const response = await fetch("/api/users/profile?username=" + encodeURIComponent(username), {credentials:"same-origin"});
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success || !result.profile) throw new Error(result.message || "Profilni yuklab bo‘lmadi.");
      const p = result.profile, rank = getRank(Number(p.totalEarnedXP || p.xp || 0));
      const covers = {default:"linear-gradient(120deg,#5145cf,#9282f6)",midnight:"linear-gradient(120deg,#101827,#283958)",galaxy:"radial-gradient(circle at 80% 20%,#7256c9,#161b43 65%)",royal:"linear-gradient(120deg,#7c4a20,#d3a24b)",sakura:"linear-gradient(120deg,#e7a5bd,#8b6bba)",nebula:"radial-gradient(circle at 25% 25%,#a35ac8,#111b3c 70%)",aurora:"linear-gradient(130deg,#123d43,#5b4a9a 55%,#a3d5c6)",forest:"linear-gradient(130deg,#102f26,#39745a 55%,#b4c99a)",sunrise:"linear-gradient(130deg,#713f57,#e18c70 55%,#f5d99a)"};
      const avatar = p.avatar ? '<img src="'+escapeHTML(p.avatar)+'" alt="Profil rasmi" loading="lazy" decoding="async">' : icon("user-round",40);
      const avatarFrame = ["premium","gold","neon"].includes(p.avatarFrame) ? " avatar-frame-"+p.avatarFrame : "";
      const badge = p.activeBadge ? '<span class="profile-active-badge">'+icon("award",13)+' '+escapeHTML(p.activeBadge)+'</span>' : "";
      const birthday = p.birthdate ? '<div class="profile-public-stat">'+icon("cake")+" "+escapeHTML(formatDate(p.birthdate))+'</div>' : "";
      const isSelf=p.username===data.profile.username;
      const isFriend=(communityRelations.friends||[]).some(friend=>friend.id===p.id);
      const outgoingRequest=(communityRelations.outgoing||[]).find(request=>request.userId===p.id);
      const incomingRequest=(communityRelations.incoming||[]).find(request=>request.userId===p.id);
      const friendAction=isSelf?"":isFriend?'<span class="profile-active-badge">'+icon("users",13)+' Do‘stingiz</span>':outgoingRequest?'<span class="profile-active-badge">So‘rov yuborilgan</span>':incomingRequest?'<button class="primary-button" type="button" data-action="respond-friend" data-request-id="'+escapeHTML(incomingRequest.id)+'" data-decision="accept">So‘rovni qabul qilish</button>':'<button class="primary-button" type="button" data-action="send-friend-request" data-user-id="'+escapeHTML(p.id)+'">'+icon("user-plus",15)+' Do‘stlik so‘rovi yuborish</button>';
      const levelProgress='<section class="public-profile-level"><div class="public-profile-level-head"><strong>Level '+rank.level+' · '+escapeHTML(rank.name)+'</strong><span>'+Math.round(rank.progress)+'%</span></div><div class="progress-track"><div class="progress-fill" style="width:'+rank.progress+'%"></div></div><small>'+(rank.next?formatNumber(rank.remaining)+' XP keyingi darajagacha':'Eng yuqori daraja')+'</small></section>';
      const html = '<div class="public-profile-cover" style="background:'+(covers[p.background]||covers.default)+'"></div><div class="public-profile-body"><div class="public-profile-avatar'+avatarFrame+'">'+avatar+'</div><h2>'+escapeHTML(p.name)+'</h2><p class="profile-username">@'+escapeHTML(p.username)+'</p>'+badge+'<p class="profile-bio">'+escapeHTML(p.bio||"Biografiya qo‘shilmagan.")+'</p><div class="public-profile-stats"><div><strong>'+formatNumber(p.xp)+'</strong><small>XP balansi</small></div><div><strong>'+formatNumber(p.totalEarnedXP||p.xp)+'</strong><small>Jami olgan XP</small></div><div><strong>'+rank.level+'</strong><small>Daraja</small></div><div><strong>'+formatNumber(p.completedTasks)+'</strong><small>Vazifa</small></div><div><strong>'+formatNumber(p.goals)+'</strong><small>Maqsad</small></div></div>'+levelProgress+birthday+'<p class="card-description">Profil bezagi: '+formatNumber(p.customizationScore||0)+' / 3 · SmartGoal’da '+formatNumber(p.achievements)+' ta yutuq</p>'+friendAction+'</div>';
      const body = $("#modal-body"); if (body) body.innerHTML = html;
      refreshIcons();
    } catch (error) {
      const body = $("#modal-body"); if (body) body.innerHTML = '<div class="empty-state">'+escapeHTML(error.message||"Profilni ochib bo‘lmadi.")+'</div>';
    }
  }

  async function searchCommunityUsers(value) {
    const query = normalizedUsername(value);
    const results = $("#community-results");
    const sequence = ++communitySearchSequence;
    if (!results) return;

    if (!query) {
      results.innerHTML = emptyState("Qidiruvga tayyor", "Username kiriting.", "users");
      return;
    }
    if (query.length < 3) {
      results.innerHTML = emptyState("Yana belgi kiriting", "Qidiruv uchun kamida 3 ta belgi kerak.", "search");
      return;
    }

    results.innerHTML = emptyState("Qidirilmoqda...", "Foydalanuvchilar tekshirilmoqda.", "loader-circle");

    try {
      const response = await fetch("/api/users/search?username=" + encodeURIComponent(query), {
        method: "GET",
        credentials: "same-origin",
        headers: { "Accept": "application/json" }
      });
      const result = await response.json().catch(() => ({}));
      if (sequence !== communitySearchSequence) return;
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Qidiruv vaqtida xatolik yuz berdi.");
      }

      const users = Array.isArray(result.users) ? result.users : [];
      await loadCommunityRelations();
      if (sequence !== communitySearchSequence) return;
      if (!users.length) {
        results.innerHTML = emptyState("Foydalanuvchi topilmadi", "Bu username bilan boshlanadigan foydalanuvchi yo‘q.", "user-search");
        return;
      }

      results.innerHTML = users.map(user => `
        <div class="user-item">
          <span class="avatar avatar-medium">${icon("user-round")}</span>
          <div class="user-item-info">
            <button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(user.username || "")}"><strong>${escapeHTML(user.name || "Foydalanuvchi")}</strong></button>
            <small>@${escapeHTML(user.username || "")} · Level ${getRank(Number(user.totalEarnedXP||user.xp||0)).level} · ${formatNumber(user.totalEarnedXP??user.xp??0)} XP jami${user.username === data.profile.username ? " · Sizning profilingiz" : ""}</small>
          </div>
          ${user.username === data.profile.username
            ? `<span class="user-rank">Siz</span>`
            : communityRelations.friends.some(item => item.username === user.username)
              ? `<span class="user-rank">Do‘st</span>`
              : communityRelations.outgoing.some(item => item.username === user.username)
                ? `<span class="user-rank">So‘rov yuborilgan</span>`
                : (() => {
                    const incoming = communityRelations.incoming.find(item => item.username === user.username);
                    return incoming
                      ? `<button class="card-action" type="button" data-action="respond-friend" data-request-id="${escapeHTML(incoming.id)}" data-decision="accept">So‘rovni qabul qilish</button>`
                      : `<button class="card-action" type="button" data-action="send-friend-request" data-user-id="${escapeHTML(user.id)}">Do‘st bo‘lish</button>`;
                  })()}
        </div>
      `).join("");
      refreshIcons();
    } catch (error) {
      if (sequence !== communitySearchSequence) return;
      results.innerHTML = emptyState("Qidiruv ishlamadi", escapeHTML(error.message || "Server bilan bog‘lanib bo‘lmadi."), "alert-circle");
    }
  }

  async function loadCommunityRelations() {
    const container = $("#community-relations");
    if (!container) return;
    try {
      const response = await fetch("/api/friends", { credentials: "same-origin" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Do‘stlar ro‘yxatini yuklab bo‘lmadi.");
      const incoming = Array.isArray(result.incoming) ? result.incoming : [];
      const outgoing = Array.isArray(result.outgoing) ? result.outgoing : [];
      const friends = Array.isArray(result.friends) ? result.friends : [];
      communityRelations = { incoming, outgoing, friends };
      const section = (title, rows, renderRow, empty) => `
        <div style="margin-top:14px">
          <h4>${escapeHTML(title)}</h4>
          ${rows.length ? rows.map(renderRow).join("") : `<p class="card-description">${escapeHTML(empty)}</p>`}
        </div>`;
      container.innerHTML =
        section("Kelgan so‘rovlar", incoming, item => `
          <div class="user-item">
            <div class="user-item-info"><button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(item.username)}"><strong>${escapeHTML(item.name)}</strong></button><small>@${escapeHTML(item.username)}</small></div>
            <button class="card-action" data-action="respond-friend" data-request-id="${escapeHTML(item.id)}" data-decision="accept">Qabul qilish</button>
            <button class="card-action" data-action="respond-friend" data-request-id="${escapeHTML(item.id)}" data-decision="decline">Rad etish</button>
          </div>`, "Hozircha kelgan so‘rov yo‘q.") +
        section("Yuborilgan so‘rovlar", outgoing, item => `
          <div class="user-item"><div class="user-item-info"><button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(item.username)}"><strong>${escapeHTML(item.name)}</strong></button><small>@${escapeHTML(item.username)}</small></div><span class="user-rank">Kutilmoqda</span></div>`, "Yuborilgan so‘rov yo‘q.") +
        section("Do‘stlaringiz", friends, item => `
          <div class="user-item"><div class="user-item-info"><button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(item.username)}"><strong>${escapeHTML(item.name)}</strong></button><small>@${escapeHTML(item.username)}</small></div><span class="user-rank">Do‘st</span></div>`, "Hali do‘stlar yo‘q.");
    } catch (error) {
      communityRelations = { incoming: [], outgoing: [], friends: [] };
      container.innerHTML = emptyState("Do‘stlar yuklanmadi", error.message || "Server bilan aloqa uzildi.", "alert-circle");
    }
    refreshIcons();
  }

  async function sendFriendRequest(userId) {
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "So‘rov yuborilmadi.");
      showToast(result.message || "Do‘stlik so‘rovi yuborildi.");
      const profileButton = document.querySelector("#modal-body [data-action='send-friend-request']");
      if (profileButton && profileButton.dataset.userId === userId) { profileButton.disabled=true; profileButton.textContent="So‘rov yuborildi"; }
      await loadCommunityRelations();
      const input = $("#community-search");
      if (input?.value) searchCommunityUsers(input.value);
    } catch (error) {
      showToast(error.message || "So‘rov yuborilmadi.", "error");
    }
  }

  async function respondFriendRequest(requestId, decision) {
    try {
      const response = await fetch("/api/friends/respond", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, decision })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Amal bajarilmadi.");
      showToast(result.message || "So‘rov yangilandi.");
      const profileRequestButton=document.querySelector("#modal-body [data-request-id]");
      if(profileRequestButton && profileRequestButton.dataset.requestId===requestId){profileRequestButton.disabled=true;profileRequestButton.textContent=decision==="accept"?"Do‘stingiz":"So‘rov rad etildi";}
      await loadCommunityRelations();
    } catch (error) {
      showToast(error.message || "Amal bajarilmadi.", "error");
    }
  }

  function handleInput(event) {
    const target = event.target;

    if (target.id === "global-search-input" && event.key === "Enter") {
      runGlobalSearch(target.value);
    }

  }

  /* -------------------- INITIALIZATION -------------------- */

  async function initializeSmartGoal() {
    applySettings();
    checkRoutineReminders();
    if (!window.smartGoalReminderTimer) window.smartGoalReminderTimer = setInterval(checkRoutineReminders, 30000);
    const maxDate = $("#register-birthdate");
    if (maxDate) maxDate.max = today();
    localStorage.removeItem(SESSION_KEY);

    try {
      const response = await fetch("/api/me", { credentials: "same-origin" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success || !result.user) throw new Error("Not authenticated");
      remoteAuthenticated = true;
      await loadRemoteData();
      if (!data.profile.name || data.profile.name === "SmartGoal foydalanuvchisi") {
        data.profile.name = result.user.name || "Foydalanuvchi";
        data.profile.email = result.user.email || "";
        data.profile.username = result.user.username || "";
        data.profile.birthdate = result.user.birthdate || "";
        data.profile.age = calculateAge(data.profile.birthdate);
      }
      showApplication();
      checkAchievements();
      checkRoutineReminders();
      openRequestedProfile();
    } catch {
      remoteAuthenticated = false;
      showAuthentication();
      switchAuthTab("login");
    }
    updateProfileDisplay();
    refreshIcons();
  }

  function syncSmartGoalData() {
    saveData();
    render();
  }

  function attachEvents() {
    document.addEventListener("click", handleClick);
    document.addEventListener("change", handleChange);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("keydown", handleInput);

    document.addEventListener("input", event => {
      if (event.target.id !== "community-search") return;
      if (communitySearchTimer) clearTimeout(communitySearchTimer);
      const value = event.target.value;
      communitySearchTimer = setTimeout(() => {
        communitySearchTimer = null;
        searchCommunityUsers(value);
      }, 350);
    });

    $("#modal-overlay")?.addEventListener("click", event => {
      if (event.target.id === "modal-overlay") closeModal();
    });

    window.addEventListener("storage", event => {
      if (event.key === DATA_KEY) {
        data = loadData();
        render();
      }

      if (event.key === SETTINGS_KEY) {
        settings = loadSettings();
        applySettings();
        render();
      }
    });

    window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
      if (settings.theme === "system") applySettings();
    });
  }

  /* -------------------- PUBLIC API -------------------- */

  window.render = render;
  window.initializeSmartGoal = initializeSmartGoal;
  window.syncSmartGoalData = syncSmartGoalData;

  window.SmartGoal = {
    getData: () => structuredClone(data),
    getSettings: () => ({ ...settings }),
    getRank,
    calculateAge,
    navigate,
    addXP,
    render
  };

  /* -------------------- START -------------------- */

  function start() {
    attachEvents();
    initializeSmartGoal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

})();
