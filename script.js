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
  const API_BASE="https://smartgoal-api.hyuhyu3268-4d9.workers.dev"; const API_TOKEN_KEY="smartgoal_api_token";
  function apiFetch(path,options={}){const headers=new Headers(options.headers||{}),token=localStorage.getItem(API_TOKEN_KEY);if(token)headers.set("Authorization","Bearer "+token);if(options.body&&!headers.has("Content-Type"))headers.set("Content-Type","application/json");return fetch(API_BASE+path,{...options,headers,credentials:"include"});}

  const DEFAULT_SETTINGS = {
    language: "uz",
    theme: "light",
    colorTheme: "violet",
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

  // Canonical, shareable URLs for every application section.
  // O‘zbekcha asosiy manzillar. Inglizcha eski manzillar mos sahifaga
  // yo‘naltiriladi, shunda avval ulashilgan havolalar ham ishlashda davom etadi.
  const PAGE_ROUTES = {
    dashboard: "/",
    goals: "/maqsadlar",
    schedule: "/vazifalar",
    planner: "/kun-tartibi",
    analytics: "/statistika",
    achievements: "/yutuqlar",
    rewards: "/mukofotlar",
    community: "/hamjamiyat",
    ai: "/suniy-intellekt",
    notifications: "/bildirishnomalar",
    settings: "/sozlamalar",
    profile: "/profil"
  };
  const ROUTE_PAGES = Object.fromEntries(
    Object.entries(PAGE_ROUTES).map(([page, path]) => [path, page])
  );
  Object.assign(ROUTE_PAGES, {
    "/goals": "goals",
    "/tasks": "schedule",
    "/planner": "planner",
    "/statistics": "analytics",
    "/achievements": "achievements",
    "/rewards": "rewards",
    "/community": "community",
    "/ai": "ai",
    "/notifications": "notifications",
    "/settings": "settings",
    "/profile": "profile",
    "/dashboard": "dashboard",
    "/schedule": "schedule",
    "/analytics": "analytics",
    "/rewards-shop": "rewards",
    "/my-profile": "profile"
  });

  function resolvePageFromPath(pathname = window.location.pathname) {
    let normalized = String(pathname || "/");
    try { normalized = decodeURIComponent(normalized); } catch {}
    normalized = normalized.replace(/\\/+$/, "") || "/";
    return ROUTE_PAGES[normalized] || "dashboard";
  }

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
      name: "Okean mavzusi",
      description: "Profilingiz va interfeysingiz uchun sokin ko‘k rang.",
      type: "theme",
      value: "ocean",
      price: 80,
      icon: "waves"
    },
    {
      id: "theme-emerald",
      name: "Zumrad mavzusi",
      description: "Yashil va nafis ko‘rinish.",
      type: "theme",
      value: "emerald",
      price: 120,
      icon: "leaf"
    },
    {
      id: "theme-sunset",
      name: "Shafaq mavzusi",
      description: "Iliq ranglardagi maxsus interfeys.",
      type: "theme",
      value: "sunset",
      price: 160,
      icon: "sunset"
    },
    {
      id: "theme-rose",
      name: "Atirgul mavzusi",
      description: "Nafis pushti ranglar uyg‘unligi.",
      type: "theme",
      value: "rose",
      price: 200,
      icon: "flower-2"
    },
    {
      id: "background-midnight",
      name: "Yarim tun foni",
      description: "Profil uchun qoramtir, maxsus fon.",
      type: "background",
      value: "midnight",
      price: 250,
      icon: "moon-star"
    },
    {
      id: "background-galaxy",
      name: "Galaktika foni",
      description: "Maxsus kosmik profil foni.",
      type: "background",
      value: "galaxy",
      price: 400,
      icon: "orbit"
    },
    {
      id: "background-royal",
      name: "Qirollik foni",
      description: "Noyob premium profil dizayni.",
      type: "background",
      value: "royal",
      price: 650,
      icon: "crown"
    },
    {
      id: "badge-focus",
      name: "Diqqat belgisi",
      description: "Diqqat va intizom ramzi.",
      type: "badge",
      value: "focus",
      price: 120,
      icon: "crosshair"
    },
    {
      id: "badge-diamond",
      name: "Olmos belgisi",
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
      name: "Gilos gullari profil foni",
      description: "Profilingizga nozik va yorqin uslub.",
      type: "background",
      value: "sakura",
      price: 220,
      icon: "flower-2"
    },
    {
      id: "background-nebula",
      name: "Tumanlik profil foni",
      description: "Yulduzli kosmik bezak.",
      type: "background",
      value: "nebula",
      price: 360,
      icon: "orbit"
    },
    {
      id: "badge-builder",
      name: "Quruvchi belgisi",
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
      name: "Maxsus avatar ramkasi",
      description: "Profil rasmingiz uchun maxsus ramka.",
      type: "avatar",
      value: "premium",
      price: 360,
      icon: "frame"
    },
    {
      id: "background-aurora",
      name: "Shimol yog‘dusi profil foni",
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
      name: "Quyosh chiqishi profil foni",
      description: "Yangi kun va yangi maqsadlar uchun iliq fon.",
      type: "background",
      value: "sunrise",
      price: 450,
      icon: "sunrise"
    },
    {
      id: "badge-scholar",
      name: "Olim belgisi",
      description: "Bilim va muntazam o‘rganish ramzi.",
      type: "badge",
      value: "Scholar",
      price: 240,
      icon: "graduation-cap"
    },
    {
      id: "badge-explorer",
      name: "Kashfiyotchi belgisi",
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
    },
    { id: "theme-lavender", name: "Lavanda mavzusi", description: "Yumshoq lavanda ranglaridagi interfeys.", type: "theme", value: "lavender", price: 150, icon: "flower" },
    { id: "theme-mint", name: "Yalpiz mavzusi", description: "Yengil va tetiklantiruvchi yashil ranglar.", type: "theme", value: "mint", price: 180, icon: "sprout" },
    { id: "background-coral", name: "Marjon profil foni", description: "Iliq marjon ranglari bilan o‘ziga xos profil.", type: "background", value: "coral", price: 520, icon: "sun" },
    { id: "background-ember", name: "Cho‘g‘ profil foni", description: "Chuqur ranglar va olovli aksentlar.", type: "background", value: "ember", price: 720, icon: "flame" },
    { id: "badge-streak", name: "Ketma-ketlik belgisi", description: "Muntazamlik va davomiy harakat ramzi.", type: "badge", value: "Streak", price: 360, icon: "calendar-check" },
    { id: "badge-creator", name: "Ijodkor belgisi", description: "Yangi g‘oyalarni amaliy natijaga aylantiruvchilar uchun.", type: "badge", value: "Creator", price: 480, icon: "lightbulb" },
    { id: "avatar-frame-crystal", name: "Billur avatar ramkasi", description: "Profil rasmingiz uchun billurdek yorqin ramka.", type: "avatar", value: "crystal", price: 620, icon: "diamond" },
    { id: "avatar-frame-flame", name: "Olov avatar ramkasi", description: "Profilingizga jo‘shqin va yorqin uslub.", type: "avatar", value: "flame", price: 760, icon: "flame" },
    { id: "theme-graphite", name: "Grafit mavzusi", description: "Minimal va jiddiy grafit ranglar.", type: "theme", value: "graphite", price: 220, icon: "layers" },
    { id: "theme-ice", name: "Muz mavzusi", description: "Sovuq moviy va oq ranglar uyg‘unligi.", type: "theme", value: "ice", price: 240, icon: "snowflake" },
    { id: "theme-amber", name: "Qahrabo mavzusi", description: "Iliq oltin ranglar bilan yorqin interfeys.", type: "theme", value: "amber", price: 260, icon: "sun-medium" },
    { id: "background-ocean", name: "Ocean profil foni", description: "Chuqur dengiz ranglaridagi profil foni.", type: "background", value: "ocean", price: 560, icon: "waves" },
    { id: "background-mountain", name: "Tog‘ profil foni", description: "Tog‘ manzarasidan ilhomlangan fon.", type: "background", value: "mountain", price: 590, icon: "mountain" },
    { id: "background-aurora-night", name: "Shimol yog‘dusi tungi foni", description: "Tungi osmon va shimol yog‘dusi ranglari.", type: "background", value: "aurora-night", price: 780, icon: "moon-star" },
    { id: "badge-focus-pro", name: "Diqqat Pro belgisi", description: "Chuqur diqqat va samarali mehnat ramzi.", type: "badge", value: "Diqqat Pro", price: 650, icon: "focus" },
    { id: "badge-innovator", name: "Innovator belgisi", description: "Yangi yechimlar yaratuvchilar uchun.", type: "badge", value: "Innovator", price: 700, icon: "lightbulb" },
    { id: "badge-mentor", name: "Mentor belgisi", description: "Bilimini boshqalar bilan ulashuvchilar uchun.", type: "badge", value: "Mentor", price: 820, icon: "graduation-cap" },
    { id: "avatar-frame-prism", name: "Prism avatar ramkasi", description: "Ranglar jilosi bilan zamonaviy ramka.", type: "avatar", value: "prism", price: 850, icon: "gem" },
    { id: "avatar-frame-carbon", name: "Carbon avatar ramkasi", description: "Minimal qoramtir premium ramka.", type: "avatar", value: "carbon", price: 900, icon: "square" },
    { id: "avatar-frame-aurora", name: "Aurora avatar ramkasi", description: "Yashil va binafsha rangli yorqin ramka.", type: "avatar", value: "aurora", price: 980, icon: "sparkles" },
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
    },
    { id: "twenty-five-tasks", name: "Barqaror intizom", description: "25 ta vazifani bajaring.", icon: "calendar-check", condition: data => data.tasks.filter(task => task.completed).length >= 25 },
    { id: "fifty-tasks", name: "Mehnat chempioni", description: "50 ta vazifani bajaring.", icon: "medal", condition: data => data.tasks.filter(task => task.completed).length >= 50 },
    { id: "hundred-tasks", name: "Yuz qadam", description: "100 ta vazifani bajaring.", icon: "trophy", condition: data => data.tasks.filter(task => task.completed).length >= 100 },
    { id: "five-goals-created", name: "Katta orzular", description: "5 ta maqsad yarating.", icon: "goal", condition: data => data.goals.length >= 5 },
    { id: "ten-goals-created", name: "Rejalar me’mori", description: "10 ta maqsad yarating.", icon: "drafting-compass", condition: data => data.goals.length >= 10 },
    { id: "xp-250", name: "Birinchi marralar", description: "250 XP to‘plang.", icon: "coins", condition: data => Number(data.xp || 0) + Number(data.spentXP || 0) >= 250 },
    { id: "xp-2500", name: "Kuchli salohiyat", description: "2500 XP to‘plang.", icon: "sparkles", condition: data => Number(data.xp || 0) + Number(data.spentXP || 0) >= 2500 },
    { id: "xp-5000", name: "Afsonaviy natija", description: "5000 XP to‘plang.", icon: "crown", condition: data => Number(data.xp || 0) + Number(data.spentXP || 0) >= 5000 },
    { id: "routine-builder", name: "Kun tartibi ustasi", description: "Kun tartibiga 10 ta band kiriting.", icon: "list-todo", condition: data => (data.dailyRoutine || []).length >= 10 }
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

  function refreshIcons(root = document) {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ root: root || document });
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
      routineLogs: {},
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
      preferences: {}
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
      routineLogs: saved.routineLogs && typeof saved.routineLogs === "object" ? saved.routineLogs : {},
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
    const loaded = { ...DEFAULT_SETTINGS, ...(saved || {}) };
    delete loaded.difficulty;
    return loaded;
  }

  let data = loadData();
  let settings = loadSettings();
  let currentPage = resolvePageFromPath();
  const canonicalInitialPath = PAGE_ROUTES[currentPage] || "/";
  if (window.location.pathname !== canonicalInitialPath) {
    window.history.replaceState({ smartGoalPage: currentPage }, "", canonicalInitialPath);
  }
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
  let aiRequestInFlight = false;
  let registerRetryTimer = null;
  let lastTranslatedLanguage = null;
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
      const response = await apiFetch("/api/data", {
        method: "PUT",
        credentials: "include",
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

  const UI_TEXT = {
    welcome: "Bugungi rejalaringizga xush kelibsiz",
    description: "Vaqtingizni samarali boshqaring va natijalarni kuzating.",
    addTask: "Yangi vazifa",
    addGoal: "Yangi maqsad",
    emptyTasks: "Hozircha vazifalar mavjud emas.",
    emptyGoals: "Hozircha maqsadlar mavjud emas."
  };

  function textForUser(key) {
    return UI_TEXT[key] || "";
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
    try{const response=await apiFetch("/api/xp/spend",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:points})});const result=await response.json().catch(()=>({}));if(!response.ok||!result.success)throw new Error(result.message||"XP yechilmadi.");data.xp=Number(result.xpBalance||0);data.spentXP=(Number(data.spentXP)||0)+points;saveData();return true;}
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

    messageElement.textContent = translateUIString(message);
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
            <label class="file-picker file-picker-icon"><span>${icon("camera",19)} Rasm qo‘shish</span><input id="profile-avatar" name="avatar" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPG yoki WEBP. Rasm 2 MB dan kichik bo‘lsin.</small></label>
            <label class="checkbox-label"><input type="checkbox" name="removeAvatar"><span>Profil rasmini olib tashlash</span></label>
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
    const removeAvatar = formData.get("removeAvatar") === "on";
    let avatar = removeAvatar ? "" : (data.profile.avatar || "");
    if (!removeAvatar && file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { showToast("Rasm 2 MB dan kichik bo‘lishi kerak.", "error"); return; }
      try { avatar = await resizeImage(file); } catch { showToast("Rasmni yuklashda xatolik yuz berdi.", "error"); return; }
    }
    if (remoteAuthenticated) {
      try {
        if (!await flushRemoteSync()) throw new Error("Ma’lumotlar serverga saqlanmadi. Qayta urinib ko‘ring.");
        const response = await apiFetch("/api/profile", {method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,username})});
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

  function showRegistrationRetry(seconds) {
    const form = $("#register-form");
    if (!form) return;
    if (registerRetryTimer) clearInterval(registerRetryTimer);
    let status = $("#register-retry-status");
    if (!status) {
      status = document.createElement("p");
      status.id = "register-retry-status";
      status.className = "auth-retry-status";
      const submit = form.querySelector(".auth-submit");
      if (submit) submit.insertAdjacentElement("afterend", status);
      else form.append(status);
    }
    let remaining = Math.max(1, Math.ceil(Number(seconds) || 300));
    const renderTimer = () => {
      const minutes = Math.floor(remaining / 60);
      const secs = String(remaining % 60).padStart(2, "0");
      status.textContent = remaining > 0
        ? "Xavfsizlik uchun kutish: " + minutes + ":" + secs + ". Vaqt tugagach qayta urinishingiz mumkin."
        : "Qayta urinib ko‘rishingiz mumkin.";
    };
    renderTimer();
    registerRetryTimer = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      renderTimer();
      if (!remaining) {
        clearInterval(registerRetryTimer);
        registerRetryTimer = null;
      }
    }, 1000);
  }

  async function registerRemote(form) {
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const birthdate = String(formData.get("birthdate") || "");
    const password = String(formData.get("password") || "");
    const terms = formData.get("terms");
    const age = calculateAge(birthdate);

    const missing=["register-name","register-email","register-birthdate","register-password"].find(id=>!$("#"+id)?.value?.trim());
    if (missing || name.length < 2 || !email || age === null || !terms) {
      const messages={uz:"Iltimos, barcha majburiy maydonlarni to‘ldiring.",ru:"Пожалуйста, заполните все обязательные поля.",en:"Please complete all required fields."};
      (missing?$("#"+missing):(!terms?$("#register-form [name=terms]"):$("#register-birthdate")))?.focus();showToast(messages[settings.language]||messages.uz,"error");
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
      const response = await apiFetch("/api/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, birthdate, password, termsAccepted: true })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        const error = new Error(result.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi.");
        error.retryAfter = Number(result.retryAfter || response.headers.get("Retry-After") || 0);
        throw error;
      }

      remoteAuthenticated = true;
      if(result.token)localStorage.setItem(API_TOKEN_KEY,result.token);
      localStorage.removeItem(SESSION_KEY);
      data = createInitialData();
      data.profile.name = name;
      data.profile.birthdate = birthdate;
      data.profile.age = age;
      data.profile.username = username;
      data.profile.email = email;
      saveSettings();
      saveData();
      showApplication();
      showToast("SmartGoal’ga xush kelibsiz!");
    } catch (error) {
      console.error("SmartGoal registration error:",error); const fallback={uz:"Server bilan aloqa o‘rnatilmadi. Internetni tekshirib qayta urinib ko‘ring.",ru:"Не удалось связаться с сервером. Проверьте интернет и повторите попытку.",en:"Could not reach the server. Check your connection and try again."};showToast(error.message&&error.message!=="Failed to fetch"?error.message:(fallback[settings.language]||fallback.uz),"error");
      if (error.retryAfter > 0) showRegistrationRetry(error.retryAfter);
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
      const response = await apiFetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Kirish amalga oshmadi.");

      remoteAuthenticated = true;
      if(result.token)localStorage.setItem(API_TOKEN_KEY,result.token);
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
    const response = await apiFetch("/api/data", { credentials: "include" });
    if (!response.ok) throw new Error(response.status === 401 ? "Sessiya tugagan. Qayta kiring." : "Ma’lumotlarni yuklab bo‘lmadi.");
    const result = await response.json();
    if (!result.success || !result.data) throw new Error("Serverdan kelgan ma’lumot noto‘g‘ri.");
    localStorage.setItem(DATA_KEY, JSON.stringify(result.data));
    data = loadData();
    const remotePreferences = data.preferences || {};
    ["language","theme","colorTheme","fontSize","sound","reducedMotion","routineReminders"].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(remotePreferences,key) && remotePreferences[key] !== undefined) settings[key] = remotePreferences[key];
    });
    delete remotePreferences.difficulty;
    data.preferences = { ...remotePreferences, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings();
    saveData();
    if (data.profile.birthdate) data.profile.age = calculateAge(data.profile.birthdate);
  }

  async function logout() {
    try {
      await apiFetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.warn("Serverdan chiqish so‘rovi bajarilmadi:", error);
    }
    remoteAuthenticated = false;
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(API_TOKEN_KEY);
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
              const response = await apiFetch("/api/tasks/complete", {
                method: "POST", credentials: "include",
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
        const response = await apiFetch("/api/store/purchase", {method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:id})});
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

  function getActivityStreak() {
    const activeDays=new Set();
    for(const item of (data.activity||[]))if(/^\d{4}-\d{2}-\d{2}$/.test(String(item.date||"")))activeDays.add(String(item.date));
    for(const task of (data.tasks||[])){
      if(!task.completed||!task.completedAt)continue;
      const date=new Date(task.completedAt);
      if(Number.isNaN(date.getTime()))continue;
      const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tashkent",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
      activeDays.add(parts.filter(part=>part.type!=="literal").map(part=>part.value).join("-"));
    }
    const todayParts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tashkent",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
    let cursor=todayParts.filter(part=>part.type!=="literal").map(part=>part.value).join("-");
    const shiftDay=key=>{const date=new Date(key+"T12:00:00Z");date.setUTCDate(date.getUTCDate()-1);return date.toISOString().slice(0,10);};
    if(!activeDays.has(cursor))cursor=shiftDay(cursor);
    let streak=0;
    while(streak<366&&activeDays.has(cursor)){streak++;cursor=shiftDay(cursor);}
    return streak;
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
    const completed = data.tasks.filter(task => task.isRoutineEntry && task.completed).length;
    const activeGoals = data.goals.filter(goal => !goal.completed).length;
    const todayTasks = data.tasks.filter(task => task.isRoutineEntry && task.date === today());
    const completedToday = todayTasks.filter(task => task.completed).length;
    const routineToday = getRoutineProgress(data.dailyRoutine || []);
    const rank = getRank();
    const coachTip = getDailyCoachTip();

    const routineHTML = routineToday.items.length
      ? routineToday.items.slice(0, 5).map(item => {
          const label = item.status === "done" ? "Bajarildi" : item.status === "missed" ? "O‘tkazib yuborildi" : item.status === "no-time" ? "Vaqt yetmadi" : "Kutilmoqda";
          return '<div class="dashboard-routine-row"><time>'+escapeHTML(item.time)+'</time><strong>'+escapeHTML(item.title)+'</strong><span class="routine-status-pill '+(item.status==="done"?"done":["missed","no-time"].includes(item.status)?"missed":"upcoming")+'">'+label+'</span></div>';
        }).join("")
      : emptyState("Kun tartibi hali tuzilmagan", "Birinchi kun tartibi bandingizni qo‘shing.", "calendar-check");

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
            ${actionButton("add-routine", "Kun tartibiga band qo‘shish", "plus")}
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
          <p class="stat-label">Bajarilgan kun tartibi bandlari</p>
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
        <div class="stat-card">
          <div class="stat-top"><span class="stat-icon purple">${icon("flame")}</span></div>
          <p class="stat-label">Faollik zanjiri</p>
          <div class="stat-value">${formatNumber(getActivityStreak())}</div>
          <span class="stat-change">Ketma-ket faol kun</span>
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
                <h3 class="card-title">Bugungi kun tartibim</h3>
                <p class="card-description">${routineToday.completedPercent}% bajarildi · ${routineToday.missedPercent}% bajarilmadi · ${routineToday.completed}/${routineToday.total} ta band</p>
              </div>
              <button class="card-action" type="button" data-page="planner">Batafsil</button>
            </div>
            <div class="dashboard-routine-list">${routineHTML}</div>
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
    const tasks = [...data.tasks].filter(task => !task.isRoutineEntry).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
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

  function getRoutineProgress(routine, date = today()) {
    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
    const savedLogs = data.routineLogs?.[date] || {};
    let autoMarked = false;
    const items = routine.map(item => {
      let saved = savedLogs[item.id];
      if (!saved && String(item.time || "99:99") <= currentTime) {
        if (!data.routineLogs[date]) data.routineLogs[date] = {};
        saved = data.routineLogs[date][item.id] = { status: "missed", updatedAt: new Date().toISOString(), xpEarned: 0, automatic: true };
        autoMarked = true;
      }
      const status = saved?.status || "upcoming";
      return { ...item, status, xpEarned: Number(saved?.xpEarned || 0) };
    });
    if (autoMarked) saveData();
    const total = items.length;
    const completed = items.filter(item => item.status === "done").length;
    const skipped = items.filter(item => item.status === "missed").length;
    const noTime = items.filter(item => item.status === "no-time").length;
    const missed = skipped + noTime;
    return {
      items, total, completed, skipped, noTime, missed,
      completedPercent: total ? Math.round(completed / total * 100) : 0,
      skippedPercent: total ? Math.round(skipped / total * 100) : 0,
      noTimePercent: total ? Math.round(noTime / total * 100) : 0,
      missedPercent: total ? Math.round(missed / total * 100) : 0
    };
  }

  async function setRoutineStatus(id, status) {
    if (!["done","missed","no-time"].includes(status)) return;
    const item = (data.dailyRoutine || []).find(row => row.id === id);
    if (!item) return;
    const day = today();
    if (!data.routineLogs || typeof data.routineLogs !== "object") data.routineLogs = {};
    if (!data.routineLogs[day] || typeof data.routineLogs[day] !== "object") data.routineLogs[day] = {};
    if (data.routineLogs[day][id]?.status === "done") {
      showToast("Bajarilgan band va uning XP bahosi o‘zgartirilmaydi.", "error");
      return;
    }
    if (status !== "done") {
      data.routineLogs[day][id] = { status, updatedAt: new Date().toISOString(), xpEarned: 0 };
      saveData(); render();
      return;
    }
    const existingTask = data.tasks.find(task => task.isRoutineEntry && task.routineId === id && task.date === day);
    const task = existingTask || {
      id: uid(), title: String(item.title || "Kun tartibi bandi").slice(0,100),
      description: ("Kun tartibi: " + String(item.description || item.title || "")).slice(0,500),
      date: day, priority: "medium", estimatedMinutes: Math.max(5,Math.min(480,Number(item.estimatedMinutes||30))),
      goalId: "", completed: false, xpAwarded: false, xpEarned: 0, completedAt: null,
      createdAt: day + "T" + String(item.time || "00:00") + ":00+05:00", isRoutineEntry: true, routineId: id
    };
    if (!existingTask) data.tasks.push(task);
    saveData();
    if (!remoteAuthenticated || !await flushRemoteSync()) {
      if (!existingTask) data.tasks = data.tasks.filter(row => row.id !== task.id);
      saveData(); render();
      showToast("Kun tartibi bandi serverga saqlanmadi. Internetni tekshirib qayta urinib ko‘ring.", "error");
      return;
    }
    await toggleTask(task.id);
    if (!task.completed) {
      if (!existingTask) data.tasks = data.tasks.filter(row => row.id !== task.id);
      saveData(); render();
      return;
    }
    data.routineLogs[day][id] = { status: "done", updatedAt: new Date().toISOString(), taskId: task.id, xpEarned: Number(task.xpEarned || 0) };
    saveData(); render();
  }

  function renderPlanner() {
    const activeGoals = data.goals.filter(goal => !goal.completed);
    const routine = [...(data.dailyRoutine || [])].sort((a,b) => String(a.time).localeCompare(String(b.time)));
    const routineProgress = getRoutineProgress(routine);

    return `
      ${pageHeader("VAQTNI BOSHQARISH","Kun tartibim","Kunlik rejangiz, odatlaringiz va maqsadlaringizni bir joyda boshqaring.")}

      <section class="card routine-card">
        <div class="card-header">
          <div><span class="eyebrow">SIZNING SHAXSIY REJANGIZ</span><h3 class="card-title">Kun tartibim</h3><p class="card-description">Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.</p></div>
          ${actionButton("add-routine","Band qo‘shish","plus")}
        </div>
        <div class="routine-progress-summary">
          <div class="routine-progress-head"><strong>Bugungi bajarilish</strong><span>${routineProgress.completedPercent}% bajarildi</span></div>
          <div class="routine-progress-track"><span class="routine-progress-done" style="width:${routineProgress.completedPercent}%"></span><span class="routine-progress-missed" style="width:${routineProgress.skippedPercent}%"></span><span class="routine-progress-no-time" style="width:${routineProgress.noTimePercent}%"></span></div>
          <div class="routine-progress-legend"><span class="routine-legend-done">${routineProgress.completed} ta · ${routineProgress.completedPercent}% bajarildi</span><span class="routine-legend-missed">${routineProgress.skipped} ta · ${routineProgress.skippedPercent}% o‘tkazildi</span><span class="routine-legend-time">${routineProgress.noTime} ta · ${routineProgress.noTimePercent}% vaqt yetmadi</span><span>${Math.max(0,routineProgress.total-routineProgress.completed-routineProgress.missed)} kutilmoqda</span></div>
        </div>
        <div class="routine-list">
          ${routineProgress.items.length ? routineProgress.items.map(item => {
            const labels = {done:"Bajarildi",missed:"O‘tkazib yuborildi","no-time":"Vaqt yetmadi",upcoming:"Kutilmoqda"};
            const statusClass = item.status === "done" ? "done" : ["missed","no-time"].includes(item.status) ? "missed" : "upcoming";
            return `
              <article class="routine-item routine-item-${statusClass}">
                <time>${escapeHTML(item.time || "--:--")}</time>
                <div class="routine-item-content"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.description || "")}</small><span class="routine-status-pill ${statusClass}">${labels[item.status]}${item.status==="done"?" · +"+item.xpEarned+" XP":""}</span></div>
                <div class="routine-item-actions">
                  ${item.status !== "done" ? `
                    <button class="routine-mark-button routine-mark-done" type="button" data-action="routine-status" data-status="done" data-id="${escapeHTML(item.id)}" title="Bajarildi">✓</button>
                    <button class="routine-mark-button routine-mark-missed" type="button" data-action="routine-status" data-status="missed" data-id="${escapeHTML(item.id)}" title="Bajarilmadi">×</button>
                    <button class="routine-mark-button routine-mark-time" type="button" data-action="routine-status" data-status="no-time" data-id="${escapeHTML(item.id)}" title="Vaqt yetmadi">◷</button>
                  ` : ""}
                  <button class="icon-button" type="button" data-action="edit-routine" data-id="${escapeHTML(item.id)}" aria-label="Tahrirlash">${icon("pencil",15)}</button>
                  <button class="icon-button" type="button" data-action="delete-routine" data-id="${escapeHTML(item.id)}" aria-label="O‘chirish">${icon("trash-2",15)}</button>
                </div>
              </article>`;
          }).join("") : emptyState("Kun tartibi hali tuzilmagan","Masalan, 07:00 — uyg‘onish, 07:15 — badantarbiya kabi bandlar qo‘shing.","sunrise")}
        </div>
        <div class="routine-ai">
          <div><strong>${icon("sparkles",16)} AI bilan kun tartibini tuzish</strong><small>Uyg‘onish vaqtingiz, o‘qish/ish jadvalingiz va odatlaringizni yozing. Eslatmalar sahifa ochiq turganda ishlaydi.</small></div>
          <textarea id="routine-ai-prompt" class="field-textarea" rows="2" maxlength="700" placeholder="Masalan: 07:00 da uyg‘onaman, 08:30 da maktabga ketaman, 14:00 da qaytaman. Kechqurun ingliz tili o‘rganmoqchiman."></textarea>
          <button class="primary-button" type="button" data-action="generate-routine">${icon("sparkles",15)} Menga kun tartibi tuz</button>
          <button class="secondary-button" type="button" data-action="generate-routine-advice">${icon("message-circle-heart",15)} AI maslahat olish</button>
          <div id="routine-ai-advice-output" class="daily-ai-advice-output" aria-live="polite"></div>
          <button class="secondary-button" type="button" data-action="enable-routine-reminders">${icon("bell",15)} ${settings.routineReminders ? "Eslatmalar yoqilgan" : "Vaqtida eslatib tur"}</button>
        </div>
      </section>

remove planner task block      <section class="card" style="margin-top:20px">
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
        <div class="form-field"><label class="field-label">Davomiyligi (daqiqa)</label><input class="field-input" type="number" name="estimatedMinutes" min="5" max="480" step="5" value="${Math.max(5,Math.min(480,Number(item?.estimatedMinutes||30)))}"></div>
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
    const values = { time, title, description: String(fd.get("description") || "").trim().slice(0,180), estimatedMinutes: Math.max(5,Math.min(480,Number(fd.get("estimatedMinutes")||30)||30)) };
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

  async function generateRoutineAdvice() {
    const output = $("#routine-ai-advice-output");
    const button = document.querySelector("[data-action='generate-routine-advice']");
    if (!output) return;
    const language = settings.language;
    const prompts = {
      uz: "Bugungi kun tartibimni va bajarilish holatini tahlil qil. Bajarilgan, o‘tkazib yuborilgan va vaqt yetmagan bandlarni hisobga olib, ertangi kun tartibimni qanday yaxshilashimni ayt. 3 ta aniq, muloyim va amaliy maslahat ber. Muvaffaqiyatsizlik uchun ayblama, ortiqcha bandlarni kamaytir va real vaqt oralig‘ini taklif qil.",
      ru: "Проанализируй мой распорядок и сегодняшнее выполнение. Учти выполненные, пропущенные пункты и пункты, на которые не хватило времени. Дай 3 конкретных и доброжелательных совета, как улучшить расписание на завтра. Не обвиняй, предложи реалистичные интервалы и разумную нагрузку.",
      en: "Review my daily routine and today's completion. Consider completed, missed and time-constrained items. Give 3 practical, supportive recommendations to improve tomorrow's schedule. Do not blame me; suggest realistic time blocks and a sustainable workload."
    };
    output.innerHTML = "<p>AI kun tartibingizni tahlil qilmoqda…</p>";
    if (button) button.disabled = true;
    try {
      const response = await apiFetch("/api/ai", {method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"chat",message:prompts[language]||prompts.uz,language,history:[]})});
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "AI maslahat bera olmadi.");
      output.innerHTML = formatAIMessage(result.answer || "");
    } catch (error) {
      output.textContent = error.message || "AI bilan aloqa uzildi.";
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function generateRoutine() {
    const input = $("#routine-ai-prompt"), prompt = String(input?.value || "").trim();
    if (!prompt) { showToast("Avval kuningiz haqida qisqacha yozing.", "error"); return; }
    const button = document.querySelector("[data-action='generate-routine']");
    if (button) { button.disabled = true; button.textContent = settings.language==="ru"?"AI составляет распорядок...":settings.language==="en"?"AI is building your routine...":"AI reja tuzmoqda..."; }
    try {
      const response = await apiFetch("/api/ai", { method:"POST", credentials:"same-origin", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"routine",prompt,language:settings.language}) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "AI kun tartibini tuza olmadi.");
      const match = String(result.answer || "").match(/\[[\s\S]*\]/);
      if (!match) throw new Error("AI reja formatini tushunib bo‘lmadi. Qayta urinib ko‘ring.");
      const items = JSON.parse(match[0]);
      if (!Array.isArray(items) || !items.length) throw new Error("AI bo‘sh kun tartibi qaytardi.");
      const usedTimes = new Set();
      const cleaned = items.slice(0,14).filter(item => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(item.time || "")) && String(item.title || "").trim().length >= 2 && !usedTimes.has(item.time) && usedTimes.add(item.time)).map(item => ({id:uid(),time:item.time,title:String(item.title).slice(0,90),description:String(item.description || "").slice(0,180),estimatedMinutes:Math.max(5,Math.min(480,Number(item.estimatedMinutes||30)||30))}));
      if (!cleaned.length) throw new Error("AI yaratgan vaqtlar noto‘g‘ri formatda.");
      const existing = Array.isArray(data.dailyRoutine) ? data.dailyRoutine : [];
      const minuteOf = value => {
        const parts = String(value || "").split(":").map(Number);
        return parts.length === 2 && parts.every(Number.isFinite) ? parts[0] * 60 + parts[1] : -1;
      };
      const durationOf = item => Math.max(5, Math.min(480, Number(item.estimatedMinutes || 30) || 30));
      const overlaps = (first, second) => {
        const firstStart = minuteOf(first.time), secondStart = minuteOf(second.time);
        if (firstStart < 0 || secondStart < 0) return true;
        const firstEnd = firstStart + durationOf(first), secondEnd = secondStart + durationOf(second);
        return firstStart < secondEnd && secondStart < firstEnd;
      };
      const additions = [];
      for (const candidate of cleaned) {
        if (candidate.time && minuteOf(candidate.time) + durationOf(candidate) > 1440) continue;
        if (existing.some(item => overlaps(candidate, item)) || additions.some(item => overlaps(candidate, item))) continue;
        additions.push(candidate);
      }
      if (!additions.length) throw new Error("AI takliflari mavjud mashg‘ulotlar bilan vaqt jihatidan to‘qnashdi. Boshqa vaqt oralig‘ini kiriting.");
      data.dailyRoutine = [...existing, ...additions].sort((a,b) => a.time.localeCompare(b.time));
      saveData(); render(); showToast("Mavjud bandlaringiz saqlandi, AI yangi mashg‘ulotlarni qo‘shdi.");
    } catch (error) { showToast(error.message || "AI xatolik berdi.", "error"); }
    finally { if (button) { button.disabled = false; button.innerHTML = icon("sparkles",15) + " Menga kun tartibi tuz"; translateVisibleUI(button); refreshIcons(); } }
  }

  /* -------------------- ANALYTICS PAGE -------------------- */

  function renderAnalytics() {
    const routineTasks = data.tasks.filter(task => task.isRoutineEntry);
    const completed = routineTasks.filter(task => task.completed).length;
    const total = routineTasks.length;
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
        <div class="stat-card">
          <p class="stat-label">Faollik zanjiri</p>
          <div class="stat-value">${formatNumber(getActivityStreak())} kun</div>
          <span class="stat-change">Ketma-ket faol kun</span>
        </div>
        <div class="stat-card">
          <p class="stat-label">Bajarilgan ishlar vaqti</p>
          <div class="stat-value">${Math.floor(data.tasks.filter(task=>task.completed).reduce((sum,task)=>sum+Math.max(0,Math.min(480,Number(task.estimatedMinutes)||0)),0)/60)} soat</div>
          <span class="stat-change">Vazifalarga rejalashtirilgan vaqt</span>
        </div>
        <div class="stat-card">
          <p class="stat-label">Qolgan vazifalar</p>
          <div class="stat-value">${data.tasks.filter(task=>!task.completed).length}</div>
          <span class="stat-change">Bajarilishi kutilayotgan ishlar</span>
        </div>
        <div class="stat-card">
          <p class="stat-label">Maqsadlar o‘rtacha progressi</p>
          <div class="stat-value">${data.goals.length?Math.round(data.goals.reduce((sum,goal)=>sum+getGoalProgress(goal).progress,0)/data.goals.length):0}%</div>
          <span class="stat-change">Barcha maqsadlar bo‘yicha</span>
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
            <h3 class="card-title">Mening yutuqlarim va esdaliklarim</h3>
            <p class="card-description">Rasm, sarlavha va izoh bilan o‘zingiz uchun muhim natijalarni saqlang.</p>
          </div>
        </div>

        ${memories.length ? visibleMemories.map(memory => `
          <article class="notification-item">
            <div class="achievement-icon">${icon(memory.type === "certificate" ? "file-badge" : "bookmark", 20)}</div>
            <div>
              <strong>${escapeHTML(memory.title)}</strong>
              ${memory.image ? `<img class="memory-image" src="${escapeHTML(memory.image)}" alt="${escapeHTML(memory.title)}" loading="lazy" decoding="async">` : ""}
              <p>${escapeHTML(memory.description || "")}</p>
              <small>${escapeHTML(formatDate(memory.date))} · ${memory.visibility === "public" ? "Hammaga ko‘rinadi" : "Faqat menga ko‘rinadi"}</small>
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
            <label class="file-picker"><span>${icon("image-plus",18)} Rasm tanlash</span><input type="file" name="image" accept="image/png,image/jpeg,image/webp"><small>PNG, JPG yoki WEBP · 4 MB gacha</small></label>
            <small>Sertifikat yoki esdalik rasmini qo‘shing. Rasm avtomatik kichraytiriladi.</small>
          </div>
          <div class="form-field full-width">
            <label class="field-label" for="memory-visibility">Kimlar ko‘ra oladi?</label>
            <select class="field-select" id="memory-visibility" name="visibility"><option value="private">Faqat men</option><option value="public">Hammaga ochiq</option></select>
            <small>Shaxsiy xotiralar odatiy holatda faqat sizga ko‘rinadi.</small>
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
      image,
      visibility: String(fd.get("visibility") || "private") === "public" ? "public" : "private"
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
          return `<article class="store-item" id="store-item-${escapeHTML(item.id)}"><div class="store-preview">${icon(item.icon,45)}</div><div class="store-content"><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description)}</p><div class="store-price"><strong>${formatNumber(item.price)} XP</strong>${owned ? `<button class="secondary-button" type="button" data-action="use-item" data-id="${escapeHTML(item.id)}">Qo‘llash</button>` : `<button class="primary-button" type="button" data-action="buy-item" data-id="${escapeHTML(item.id)}" ${canAfford?"":"disabled"}>${canAfford?"Xarid":"XP yetarli emas"}</button>`}</div></div></article>`;
        }).join("") || emptyState("Bu kategoriyada mahsulot yo‘q","Boshqa kategoriyani tanlang.","package")}
      </div>
      <section class="card" style="margin-top:22px"><h3 class="card-title">Sizning kolleksiyangiz</h3><p class="card-description">Sotib olgan mahsulotlaringiz shu yerda saqlanadi.</p><div class="badge-grid" style="margin-top:16px">
        ${data.inventory.length ? data.inventory.map(owned => { const item=STORE_ITEMS.find(product=>product.id===owned.id); return item ? `<div class="achievement-card"><div class="achievement-icon">${icon(item.icon,22)}</div><strong>${escapeHTML(item.name)}</strong><button class="card-action" type="button" data-action="use-item" data-id="${escapeHTML(item.id)}">Qo‘llash</button></div>` : ""; }).join("") : emptyState("Kolleksiyangiz hozircha bo‘sh","Do‘kondan birinchi mahsulotingizni xarid qiling.","package")}
      </div></section>
    `;
  }

  /* -------------------- COMMUNITY PAGE -------------------- */

  function renderCommunity() {
    setTimeout(loadCommunityLeaderboard, 0);
    return `
      ${pageHeader("HAMJAMIYAT", "Foydalanuvchilar", "Foydalanuvchilarni qidiring, faol a’zolarni ko‘ring va profillarini oching.")}
      <section class="card community-hub">
        <nav class="community-tabs" aria-label="Hamjamiyat bo‘limlari">
          <button class="community-tab active" type="button" data-community-tab="search">${icon("search",16)} Qidiruv</button>
          <button class="community-tab" type="button" data-community-tab="active">${icon("activity",16)} Faol foydalanuvchilar</button>
        </nav>
        <div class="community-panel" data-community-panel="search">
          <div class="form-field"><label class="field-label" for="community-search">Username bo‘yicha qidirish</label><div class="input-wrap">${icon("search")}<input id="community-search" type="search" placeholder="@username" autocomplete="off"></div><small>Kamida 3 ta belgi kiriting. Mos foydalanuvchilarni tanlab, profilini ko‘rishingiz mumkin.</small></div>
          <div id="community-results" class="community-results">${emptyState("Qidiruvga tayyor", "Username kiriting. Foydalanuvchilar ro‘yxati server orqali topiladi.", "users")}</div>
        </div>
        <div class="community-panel hidden" data-community-panel="active">
          <div class="community-panel-heading"><div><h3>Faol foydalanuvchilar</h3><p>Hamjamiyatdagi eng faol a’zolar XP natijasi bo‘yicha.</p></div><button class="card-action" type="button" data-action="refresh-leaderboard">${icon("refresh-cw",14)} Yangilash</button></div>
          <div id="community-leaderboard" class="community-active-list">${communityLeaderboard.length ? communityLeaderboard.map(user=>`<div class="leaderboard-row"><span class="leaderboard-rank">#${user.rank}</span><div class="leaderboard-user"><button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(user.username)}"><strong>${escapeHTML(user.name)}</strong></button><small>@${escapeHTML(user.username)} · Level ${getRank(Number(user.totalEarnedXP||0)).level}</small></div><strong class="leaderboard-xp">${formatNumber(user.totalEarnedXP)} XP</strong></div>`).join("") : emptyState("Ro‘yxat yuklanmoqda","Faol a’zolar ro‘yxati olinmoqda.","activity")}</div>
          <p class="community-note">Reyting jami ishlab topilgan XP asosida tuzilgan.</p>
        </div>
      </section>
    `;
  }

  /* -------------------- AI PAGE -------------------- */

  function formatAIMessage(value) {
    const decoded = String(value || "").replace(/\\([*_#])/g, "$1").replace(/&#(?:x([0-9a-f]{1,6})|(\\d+));/gi, (match, hex, decimal) => { const code = hex ? parseInt(hex, 16) : Number(decimal); return Number.isInteger(code) && code >= 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : match; }).replace(/&nbsp;/gi, " ");
    const source = escapeHTML(decoded).replace(/\r\n?/g, "\n");
    const inline = line => line
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    const output = [];
    let paragraph = [], listType = "";
    const closeList = () => { if (listType) { output.push("</" + listType + ">"); listType = ""; } };
    const flushParagraph = () => { if (paragraph.length) { output.push("<p>" + inline(paragraph.join(" ")) + "</p>"); paragraph = []; } };
    for (const rawLine of source.split("\n")) {
      const line = rawLine.trim();
      if (!line) { flushParagraph(); closeList(); continue; }
      const heading = line.match(/^#{1,3}\s+(.+)$/);
      const ordered = line.match(/^\d+[.)]\s+(.+)$/);
      const bullet = line.match(/^[-•]\s+(.+)$/);
      if (heading) { flushParagraph(); closeList(); output.push("<h3>" + inline(heading[1]) + "</h3>"); continue; }
      if (ordered || bullet) {
        flushParagraph();
        const nextType = ordered ? "ol" : "ul";
        if (listType !== nextType) { closeList(); output.push("<" + nextType + ">"); listType = nextType; }
        output.push("<li>" + inline((ordered || bullet)[1]) + "</li>");
        continue;
      }
      closeList();
      paragraph.push(line);
    }
    flushParagraph(); closeList();
    return output.join("");
  }

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
    const openTasks=data.tasks.filter(task=>!task.completed&&!task.isRoutineEntry).length;
    return `
      ${pageHeader("SHAXSIY YORDAMCHI","Smart AI","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.")}
      <section class="ai-panel"><span class="eyebrow">SMARTGOAL INTELLIGENCE</span><h2>Har kuni yaxshiroq natija sari.</h2><p>AI maqsadlaringiz, vazifalaringiz va kun tartibingizni hisobga olib, amaliy maslahat beradi. Boshqa mavzularda ham bemalol so‘rashingiz mumkin.</p><div class="ai-context-pills"><span>${icon("target",14)} ${activeGoals} faol maqsad</span><span>${icon("list-checks",14)} ${openTasks} bajarilmagan vazifa</span><span>${icon("calendar-clock",14)} ${(data.dailyRoutine||[]).length} kun tartibi bandi</span></div></section>
      <section class="card ai-chat-card" style="margin-top:20px">
        <div class="card-header"><div><h3 class="card-title">AI bilan suhbat</h3><p class="card-description">AI siz yozgan tilda javob beradi.</p></div><button class="card-action" type="button" data-action="clear-ai-chat">Suhbatni tozalash</button></div>
        <div class="ai-quick-prompts"><button type="button" data-ai-prompt="${escapeHTML(quick.today)}">Bugungi rejam</button><button type="button" data-ai-prompt="${escapeHTML(quick.routine)}">Kun tartibim</button><button type="button" data-ai-prompt="${escapeHTML(quick.tasks)}">Vazifalarim</button><button type="button" data-ai-prompt="${escapeHTML(quick.motivation)}">Motivatsiya</button></div>
        <div class="ai-chat" id="ai-chat" aria-live="polite">${messages.map(item=>'<div class="ai-message '+(item.role==="user"?"user":"")+'">'+(item.role==="user"?escapeHTML(item.content):formatAIMessage(item.content))+'</div>').join("")}</div>
        <form id="ai-form" class="ai-input-row" style="margin-top:18px"><input name="message" placeholder="Savolingizni yozing..." maxlength="500" required autocomplete="off"><button class="primary-button" type="submit" aria-label="Yuborish">${icon("send",16)}</button></form>
      </section>`;
  }

  async function sendAIMessage(form) {
    if (aiRequestInFlight) return;
    const input = form.elements.message;
    const message = String(input?.value || "").trim();
    const chat = $("#ai-chat");
    if (!message || !chat) return;

    aiRequestInFlight = true;
    aiConversation.push({ role: "user", content: message });
    aiConversation = aiConversation.slice(-12);
    const typingText = settings.language === "ru" ? "AI печатает..." : settings.language === "en" ? "AI is typing..." : "AI javob yozmoqda...";
    chat.insertAdjacentHTML("beforeend",
      '<div class="ai-message user">' + escapeHTML(message) + '</div><div class="ai-message" id="ai-typing">' + escapeHTML(typingText) + '</div>');
    if (input) input.disabled = true;
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = true;
    chat.scrollTop = chat.scrollHeight;

    const trimChat = () => {
      const bubbles = chat.querySelectorAll(".ai-message");
      for (let index = 0; index < bubbles.length - 12; index++) bubbles[index].remove();
    };

    try {
      const response = await apiFetch("/api/ai", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", message, history: aiConversation.slice(0, -1), language: settings.language })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "AI bilan bog‘lanib bo‘lmadi.");
      const answer = String(result.answer || "").trim();
      if (!answer) throw new Error("AI bo‘sh javob qaytardi. Qayta urinib ko‘ring.");
      aiConversation.push({ role: "assistant", content: answer });
      aiConversation = aiConversation.slice(-12);
      $("#ai-typing")?.remove();
      chat.insertAdjacentHTML("beforeend", '<div class="ai-message">' + formatAIMessage(answer) + '</div>');
      trimChat();
    } catch (error) {
      $("#ai-typing")?.remove();
      if (aiConversation.at(-1)?.role === "user" && aiConversation.at(-1)?.content === message) aiConversation.pop();
      const errorText = error.message || "AI hozircha javob bera olmadi.";
      chat.insertAdjacentHTML("beforeend", '<div class="ai-message ai-message-error">' + escapeHTML(errorText) + '</div>');
      trimChat();
    } finally {
      aiRequestInFlight = false;
      if (input) { input.disabled = false; input.focus(); }
      if (submit) submit.disabled = false;
      chat.scrollTop = chat.scrollHeight;
    }
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
      const response=await apiFetch("/api/ai",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"chat",message:prompts[settings.language]||prompts.uz,language:settings.language,history:[]})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.success)throw new Error(result.message||"AI maslahat bera olmadi.");
      output.innerHTML=formatAIMessage(result.answer);
    }catch(error){output.textContent=error.message||"AI bilan aloqa uzildi.";}
    finally{if(button)button.disabled=false;}
  }

  async function generateAIPlan() {
    const output=$("#ai-plan-output"),button=document.querySelector("[data-action='generate-ai-plan']");if(!output)return;if(button)button.disabled=true;output.textContent=settings.language==="ru"?"AI анализирует ваши цели и задачи...":settings.language==="en"?"AI is analyzing your goals and tasks...":"AI maqsadlaringiz va vazifalaringizni tahlil qilmoqda...";
    try{const response=await apiFetch("/api/ai",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"plan",language:settings.language})});const result=await response.json().catch(()=>({}));if(!response.ok||!result.success)throw new Error(result.message||"AI reja tuza olmadi.");output.innerHTML=formatAIMessage(result.answer);}
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
        <div class="card-header notification-toolbar">
          <div><h3 class="card-title">Barcha bildirishnomalar</h3><p class="card-description">${data.notifications.length} ta xabar · ${unreadCount()} ta o‘qilmagan</p></div>
          <button class="primary-button" type="button" data-action="mark-all-read" ${unreadCount()?"":"disabled"}>${icon("check-check",16)} Barchasini o‘qilgan qilish</button>
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
    const customizationScore = [Boolean(profile.avatar), Boolean(String(profile.bio || "").trim()), profile.background && profile.background !== "default", profile.avatarFrame && profile.avatarFrame !== "default", Boolean(profile.activeBadge)].filter(Boolean).length;

    const backgroundStyles = {
      default: "linear-gradient(120deg,#5145cf,#9282f6)",
      midnight: "linear-gradient(120deg,#101827,#283958)",
      galaxy: "radial-gradient(circle at 80% 20%,#7256c9,#161b43 65%)",
      royal: "linear-gradient(120deg,#7c4a20,#d3a24b)",
      sakura: "linear-gradient(120deg,#e7a5bd,#8b6bba)",
      nebula: "radial-gradient(circle at 25% 25%,#a35ac8,#111b3c 70%)",
      aurora: "linear-gradient(130deg,#123d43,#5b4a9a 55%,#a3d5c6)",
      forest: "linear-gradient(130deg,#102f26,#39745a 55%,#b4c99a)",
      sunrise: "linear-gradient(130deg,#713f57,#e18c70 55%,#f5d99a)",
      coral: "linear-gradient(130deg,#7c3448,#e57e73 55%,#ffd0a6)",
      ember: "linear-gradient(130deg,#271d2e,#8b3c36 55%,#f1a15a)",
      ocean: "linear-gradient(130deg,#092d46,#167a9b 55%,#75c8d8)",
      mountain: "linear-gradient(130deg,#27384c,#71879a 55%,#c9d4d8)",
      "aurora-night": "linear-gradient(130deg,#071d32,#265b68 55%,#7d67a8)"
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
        <small class="profile-decoration-score">Profil bezagi: ${customizationScore} / 5</small>
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
            <strong>${customizationScore} / 5</strong>
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
          <button type="button" class="${currentSettingsTab === "sound" ? "active" : ""}" data-settings-tab="sound">${icon("volume-2")} Ovoz</button>
          <button type="button" class="${currentSettingsTab === "data" ? "active" : ""}" data-settings-tab="data">${icon("database")} Ma’lumotlar</button>
        </nav>

        <div class="settings-panel">
          ${renderSettingsPanel()}
        </div>
      </div>
    `;
  }

  function renderSettingsPanel() {
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
              ${["violet", "ocean", "sky", "emerald", "sunset", "rose", "lavender", "mint", "graphite", "ice", "amber"].map(theme => {
                const free = theme === "violet";
                const owned = data.inventory.some(item => item.id === `theme-${theme}`);
                const available = free || owned;
                return `
                  <button type="button"
                    class="theme-option ${settings.colorTheme === theme ? "active" : ""}"
                    data-color-theme="${theme}"
                    data-action="${available ? "set-theme" : "locked-theme"}"
                    title="${theme}${available ? "" : " — do‘kondan xarid qiling"}" aria-label="${theme}${available ? " — ochilgan" : " — qulflangan"}">
                    ${icon(available ? "check" : "lock",14)}
                  </button>
                `;
              }).join("")}
            </div>
          </div>
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
            <button class="toggle ${settings.sound ? "active" : ""}" type="button" role="switch" aria-checked="${settings.sound}" data-action="toggle-sound" aria-label="Ovoz sozlamasi"><span class="toggle-state">${settings.sound ? "ON" : "OFF"}</span></button>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Kamaytirilgan animatsiya</strong><small>Harakatlar sonini kamaytirish.</small></div>
            <button class="toggle ${settings.reducedMotion ? "active" : ""}" type="button" role="switch" aria-checked="${settings.reducedMotion}" data-action="toggle-motion"><span class="toggle-state">${settings.reducedMotion ? "ON" : "OFF"}</span></button>
          </div>
        </div>
      `;
    }

    if (currentSettingsTab === "data") {
      return `
        <div class="settings-section">
          <h3>Ma’lumotlaringiz</h3>
          <p>Kerakli bo‘limlarni alohida tozalang. XP balansi va do‘kondan xarid qilingan buyumlar himoyalangan.</p>

          <div class="setting-row">
            <div class="setting-info"><strong>Ma’lumotlarni eksport qilish</strong><small>Profil, vazifalar va maqsadlarni JSON faylga saqlash.</small></div>
            <button class="secondary-button" type="button" data-action="export-data">${icon("download")} Eksport</button>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Zaxira nusxasini tiklash</strong><small>Oldin saqlangan SmartGoal faylini yuklash.</small></div>
            <button class="secondary-button" type="button" data-action="import-data">${icon("upload")} Import</button>
          </div>

          <div class="setting-row">
            <div class="setting-info"><strong>Ma’lumotlarni o‘chirish</strong><small>Vazifa, maqsad, kun tartibi va boshqa bo‘limlarni tanlab o‘chirish.</small></div>
            <button class="secondary-button" type="button" data-action="reset-data">${icon("trash-2")} Tozalash</button>
          </div>

          <div class="setting-row settings-reset-row">
            <div class="setting-info"><strong>Sozlamalarni asliga qaytarish</strong><small>Til, kun/tun rejimi, rang mavzusi, matn hajmi, ovoz va animatsiyalar tiklanadi.</small></div>
            <button class="secondary-button" type="button" data-action="reset-preferences">Asliga qaytarish</button>
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
      "Qaysi ma’lumotlarni o‘chirmoqchisiz?",
      `
        <p>O‘chiriladigan bo‘limlarni tanlang. XP balansi, daraja uchun yig‘ilgan XP va do‘kondan sotib olingan barcha buyumlar hech qachon o‘chirilmaydi.</p>
        <div class="data-delete-options">
          <label><input type="checkbox" data-delete-scope="all" value="all"> <strong>Barchasi</strong></label>
          <label><input type="checkbox" data-delete-scope value="tasks"> Vazifalar</label>
          <label><input type="checkbox" data-delete-scope value="goals"> Maqsadlar</label>
          <label><input type="checkbox" data-delete-scope value="dailyRoutine"> Kun tartibi va bajarilish tarixi</label>
          <label><input type="checkbox" data-delete-scope value="plans"> Rejalar</label>
          <label><input type="checkbox" data-delete-scope value="achievements"> Yutuqlar</label>
          <label><input type="checkbox" data-delete-scope value="memories"> Saqlangan eslatmalar</label>
          <label><input type="checkbox" data-delete-scope value="notifications"> Bildirishnomalar</label>
          <label><input type="checkbox" data-delete-scope value="activity"> Faollik tarixi</label>
        </div>
      `,
      `
        <button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="primary-button" type="button" data-action="confirm-clear-selected">Tanlanganlarni o‘chirish</button>
      `
    );
  }

  function clearSelectedData() {
    const selected = new Set(Array.from(document.querySelectorAll("#modal-body [data-delete-scope]:checked"), input => input.value));
    const clearAll = selected.has("all");
    if (!selected.size) { showToast("Avval o‘chiriladigan bo‘limni tanlang.", "error"); return; }
    const scopes = clearAll
      ? ["tasks","goals","dailyRoutine","plans","achievements","memories","notifications","activity"]
      : [...selected];
    if (scopes.includes("tasks")) data.tasks = [];
    if (scopes.includes("goals")) data.goals = [];
    if (scopes.includes("dailyRoutine")) { data.dailyRoutine = []; data.routineLogs = {}; data.tasks = data.tasks.filter(task => !task.isRoutineEntry); }
    if (scopes.includes("plans")) { data.plans = []; data.aiPlans = []; }
    if (scopes.includes("achievements")) data.achievements = [];
    if (scopes.includes("memories")) data.memories = [];
    if (scopes.includes("notifications")) data.notifications = [];
    if (scopes.includes("activity")) data.activity = [];
    data.xp = Number(data.xp || 0);
    data.spentXP = Number(data.spentXP || 0);
    data.inventory = Array.isArray(data.inventory) ? data.inventory : [];
    saveData();
    closeModal();
    render();
    showToast("Tanlangan ma’lumotlar o‘chirildi. XP va xaridlaringiz saqlandi.");
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
      "Maqsad qo‘shish":"Добавить цель","Yangi maqsad":"Новая цель","Vazifa qo‘shish":"Добавить задачу","Yangi vazifa":"Новая задача","Saqlash":"Сохранить","Bekor qilish":"Отмена","O‘chirish":"Удалить","Tahrirlash":"Изменить","Bugungi vazifalar":"Задачи на сегодня","Barcha vazifalar":"Все задачи","Maqsadlar":"Цели","Faol maqsadlar":"Активные цели","Yakunlangan":"Завершено","O‘rtacha progress":"Средний прогресс","Jami XP":"Всего XP","Bu haftadagi XP":"XP за неделю","Bajarilgan vazifalar":"Выполненные задачи","Bajarilish foizi":"Процент выполнения","Kun tartibim":"Мой распорядок дня","Band qo‘shish":"Добавить пункт","Menga kun tartibi tuz":"Составить распорядок","Vaqtida eslatib tur":"Напоминать вовремя","Yutuq qo‘shish":"Добавить достижение","Shaxsiy xotiralar":"Личные воспоминания","Xarid":"Купить","Qo‘llash":"Применить","XP yetarli emas":"Недостаточно XP","Yorug‘":"Светлая","Qorong‘i":"Тёмная","Qurilma bo‘yicha":"Как на устройстве","Umumiy sozlamalar":"Общие настройки","Interfeys tili":"Язык интерфейса","Profilni tahrirlash":"Редактировать профиль","Username":"Имя пользователя","Tug‘ilgan sana":"Дата рождения","Qisqa mazmuni":"Краткое описание","Vazifa nomi":"Название задачи","Qaysi kuni bajariladi?":"Когда выполнить?","Vaqt":"Время","Nima qilasiz?":"Что будете делать?","Foydalanuvchilar":"Пользователи","Qidirilmoqda...":"Поиск...","Foydalanuvchi topilmadi":"Пользователь не найден","Kunlik reja":"План на день","AI reja tuzsin":"Пусть AI составит план","Maqsadlar asosida tavsiyalar":"Рекомендации по целям","Shaxsiy yordamchi":"Личный помощник","AI bilan suhbat":"Чат с AI","Profil statistikasi":"Статистика профиля","Sizning darajangiz":"Ваш уровень","Kolleksiyangiz hozircha bo‘sh":"Коллекция пока пуста"
    },
    en: {
      "Bosh sahifa":"Home","Maqsadlarim":"My goals","Vazifalar":"Tasks","Rejalashtiruvchi":"Planner","Statistika":"Statistics","Yutuqlarim":"My achievements","Mukofotlar do‘koni":"Rewards shop","Hamjamiyat":"Community","Smart AI":"Smart AI","Bildirishnomalar":"Notifications","Sozlamalar":"Settings","Mening profilim":"My profile",
      "Maqsad qo‘shish":"Add goal","Yangi maqsad":"New goal","Vazifa qo‘shish":"Add task","Yangi vazifa":"New task","Saqlash":"Save","Bekor qilish":"Cancel","O‘chirish":"Delete","Tahrirlash":"Edit","Bugungi vazifalar":"Today's tasks","Barcha vazifalar":"All tasks","Maqsadlar":"Goals","Faol maqsadlar":"Active goals","Yakunlangan":"Completed","O‘rtacha progress":"Average progress","Jami XP":"Total XP","Bu haftadagi XP":"XP this week","Bajarilgan vazifalar":"Completed tasks","Bajarilish foizi":"Completion rate","Kun tartibim":"My daily routine","Band qo‘shish":"Add item","Menga kun tartibi tuz":"Build my routine","Vaqtida eslatib tur":"Remind me on time","Yutuq qo‘shish":"Add achievement","Shaxsiy xotiralar":"Personal memories","Xarid":"Buy","Qo‘llash":"Apply","XP yetarli emas":"Not enough XP","Yorug‘":"Light","Qorong‘i":"Dark","Qurilma bo‘yicha":"System default","Umumiy sozlamalar":"General settings","Interfeys tili":"Interface language","Profilni tahrirlash":"Edit profile","Username":"Username","Tug‘ilgan sana":"Birthday","Qisqa mazmuni":"Short description","Vazifa nomi":"Task title","Qaysi kuni bajariladi?":"Due date","Vaqt":"Time","Nima qilasiz?":"What will you do?","Foydalanuvchilar":"Users","Qidirilmoqda...":"Searching...","Foydalanuvchi topilmadi":"User not found","Kunlik reja":"Daily plan","AI reja tuzsin":"Generate AI plan","Maqsadlar asosida tavsiyalar":"Goal-based suggestions","Shaxsiy yordamchi":"Personal assistant","AI bilan suhbat":"Chat with AI","Profil statistikasi":"Profile statistics","Sizning darajangiz":"Your level","Kolleksiyangiz hozircha bo‘sh":"Your collection is empty"
    }
  };

  Object.assign(UI_TRANSLATIONS.ru, {
    "Bugun nimaga erishamiz?":"Чего достигнем сегодня?","Kichik qadamlar katta natijalarga olib boradi.":"Маленькие шаги приводят к большим результатам.","Rivojlanishingizni boshqarishni davom ettiring":"Продолжайте управлять своим развитием","Ustuvor vazifalarni belgilang, jarayonni kuzating va natijaga erishing.":"Определяйте приоритеты, следите за процессом и достигайте результата.","Buguncha vazifalar yo‘q":"На сегодня задач нет","Maqsadlar hali yo‘q":"Пока нет целей","Faollik grafigi":"График активности","So‘nggi 7 kun ichidagi to‘plangan XP":"XP за последние 7 дней","Batafsil":"Подробнее","Qo‘shish":"Добавить","Hozirgi rivojlanish jarayoni":"Текущий прогресс","Darajamni ko‘rish":"Посмотреть мой уровень","Umumiy natijalar":"Общие результаты","Xaridlar":"Покупки","Yaratilgan maqsadlar soni":"Количество созданных целей","Sertifikatlar, muhim kunlar va esdaliklar.":"Сертификаты, важные дни и воспоминания.","Sizning kolleksiyangiz":"Ваша коллекция","Umumiy":"Общие","Ko‘rinish":"Внешний вид","Murakkablik":"Сложность","Ovoz":"Звук","Ma’lumotlar":"Данные","Matn o‘lchami":"Размер текста","Kichik":"Маленький","O‘rtacha":"Средний","Katta":"Большой","Yangi yutuq yoki xotira":"Новое достижение или воспоминание","Sarlavha":"Заголовок","Tavsif":"Описание","Turi":"Тип","Sana":"Дата","Shaxsiy xotira":"Личное воспоминание","Sertifikat":"Сертификат","Muhim natija":"Важный результат","Profilni ulashish":"Поделиться профилем","Yutuq rasmi (ixtiyoriy)":"Фото достижения (необязательно)","Tug‘ilgan kunim va yoshim profilimda hammaga ko‘rinsin":"Показывать мой день рождения и возраст в профиле","AI bilan maslahatlashish":"Обсудить с AI"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Bugun nimaga erishamiz?":"What will we achieve today?","Kichik qadamlar katta natijalarga olib boradi.":"Small steps lead to big results.","Rivojlanishingizni boshqarishni davom ettiring":"Keep managing your growth","Ustuvor vazifalarni belgilang, jarayonni kuzating va natijaga erishing.":"Set priorities, track your progress and reach your goals.","Buguncha vazifalar yo‘q":"No tasks for today","Maqsadlar hali yo‘q":"No goals yet","Faollik grafigi":"Activity chart","So‘nggi 7 kun ichidagi to‘plangan XP":"XP earned over the last 7 days","Batafsil":"Details","Qo‘shish":"Add","Hozirgi rivojlanish jarayoni":"Current progress","Darajamni ko‘rish":"View my level","Umumiy natijalar":"Overall results","Xaridlar":"Purchases","Yaratilgan maqsadlar soni":"Number of goals created","Sertifikatlar, muhim kunlar va esdaliklar.":"Certificates, important days and memories.","Sizning kolleksiyangiz":"Your collection","Umumiy":"General","Ko‘rinish":"Appearance","Murakkablik":"Difficulty","Ovoz":"Sound","Ma’lumotlar":"Data","Matn o‘lchami":"Text size","Kichik":"Small","O‘rtacha":"Medium","Katta":"Large","Yangi yutuq yoki xotira":"New achievement or memory","Sarlavha":"Title","Tavsif":"Description","Turi":"Type","Sana":"Date","Shaxsiy xotira":"Personal memory","Sertifikat":"Certificate","Muhim natija":"Milestone","Profilni ulashish":"Share profile","Yutuq rasmi (ixtiyoriy)":"Achievement photo (optional)","Tug‘ilgan kunim va yoshim profilimda hammaga ko‘rinsin":"Show my birthday and age on my profile","AI bilan maslahatlashish":"Ask AI"
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "REJALARINGIZ":"ВАШИ ПЛАНЫ","Katta natijalarga kichik qadamlar orqali erishing.":"Достигайте больших результатов маленькими шагами.","Jami maqsadlar":"Всего целей","O‘rtacha progress":"Средний прогресс","Maqsad tavsifi kiritilmagan":"Описание цели не добавлено","Muddat belgilanmagan":"Срок не указан","Vazifalarni shu maqsadga bog‘lab, rivojlanishni kuzating.":"Свяжите задачи с этой целью и отслеживайте прогресс.","Yana":"Осталось","kun":"дней","KUNLIK REJA":"ПЛАН НА ДЕНЬ","Vazifalaringizni tartibga soling va bajarilganlarini belgilang.":"Упорядочивайте задачи и отмечайте выполненные.","Vazifalar mavjud emas":"Задач пока нет","Yangi vazifa qo‘shib rejangizni boshlang.":"Добавьте первую задачу, чтобы начать планирование.","VAQTNI BOSHQARISH":"УПРАВЛЕНИЕ ВРЕМЕНЕМ","Kunlik rejangiz, odatlaringiz va maqsadlaringizni bir joyda boshqaring.":"Управляйте распорядком, привычками и целями в одном месте.","SIZNING SHAXSIY REJANGIZ":"ВАШ ЛИЧНЫЙ ПЛАН","Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.":"Назначьте время каждому делу. AI поможет составить план.","AI bilan kun tartibini tuzish":"Составить распорядок с AI","Uyg‘onish vaqtingiz, o‘qish/ish jadvalingiz va odatlaringizni yozing.":"Укажите время пробуждения, учёбы/работы и привычки.","Bugungi vazifalar":"Задачи на сегодня","Maqsadlar asosida tavsiyalar":"Рекомендации по целям","AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.":"AI проанализирует ваши цели и задачи и составит практичный план.","NATIJALARINGIZ":"ВАШИ РЕЗУЛЬТАТЫ","Faolligingiz va rivojlanishingizni tahlil qiling.":"Анализируйте активность и прогресс.","Haftalik faollik":"Активность за неделю","Har kuni to‘plangan XP":"XP за каждый день","Maqsadlar sari bosib o‘tilgan yo‘l":"Путь к вашим целям","Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.":"Выполненные задачи и оставшиеся шаги для каждой цели.","Yutuqlarim":"Мои достижения","Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.":"Сохраняйте важные дни, сертификаты и личные достижения.","SmartGoal yutuqlari":"Достижения SmartGoal","ta ochilgan":"открыто","Hali ochilmagan":"Пока не открыто","Xotiralar hali yo‘q":"Воспоминаний пока нет","Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.":"Сохраните первое достижение или памятный день.","MAXSUS IMKONIYATLAR":"ОСОБЫЕ ВОЗМОЖНОСТИ","XP bilan profilingiz va SmartGoal ko‘rinishini o‘zingizga moslang.":"Настройте профиль и SmartGoal за XP.","SIZNING BALANSINGIZ":"ВАШ БАЛАНС","Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.":"Каждое настоящее достижение открывает новые возможности.","Barchasi":"Все","Mavzular":"Темы","Profil fonlari":"Фоны профиля","Belgilar":"Значки","Avatar ramkalari":"Рамки аватара","Do‘kondan birinchi mahsulotingizni xarid qiling.":"Купите первый предмет в магазине.","HAMJAMIYAT":"СООБЩЕСТВО","Username orqali boshqa foydalanuvchilarni toping.":"Находите других пользователей по имени пользователя.","Username bo‘yicha qidirish":"Поиск по имени пользователя","Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.":"Введите не менее 3 символов. Показываются пользователи, чьи имена начинаются с введённых символов.","Do‘stlik so‘rovlari":"Запросы в друзья","Yangilash":"Обновить","Kelgan so‘rovlar":"Входящие запросы","Yuborilgan so‘rovlar":"Отправленные запросы","Do‘stlaringiz":"Ваши друзья","Qidiruvga tayyor":"Готово к поиску","Username kiriting.":"Введите имя пользователя.","Foydalanuvchi topilmadi":"Пользователь не найден","SHAXSIY YORDAMCHI":"ЛИЧНЫЙ ПОМОЩНИК","Har kuni yaxshiroq natija sari.":"К лучшим результатам каждый день.","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.":"Ответы на вопросы, чёткие планы и полезные советы для ваших целей.","AI siz yozgan tilda javob beradi.":"AI отвечает на языке вашего сообщения.","Suhbatni tozalash":"Очистить чат","Bugungi rejam":"Мой план на сегодня","Motivatsiya":"Мотивация","Umumiy sozlamalar":"Общие настройки","SmartGoal’ni o‘zingizga moslang.":"Настройте SmartGoal под себя.","Interfeys ko‘rinishi":"Внешний вид интерфейса","O‘zingizga qulay rang va mavzuni tanlang.":"Выберите удобные цвета и тему.","Rang mavzusi":"Цветовая тема","Ba’zi ranglar do‘kondan ochko evaziga olinadi.":"Некоторые цвета доступны за XP в магазине.","Profilni muvaffaqiyatli yangilandi.":"Профиль успешно обновлён.","Tug‘ilgan sana yangilandi.":"Дата рождения обновлена.","Maqsad saqlandi.":"Цель сохранена.","Vazifa saqlandi.":"Задача сохранена.","Kun tartibi saqlandi.":"Распорядок сохранён.","Yutuq qo‘shish":"Добавить достижение","Qisqa mazmuni":"Краткое содержание","Qaysi kuni bajariladi?":"На какой день запланировано?","Savolingizni yozing...":"Напишите свой вопрос...","Savolingizni yozing":"Напишите свой вопрос"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "REJALARINGIZ":"YOUR PLANS","Katta natijalarga kichik qadamlar orqali erishing.":"Reach big results through small steps.","Jami maqsadlar":"Total goals","O‘rtacha progress":"Average progress","Maqsad tavsifi kiritilmagan":"No goal description added","Muddat belgilanmagan":"No deadline set","Vazifalarni shu maqsadga bog‘lab, rivojlanishni kuzating.":"Link tasks to this goal to track progress.","Yana":"Remaining","kun":"days","KUNLIK REJA":"DAILY PLAN","Vazifalaringizni tartibga soling va bajarilganlarini belgilang.":"Organize your tasks and mark completed ones.","Vazifalar mavjud emas":"No tasks yet","Yangi vazifa qo‘shib rejangizni boshlang.":"Add a task to start planning.","VAQTNI BOSHQARISH":"TIME MANAGEMENT","Kunlik rejangiz, odatlaringiz va maqsadlaringizni bir joyda boshqaring.":"Manage your daily routine, habits and goals in one place.","SIZNING SHAXSIY REJANGIZ":"YOUR PERSONAL ROUTINE","Har bir ish uchun vaqt belgilang. Rejangizni AI bilan ham birga tuzishingiz mumkin.":"Set a time for each activity. AI can help build your schedule.","AI bilan kun tartibini tuzish":"Build a routine with AI","Uyg‘onish vaqtingiz, o‘qish/ish jadvalingiz va odatlaringizni yozing.":"Enter your wake-up time, school/work schedule and habits.","Bugungi vazifalar":"Today's tasks","Maqsadlar asosida tavsiyalar":"Goal-based suggestions","AI maqsad va vazifalaringizni tahlil qilib, amaliy reja tuzadi.":"AI analyzes your goals and tasks to create a practical plan.","NATIJALARINGIZ":"YOUR RESULTS","Faolligingiz va rivojlanishingizni tahlil qiling.":"Analyze your activity and progress.","Haftalik faollik":"Weekly activity","Har kuni to‘plangan XP":"XP earned each day","Maqsadlar sari bosib o‘tilgan yo‘l":"Progress toward your goals","Har bir maqsad uchun bajarilgan ishlar va qolgan qadamlar.":"Completed work and remaining steps for each goal.","Muhim kunlar, sertifikatlar va shaxsiy yutuqlaringizni saqlang.":"Save important days, certificates and personal achievements.","SmartGoal yutuqlari":"SmartGoal achievements","ta ochilgan":"unlocked","Hali ochilmagan":"Not unlocked yet","Xotiralar hali yo‘q":"No memories yet","Birinchi yutug‘ingiz yoki esdalik kuningizni saqlang.":"Save your first achievement or memorable day.","MAXSUS IMKONIYATLAR":"SPECIAL FEATURES","XP bilan profilingiz va SmartGoal ko‘rinishini o‘zingizga moslang.":"Customize your profile and SmartGoal with XP.","SIZNING BALANSINGIZ":"YOUR BALANCE","Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.":"Every real achievement unlocks new possibilities.","Barchasi":"All","Mavzular":"Themes","Profil fonlari":"Profile backgrounds","Belgilar":"Badges","Avatar ramkalari":"Avatar frames","Do‘kondan birinchi mahsulotingizni xarid qiling.":"Purchase your first item from the shop.","HAMJAMIYAT":"COMMUNITY","Username orqali boshqa foydalanuvchilarni toping.":"Find other users by username.","Username bo‘yicha qidirish":"Search by username","Kamida 3 ta belgi kiriting. Username boshidan mos keladigan foydalanuvchilar ko‘rsatiladi.":"Enter at least 3 characters. Users whose usernames start with your search will appear.","Do‘stlik so‘rovlari":"Friend requests","Yangilash":"Refresh","Kelgan so‘rovlar":"Incoming requests","Yuborilgan so‘rovlar":"Sent requests","Do‘stlaringiz":"Your friends","Qidiruvga tayyor":"Ready to search","Username kiriting.":"Enter a username.","Foydalanuvchi topilmadi":"User not found","SHAXSIY YORDAMCHI":"PERSONAL ASSISTANT","Har kuni yaxshiroq natija sari.":"Toward better results every day.","Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.":"Answers to your questions, clear plans and useful advice for your goals.","AI siz yozgan tilda javob beradi.":"AI replies in the language you write in.","Suhbatni tozalash":"Clear chat","Bugungi rejam":"My plan for today","Motivatsiya":"Motivation","Umumiy sozlamalar":"General settings","SmartGoal’ni o‘zingizga moslang.":"Make SmartGoal yours.","Interfeys ko‘rinishi":"Interface appearance","O‘zingizga qulay rang va mavzuni tanlang.":"Choose colors and a theme that work for you.","Rang mavzusi":"Color theme","Ba’zi ranglar do‘kondan ochko evaziga olinadi.":"Some colors can be unlocked with XP in the shop.","Matnlar, tushuntirishlar va interfeysning murakkabligini o‘zingizga moslang.":"Adjust text, explanations and interface complexity.","Tug‘ilgan sana yangilandi.":"Birthday updated.","Maqsad saqlandi.":"Goal saved.","Vazifa saqlandi.":"Task saved.","Kun tartibi saqlandi.":"Daily routine saved.","Qisqa mazmuni":"Short summary","Qaysi kuni bajariladi?":"Which day should it be done?","Savolingizni yozing...":"Type your question..."
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Okean mavzusi":"Тема Ocean","Zumrad mavzusi":"Тема Emerald","Shafaq mavzusi":"Тема Sunset","Atirgul mavzusi":"Тема Rose","Sky mavzusi":"Тема Sky","Yarim tun foni":"Фон Midnight","Galaktika foni":"Фон Galaxy","Qirollik foni":"Фон Royal","Gilos gullari profil foni":"Фон профиля Sakura","Tumanlik profil foni":"Фон профиля Nebula","Diqqat belgisi":"Значок Focus","Olmos belgisi":"Значок Diamond","Quruvchi belgisi":"Значок Builder","Oltin avatar ramkasi":"Золотая рамка аватара","Maxsus avatar ramkasi":"Премиальная рамка аватара","Profilingiz va interfeysingiz uchun sokin ko‘k rang.":"Спокойный синий цвет для профиля и интерфейса.","Yashil va nafis ko‘rinish.":"Элегантная зелёная тема.","Iliq ranglardagi maxsus interfeys.":"Особая тёплая цветовая тема.","Nafis pushti ranglar uyg‘unligi.":"Нежная розовая цветовая гамма.","Profil uchun qoramtir, maxsus fon.":"Особый тёмный фон профиля.","Maxsus kosmik profil foni.":"Космический фон профиля.","Noyob premium profil dizayni.":"Уникальный премиальный дизайн профиля.","Diqqat va intizom ramzi.":"Символ концентрации и дисциплины.","Maxsus premium belgi.":"Особый премиальный значок.","Profil rasmingiz uchun oltin bezak.":"Золотое оформление фотографии профиля.","Profil rasmingiz uchun maxsus ramka.":"Особая рамка для фотографии профиля.","Yashil va nafis ko‘rinish.":"Элегантная зелёная тема.","Sokin moviy ranglar.":"Спокойные голубые оттенки.","Qo‘lga kiritilgan":"Получено","Hali ochilmagan":"Ещё не открыто","Oddiy":"Обычный","Muhim":"Важное","Juda muhim":"Очень важно","Past":"Низкий","O‘rta":"Средний","Yuqori":"Высокий","Bajarish sanasi":"Дата выполнения","Taxminiy bajarish vaqti":"Примерное время выполнения","Qo‘shimcha sozlama (ixtiyoriy)":"Дополнительные настройки (необязательно)"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Okean mavzusi":"Ocean theme","Zumrad mavzusi":"Emerald theme","Shafaq mavzusi":"Sunset theme","Atirgul mavzusi":"Rose theme","Sky mavzusi":"Sky theme","Yarim tun foni":"Midnight background","Galaktika foni":"Galaxy background","Qirollik foni":"Royal background","Gilos gullari profil foni":"Sakura profile background","Tumanlik profil foni":"Nebula profile background","Diqqat belgisi":"Diqqat belgisi","Olmos belgisi":"Olmos belgisi","Quruvchi belgisi":"Builder badge","Oltin avatar ramkasi":"Gold avatar frame","Maxsus avatar ramkasi":"Premium avatar frame","Profilingiz va interfeysingiz uchun sokin ko‘k rang.":"A calm blue look for your profile and interface.","Yashil va nafis ko‘rinish.":"An elegant green theme.","Iliq ranglardagi maxsus interfeys.":"A special warm-colored interface.","Nafis pushti ranglar uyg‘unligi.":"An elegant blend of pink tones.","Profil uchun qoramtir, maxsus fon.":"A special dark profile background.","Maxsus kosmik profil foni.":"A special cosmic profile background.","Noyob premium profil dizayni.":"A unique premium profile design.","Diqqat va intizom ramzi.":"A symbol of focus and discipline.","Maxsus premium belgi.":"A special premium badge.","Profil rasmingiz uchun oltin bezak.":"A gold decoration for your profile photo.","Profil rasmingiz uchun maxsus ramka.":"A special frame for your profile photo.","Qo‘lga kiritilgan":"Unlocked","Hali ochilmagan":"Not unlocked yet","Oddiy":"Normal","Muhim":"Important","Juda muhim":"Very important","Past":"Low","O‘rta":"Medium","Yuqori":"High","Bajarish sanasi":"Due date","Taxminiy bajarish vaqti":"Estimated time","Qo‘shimcha sozlama (ixtiyoriy)":"Additional settings (optional)"
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
    "Shimol yog‘dusi profil foni":"Фон профиля Aurora","Forest profil foni":"Лесной фон профиля","Quyosh chiqishi profil foni":"Фон профиля Sunrise",
    "Olim belgisi":"Значок Scholar","Kashfiyotchi belgisi":"Значок Explorer","Neon avatar ramkasi":"Неоновая рамка аватара",
    "Yashil va binafsha shimol yog‘dusi uslubidagi fon.":"Фон в стиле северного сияния.",
    "Tabiat ranglaridagi sokin profil foni.":"Спокойный фон профиля в природных тонах.",
    "Yangi kun va yangi maqsadlar uchun iliq fon.":"Тёплый фон для нового дня и новых целей.",
    "Bilim va muntazam o‘rganish ramzi.":"Символ знаний и регулярного обучения.",
    "Yangi ko‘nikmalarni sinab ko‘rish ramzi.":"Символ исследования новых навыков.",
    "Profil rasmingiz uchun yorqin neon ramka.":"Яркая неоновая рамка для фото профиля.",
    "Eslatmalar sahifa ochiq turganda ishlaydi.":"Напоминания работают, пока страница открыта."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Shimol yog‘dusi profil foni":"Aurora profile background","Forest profil foni":"Forest profile background","Quyosh chiqishi profil foni":"Sunrise profile background",
    "Olim belgisi":"Scholar badge","Kashfiyotchi belgisi":"Explorer badge","Neon avatar ramkasi":"Neon avatar frame",
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

  Object.assign(UI_TRANSLATIONS.ru, {
    "Faollik zanjiri":"Серия активности","Ketma-ket faol kun":"Дней активности подряд"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Faollik zanjiri":"Activity streak","Ketma-ket faol kun":"Consecutive active days"
  });

  Object.assign(UI_TRANSLATIONS.ru,{"Maqsadlaringizni boshqaring":"Управляйте своими целями","Rejalashtiring va natijaga erishing":"Планируйте и достигайте результатов","Rivojlanishingizni kuzating":"Следите за своим прогрессом","Har bir qadamingizni ko‘rib boring":"Отслеживайте каждый свой шаг","Birgalikda rivojlaning":"Развивайтесь вместе","Boshqalarni toping va yutuqlaringizni ulashing":"Находите единомышленников и делитесь достижениями","Ism va familiya":"Имя и фамилия","Ismingiz va familiyangiz":"Ваше имя и фамилия","Elektron pochta":"Электронная почта","Tug‘ilgan sana":"Дата рождения","Yoshingiz avtomatik hisoblanadi. Maktab yoki sinf tanlash shart emas.":"Ваш возраст рассчитывается автоматически. Указывать школу или класс не нужно.","Parol":"Пароль","Kamida 8 ta belgi":"Не менее 8 символов","Foydalanish shartlari va maxfiylik siyosatiga roziman.":"Я принимаю условия использования и политику конфиденциальности.","Batafsil":"Подробнее","Hisob yaratish":"Создать аккаунт","Rasm qo‘shish":"Добавить фото","Profil rasmi":"Фото профиля","Rasm tanlash":"Выбрать изображение","Ovoz va animatsiyalar":"Звук и анимация","Ovoz effektlari":"Звуковые эффекты","Vazifa bajarilganda qisqa ovoz.":"Короткий звук при выполнении задачи.","Kamaytirilgan animatsiya":"Уменьшенная анимация","Harakatlar sonini kamaytirish.":"Уменьшить количество анимаций.","Kun / tun rejimi":"Дневной / ночной режим","Interfeys ranglarini o‘zgartirish":"Изменить цвета интерфейса","Matn o‘lchami":"Размер текста","O‘qish uchun qulay hajmni tanlang.":"Выберите удобный размер текста.","Rang mavzusi":"Цветовая тема","Ba’zi ranglar do‘kondan ochko evaziga olinadi.":"Некоторые цвета открываются за очки в магазине.","Ovoz yoqildi.":"Звук включён.","Ovoz o‘chirildi.":"Звук выключен."});Object.assign(UI_TRANSLATIONS.en,{"Maqsadlaringizni boshqaring":"Manage your goals","Rejalashtiring va natijaga erishing":"Plan and achieve results","Rivojlanishingizni kuzating":"Track your progress","Har bir qadamingizni ko‘rib boring":"See every step of your journey","Birgalikda rivojlaning":"Grow together","Boshqalarni toping va yutuqlaringizni ulashing":"Find others and share your achievements","Ism va familiya":"Full name","Ismingiz va familiyangiz":"Your full name","Elektron pochta":"Email address","Tug‘ilgan sana":"Date of birth","Yoshingiz avtomatik hisoblanadi. Maktab yoki sinf tanlash shart emas.":"Your age is calculated automatically. No school or grade information is required.","Parol":"Password","Kamida 8 ta belgi":"At least 8 characters","Foydalanish shartlari va maxfiylik siyosatiga roziman.":"I agree to the Terms of Use and Privacy Policy.","Batafsil":"Read details","Hisob yaratish":"Create account","Rasm qo‘shish":"Add photo","Profil rasmi":"Profile photo","Rasm tanlash":"Choose image","Ovoz va animatsiyalar":"Sound and animation","Ovoz effektlari":"Sound effects","Vazifa bajarilganda qisqa ovoz.":"A short sound when a task is completed.","Kamaytirilgan animatsiya":"Reduced motion","Harakatlar sonini kamaytirish.":"Reduce interface motion.","Kun / tun rejimi":"Light / dark mode","Interfeys ranglarini o‘zgartirish":"Change interface colors","Matn o‘lchami":"Text size","O‘qish uchun qulay hajmni tanlang.":"Choose a comfortable reading size.","Rang mavzusi":"Color theme","Ba’zi ranglar do‘kondan ochko evaziga olinadi.":"Some colors can be unlocked with points in the shop.","Ovoz yoqildi.":"Sound enabled.","Ovoz o‘chirildi.":"Sound disabled."});

  // Mukofotlar, Smart AI va bildirishnomalar uchun to‘liq sahifa tarjimalari.
  Object.assign(UI_TRANSLATIONS.ru, {
    "Do‘kon kategoriyalari": "Категории магазина",
    "Sizning balansingiz": "Ваш баланс",
    "Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.": "Каждое настоящее достижение открывает для вас новые возможности.",
    "Barchasi": "Все",
    "Mavzular": "Темы",
    "Profil fonlari": "Фоны профиля",
    "Belgilar": "Значки",
    "Avatar ramkalari": "Рамки аватара",
    "Bu kategoriyada mahsulot yo‘q": "В этой категории пока нет товаров",
    "Boshqa kategoriyani tanlang.": "Выберите другую категорию.",
    "Sizning kolleksiyangiz": "Ваша коллекция",
    "Do‘kondan birinchi mahsulotingizni xarid qiling.": "Купите свой первый товар в магазине.",
    "Xarid": "Купить",
    "Qo‘llash": "Применить",
    "XP yetarli emas": "Недостаточно XP",
    "SIZNING BALANSINGIZ": "ВАШ БАЛАНС",
    "MAXSUS IMKONIYATLAR": "ОСОБЫЕ ВОЗМОЖНОСТИ",
    "Profilingiz va interfeysingiz uchun sokin ko‘k rang.": "Спокойный синий цвет для профиля и интерфейса.",
    "Yashil va nafis ko‘rinish.": "Элегантное оформление в зелёных тонах.",
    "Iliq ranglardagi maxsus interfeys.": "Особый интерфейс в тёплых тонах.",
    "Nafis pushti ranglar uyg‘unligi.": "Изящное сочетание розовых оттенков.",
    "Profil uchun qoramtir, maxsus fon.": "Особый тёмный фон профиля.",
    "Maxsus kosmik profil foni.": "Космический фон профиля.",
    "Noyob premium profil dizayni.": "Эксклюзивное премиальное оформление профиля.",
    "Diqqat va intizom ramzi.": "Символ концентрации и дисциплины.",
    "Maxsus premium belgi.": "Особый премиальный значок.",
    "Yengil moviy ranglar va sokin ko‘rinish.": "Лёгкие голубые оттенки и спокойный дизайн.",
    "Profilingizga nozik va yorqin uslub.": "Нежное и яркое оформление вашего профиля.",
    "Yulduzli kosmik bezak.": "Космическое оформление со звёздами.",
    "Har kuni o‘z ustida ishlaydiganlar uchun.": "Для тех, кто каждый день работает над собой.",
    "Profil rasmingiz uchun oltin bezak.": "Золотое оформление фотографии профиля.",
    "Profil rasmingiz uchun maxsus ramka.": "Особая рамка для фотографии профиля.",
    "Yashil va binafsha shimol yog‘dusi uslubidagi fon.": "Фон в зелёных и фиолетовых тонах северного сияния.",
    "Tabiat ranglaridagi sokin profil foni.": "Спокойный фон профиля в природных тонах.",
    "Yangi kun va yangi maqsadlar uchun iliq fon.": "Тёплый фон для нового дня и новых целей.",
    "Bilim va muntazam o‘rganish ramzi.": "Символ знаний и постоянного обучения.",
    "Yangi ko‘nikmalarni sinab ko‘rish ramzi.": "Символ освоения новых навыков.",
    "Profil rasmingiz uchun yorqin neon ramka.": "Яркая неоновая рамка для фотографии профиля.",
    "Yumshoq lavanda ranglaridagi interfeys.": "Интерфейс в мягких лавандовых тонах.",
    "Yengil va tetiklantiruvchi yashil ranglar.": "Лёгкие и освежающие зелёные оттенки.",
    "Iliq marjon ranglari bilan o‘ziga xos profil.": "Необычное оформление профиля в тёплых коралловых тонах.",
    "Chuqur ranglar va olovli aksentlar.": "Насыщенные цвета и огненные акценты.",
    "Muntazamlik va davomiy harakat ramzi.": "Символ постоянства и непрерывного движения.",
    "Yangi g‘oyalarni amaliy natijaga aylantiruvchilar uchun.": "Для тех, кто воплощает новые идеи в жизнь.",
    "Profil rasmingiz uchun billurdek yorqin ramka.": "Сверкающая кристальная рамка для фотографии профиля.",
    "Profilingizga jo‘shqin va yorqin uslub.": "Яркое и энергичное оформление профиля.",
    "Minimal va jiddiy grafit ranglar.": "Сдержанные минималистичные графитовые оттенки.",
    "Sovuq moviy va oq ranglar uyg‘unligi.": "Сочетание холодных голубых и белых оттенков.",
    "Iliq oltin ranglar bilan yorqin interfeys.": "Яркий интерфейс с тёплыми золотистыми оттенками.",
    "Chuqur dengiz ranglaridagi profil foni.": "Фон профиля в глубоких морских оттенках.",
    "Tog‘ manzarasidan ilhomlangan fon.": "Фон, вдохновлённый горными пейзажами.",
    "Tungi osmon va shimol yog‘dusi ranglari.": "Цвета ночного неба и северного сияния.",
    "Chuqur diqqat va samarali mehnat ramzi.": "Символ глубокой концентрации и продуктивной работы.",
    "Yangi yechimlar yaratuvchilar uchun.": "Для создателей новых решений.",
    "Bilimini boshqalar bilan ulashuvchilar uchun.": "Для тех, кто делится знаниями с другими.",
    "Ranglar jilosi bilan zamonaviy ramka.": "Современная рамка с переливами цветов.",
    "Minimal qoramtir premium ramka.": "Минималистичная тёмная премиальная рамка.",
    "Yashil va binafsha rangli yorqin ramka.": "Яркая рамка в зелёных и фиолетовых тонах.",
    "SHAXSIY YORDAMCHI": "ЛИЧНЫЙ ПОМОЩНИК",
    "Har kuni yaxshiroq natija sari.": "К лучшим результатам каждый день.",
    "Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.": "Ответы на вопросы, чёткие планы и полезные советы для ваших целей.",
    "SMARTGOAL INTELLIGENCE": "ИНТЕЛЛЕКТ SMARTGOAL",
    "AI maqsadlaringiz, vazifalaringiz va kun tartibingizni hisobga olib, amaliy maslahat beradi. Boshqa mavzularda ham bemalol so‘rashingiz mumkin.": "ИИ учитывает ваши цели, задачи и распорядок дня и даёт практические советы. Вы также можете свободно задавать вопросы на другие темы.",
    "faol maqsad": "активная цель",
    "faol maqsadlar": "активных целей",
    "bajarilmagan vazifa": "невыполненная задача",
    "bajarilmagan vazifalar": "невыполненных задач",
    "kun tartibi bandi": "пункт распорядка дня",
    "kun tartibi bandlari": "пунктов распорядка дня",
    "AI bilan suhbat": "Чат с ИИ",
    "AI siz yozgan tilda javob beradi.": "ИИ отвечает на языке вашего сообщения.",
    "Suhbatni tozalash": "Очистить переписку",
    "Bugungi rejam": "Мой план на сегодня",
    "Kun tartibim": "Мой распорядок дня",
    "Vazifalarim": "Мои задачи",
    "Motivatsiya": "Мотивация",
    "Savolingizni yozing...": "Напишите свой вопрос...",
    "Yuborish": "Отправить",
    "Salom! Men SmartGoal AI murabbiyiman. Maqsadlaringiz, kun tartibingiz va vazifalaringizni birga yaxshilaymiz. Istalgan mavzuda savol berishingiz mumkin.": "Здравствуйте! Я ИИ-наставник SmartGoal. Давайте вместе улучшим ваши цели, распорядок дня и задачи. Вы можете задавать вопросы на любые темы.",
    "AI javob yozmoqda...": "ИИ печатает...",
    "AI bilan bog‘lanib bo‘lmadi.": "Не удалось связаться с ИИ.",
    "AI bo‘sh javob qaytardi. Qayta urinib ko‘ring.": "ИИ вернул пустой ответ. Попробуйте ещё раз.",
    "AI hozircha javob bera olmadi.": "Пока ИИ не может ответить.",
    "Maqsad va vazifalaringiz tahlil qilinmoqda...": "Анализируем ваши цели и задачи...",
    "AI maslahat bera olmadi.": "ИИ не смог дать совет.",
    "AI bilan aloqa uzildi.": "Соединение с ИИ прервано.",
    "YANGILIKLAR": "УВЕДОМЛЕНИЯ",
    "Faolligingiz va yutuqlaringiz haqidagi xabarlar.": "Сообщения о вашей активности и достижениях.",
    "Barcha bildirishnomalar": "Все уведомления",
    "ta xabar": "сообщений",
    "ta o‘qilmagan": "непрочитанных",
    "Barchasini o‘qilgan qilish": "Отметить все как прочитанные",
    "O‘qildi": "Прочитано",
    "Bildirishnomalar yo‘q": "Уведомлений пока нет",
    "Yangi xabarlar shu yerda paydo bo‘ladi.": "Новые сообщения будут появляться здесь.",
    "Yangi daraja!": "Новый уровень!",
    "Tabriklaymiz! Siz": "Поздравляем! Вы достигли",
    "-darajaga ko‘tarildingiz.": "-го уровня.",
    "Maqsad yakunlandi!": "Цель завершена!",
    "maqsadini bajardingiz.": "цель выполнена.",
    "Yangi yutuq ochildi!": "Открыто новое достижение!",
    "yutug‘ini qo‘lga kiritdingiz.": "достижение получено.",
    "Kun tartibi vaqti!": "Время по распорядку дня!",
    "Eslatmalar sahifa ochiq turganda ishlaydi.": "Напоминания работают, пока страница открыта."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Do‘kon kategoriyalari": "Shop categories",
    "Sizning balansingiz": "Your balance",
    "Har bir haqiqiy yutuq sizga yangi imkoniyatlarni ochadi.": "Every real achievement unlocks new possibilities.",
    "Barchasi": "All",
    "Mavzular": "Themes",
    "Profil fonlari": "Profile backgrounds",
    "Belgilar": "Badges",
    "Avatar ramkalari": "Avatar frames",
    "Bu kategoriyada mahsulot yo‘q": "No items in this category",
    "Boshqa kategoriyani tanlang.": "Choose another category.",
    "Sizning kolleksiyangiz": "Your collection",
    "Do‘kondan birinchi mahsulotingizni xarid qiling.": "Purchase your first item from the shop.",
    "Xarid": "Buy",
    "Qo‘llash": "Apply",
    "XP yetarli emas": "Not enough XP",
    "SIZNING BALANSINGIZ": "YOUR BALANCE",
    "MAXSUS IMKONIYATLAR": "SPECIAL FEATURES",
    "Profilingiz va interfeysingiz uchun sokin ko‘k rang.": "A calm blue color for your profile and interface.",
    "Yashil va nafis ko‘rinish.": "An elegant green appearance.",
    "Iliq ranglardagi maxsus interfeys.": "A special interface in warm colors.",
    "Nafis pushti ranglar uyg‘unligi.": "An elegant blend of pink shades.",
    "Profil uchun qoramtir, maxsus fon.": "A special dark profile background.",
    "Maxsus kosmik profil foni.": "A special cosmic profile background.",
    "Noyob premium profil dizayni.": "An exclusive premium profile design.",
    "Diqqat va intizom ramzi.": "A symbol of focus and discipline.",
    "Maxsus premium belgi.": "A special premium badge.",
    "Yengil moviy ranglar va sokin ko‘rinish.": "Light blue colors and a calm appearance.",
    "Profilingizga nozik va yorqin uslub.": "A delicate, bright style for your profile.",
    "Yulduzli kosmik bezak.": "A starry cosmic design.",
    "Har kuni o‘z ustida ishlaydiganlar uchun.": "For people who work on themselves every day.",
    "Profil rasmingiz uchun oltin bezak.": "A golden frame for your profile photo.",
    "Profil rasmingiz uchun maxsus ramka.": "A special frame for your profile photo.",
    "Yashil va binafsha shimol yog‘dusi uslubidagi fon.": "A green and violet northern-lights inspired background.",
    "Tabiat ranglaridagi sokin profil foni.": "A calm nature-inspired profile background.",
    "Yangi kun va yangi maqsadlar uchun iliq fon.": "A warm background for a new day and new goals.",
    "Bilim va muntazam o‘rganish ramzi.": "A symbol of knowledge and consistent learning.",
    "Yangi ko‘nikmalarni sinab ko‘rish ramzi.": "A symbol of exploring new skills.",
    "Profil rasmingiz uchun yorqin neon ramka.": "A bright neon frame for your profile photo.",
    "Yumshoq lavanda ranglaridagi interfeys.": "An interface in soft lavender shades.",
    "Yengil va tetiklantiruvchi yashil ranglar.": "Light and refreshing green shades.",
    "Iliq marjon ranglari bilan o‘ziga xos profil.": "A distinctive profile in warm coral colors.",
    "Chuqur ranglar va olovli aksentlar.": "Deep colors with fiery accents.",
    "Muntazamlik va davomiy harakat ramzi.": "A symbol of consistency and continuous effort.",
    "Yangi g‘oyalarni amaliy natijaga aylantiruvchilar uchun.": "For people who turn new ideas into practical results.",
    "Profil rasmingiz uchun billurdek yorqin ramka.": "A crystal-bright frame for your profile photo.",
    "Profilingizga jo‘shqin va yorqin uslub.": "A vivid, energetic style for your profile.",
    "Minimal va jiddiy grafit ranglar.": "Minimal, refined graphite colors.",
    "Sovuq moviy va oq ranglar uyg‘unligi.": "A blend of cool blue and white shades.",
    "Iliq oltin ranglar bilan yorqin interfeys.": "A bright interface with warm golden tones.",
    "Chuqur dengiz ranglaridagi profil foni.": "A profile background in deep ocean colors.",
    "Tog‘ manzarasidan ilhomlangan fon.": "A background inspired by mountain scenery.",
    "Tungi osmon va shimol yog‘dusi ranglari.": "Night-sky and northern-lights colors.",
    "Chuqur diqqat va samarali mehnat ramzi.": "A symbol of deep focus and productive work.",
    "Yangi yechimlar yaratuvchilar uchun.": "For people who create new solutions.",
    "Bilimini boshqalar bilan ulashuvchilar uchun.": "For people who share their knowledge with others.",
    "Ranglar jilosi bilan zamonaviy ramka.": "A modern frame with iridescent colors.",
    "Minimal qoramtir premium ramka.": "A minimal dark premium frame.",
    "Yashil va binafsha rangli yorqin ramka.": "A vivid green and violet frame.",
    "SHAXSIY YORDAMCHI": "PERSONAL ASSISTANT",
    "Har kuni yaxshiroq natija sari.": "Toward better results every day.",
    "Savollaringizga javob, maqsadlaringizga esa aniq reja va foydali maslahatlar.": "Answers to your questions, clear plans and useful advice for your goals.",
    "SMARTGOAL INTELLIGENCE": "SMARTGOAL INTELLIGENCE",
    "AI maqsadlaringiz, vazifalaringiz va kun tartibingizni hisobga olib, amaliy maslahat beradi. Boshqa mavzularda ham bemalol so‘rashingiz mumkin.": "AI considers your goals, tasks and daily routine to provide practical advice. You can also ask freely about other topics.",
    "faol maqsad": "active goal",
    "faol maqsadlar": "active goals",
    "bajarilmagan vazifa": "unfinished task",
    "bajarilmagan vazifalar": "unfinished tasks",
    "kun tartibi bandi": "routine item",
    "kun tartibi bandlari": "routine items",
    "AI bilan suhbat": "Chat with AI",
    "AI siz yozgan tilda javob beradi.": "AI replies in the language you write in.",
    "Suhbatni tozalash": "Clear conversation",
    "Bugungi rejam": "My plan for today",
    "Kun tartibim": "My daily routine",
    "Vazifalarim": "My tasks",
    "Motivatsiya": "Motivation",
    "Savolingizni yozing...": "Type your question...",
    "Yuborish": "Send",
    "Salom! Men SmartGoal AI murabbiyiman. Maqsadlaringiz, kun tartibingiz va vazifalaringizni birga yaxshilaymiz. Istalgan mavzuda savol berishingiz mumkin.": "Hello! I am your SmartGoal AI coach. Let's improve your goals, daily routine and tasks together. You can ask questions about any topic.",
    "AI javob yozmoqda...": "AI is typing...",
    "AI bilan bog‘lanib bo‘lmadi.": "Could not connect to AI.",
    "AI bo‘sh javob qaytardi. Qayta urinib ko‘ring.": "AI returned an empty response. Please try again.",
    "AI hozircha javob bera olmadi.": "AI could not respond right now.",
    "Maqsad va vazifalaringiz tahlil qilinmoqda...": "Analyzing your goals and tasks...",
    "AI maslahat bera olmadi.": "AI could not provide advice.",
    "AI bilan aloqa uzildi.": "The connection to AI was lost.",
    "YANGILIKLAR": "NOTIFICATIONS",
    "Faolligingiz va yutuqlaringiz haqidagi xabarlar.": "Updates about your activity and achievements.",
    "Barcha bildirishnomalar": "All notifications",
    "ta xabar": "messages",
    "ta o‘qilmagan": "unread",
    "Barchasini o‘qilgan qilish": "Mark all as read",
    "O‘qildi": "Read",
    "Bildirishnomalar yo‘q": "No notifications yet",
    "Yangi xabarlar shu yerda paydo bo‘ladi.": "New messages will appear here.",
    "Yangi daraja!": "New level!",
    "Tabriklaymiz! Siz": "Congratulations! You reached level",
    "-darajaga ko‘tarildingiz.": " .",
    "Maqsad yakunlandi!": "Goal completed!",
    "maqsadini bajardingiz.": "goal completed.",
    "Yangi yutuq ochildi!": "New achievement unlocked!",
    "yutug‘ini qo‘lga kiritdingiz.": "achievement earned.",
    "Kun tartibi vaqti!": "Routine reminder!",
    "Eslatmalar sahifa ochiq turganda ishlaydi.": "Reminders work while the page is open."
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

  // Coverage additions for authentication, navigation, forms, feedback and dynamic states.
  Object.assign(UI_TRANSLATIONS.ru, {
    "O'ZINGIZNING YANGI BOSQICHINGIZ":"ВАШ НОВЫЙ ЭТАП",
    "Bugungi kichik qadam — ertangi katta natija.":"Маленький шаг сегодня — большой результат завтра.",
    "Maqsadlaringizni tartibga soling, odatlaringizni rivojlantiring va har kuni kechagidan yaxshiroq bo'ling.":"Упорядочьте цели, развивайте привычки и становитесь лучше каждый день.",
    "XUSH KELIBSIZ":"С ВОЗВРАЩЕНИЕМ",
    "Hisobingizga kiring":"Войдите в аккаунт",
    "Davom etish uchun ma'lumotlaringizni kiriting.":"Введите данные, чтобы продолжить.",
    "Kirish":"Войти",
    "Ro'yxatdan o'tish":"Регистрация",
    "Username yoki elektron pochta":"Имя пользователя или электронная почта",
    "Username yoki email":"Имя пользователя или email",
    "Parol":"Пароль",
    "Parolingizni kiriting":"Введите пароль",
    "Bu qurilmada eslab qolish":"Запомнить на этом устройстве",
    "Parolni unutdingizmi?":"Забыли пароль?",
    "Ism va familiya":"Имя и фамилия",
    "Elektron pochta":"Электронная почта",
    "Tug'ilgan sana":"Дата рождения",
    "Yoshingiz avtomatik hisoblanadi.":"Возраст рассчитывается автоматически.",
    "Maktab yoki sinf tanlash shart emas.":"Указывать школу или класс не нужно.",
    "Foydalanish shartlari va maxfiylik siyosatiga roziman.":"Я принимаю условия использования и политику конфиденциальности.",
    "Hali hisobingiz yo'qmi?":"Ещё нет аккаунта?",
    "Hisob yarating":"Создайте аккаунт",
    "O'zgarishni bugundan boshla.":"Начните меняться уже сегодня.",
    "Har kuni bir qadam oldinga.":"Каждый день на шаг вперёд.",
    "ASOSIY":"ОСНОВНОЕ",
    "RIVOJLANISH":"РАЗВИТИЕ",
    "SHAXSIY":"ЛИЧНОЕ",
    "Yig'ilgan ochkolar":"Накопленные очки",
    "Hisobdan chiqish":"Выйти из аккаунта",
    "Menyuni yopish":"Закрыть меню",
    "Yopish":"Закрыть",
    "Foydalanuvchi":"Пользователь",
    "SmartGoal yuklanmoqda...":"SmartGoal загружается...",
    "Maqsad topildi:":"Найдена цель:",
    "Ism va familiyani to'g'ri kiriting.":"Введите корректные имя и фамилию.",
    "Username formati noto'g'ri.":"Неверный формат имени пользователя.",
    "Rasm 2 MB dan kichik bo'lishi kerak.":"Размер изображения должен быть меньше 2 МБ.",
    "Rasmni yuklashda xatolik yuz berdi.":"Не удалось загрузить изображение.",
    "Profilni saqlashda xatolik.":"Не удалось сохранить профиль.",
    "Hisob yaratilmoqda...":"Создание аккаунта...",
    "Server bilan aloqa o'rnatilmadi. Internetni tekshirib qayta urinib ko'ring.":"Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.",
    "Username yoki email va parolni kiriting.":"Введите имя пользователя или email и пароль.",
    "Kirish amalga oshmadi.":"Не удалось войти.",
    "Hisobdan chiqdingiz.":"Вы вышли из аккаунта.",
    "Masalan: Ingliz tilini o'rganish":"Например: изучать английский язык",
    "O'tkazib yuborildi":"Пропущено",
    "Birinchi kun tartibi bandingizni qo'shing.":"Добавьте первый пункт распорядка дня.",
    "Kun tartibiga band qo'shish":"Добавить пункт распорядка",
    "Muddat yo'q":"Без срока",
    "Muddat o'tgan":"Срок истёк",
    "Bugun oxirgi kun":"Последний день — сегодня",
    "Bajarilgan band va uning XP bahosi o'zgartirilmaydi.":"Выполненный пункт и начисленные за него XP не изменяются.",
    "Vaqt va mashg'ulot nomini to'g'ri kiriting.":"Укажите корректное время и название занятия.",
    "Bu vaqtga boshqa mashg'ulot belgilangan. Boshqa vaqt tanlang.":"На это время уже запланировано другое занятие. Выберите другое время.",
    "Ilova ichidagi kun tartibi eslatmalari yoqildi.":"Внутренние напоминания о распорядке включены.",
    "AI maslahat bera olmadi.":"AI не смог дать совет.",
    "AI bilan aloqa uzildi.":"Соединение с AI прервано.",
    "Avval kuningiz haqida qisqacha yozing.":"Сначала кратко расскажите о своём дне.",
    "AI reja tuzmoqda...":"AI составляет план...",
    "AI kun tartibini tuza olmadi.":"AI не удалось составить распорядок.",
    "AI bo'sh kun tartibi qaytardi.":"AI вернул пустой распорядок.",
    "AI xatolik berdi.":"AI выдал ошибку.",
    "Hammaga ko'rinadi":"Видно всем",
    "Faqat menga ko'rinadi":"Видно только мне",
    "Rasm 4 MB dan kichik bo'lishi kerak.":"Размер изображения должен быть меньше 4 МБ.",
    "Rasmni yuklab bo'lmadi.":"Не удалось загрузить изображение.",
    "Xotirangiz saqlandi.":"Воспоминание сохранено.",
    "Faollik zanjiri":"Серия активности",
    "Ketma-ket faol kun":"Дней активности подряд",
    "Faolligingiz va yutuqlaringiz haqidagi xabarlar.":"Уведомления о вашей активности и достижениях.",
    "Qaysi ma'lumotlarni o'chirmoqchisiz?":"Какие данные вы хотите удалить?",
    "Avval o'chiriladigan bo'limni tanlang.":"Сначала выберите раздел для удаления.",
    "Tanlangan ma'lumotlar o'chirildi. XP va xaridlaringiz saqlandi.":"Выбранные данные удалены. XP и покупки сохранены.",
    "Yengil moviy ranglar va sokin ko'rinish.":"Спокойное оформление в светло-голубых тонах.",
    "Profilingizga nozik va yorqin uslub.":"Нежный и яркий стиль для вашего профиля.",
    "Yulduzli kosmik bezak.":"Космическое оформление со звёздами.",
    "Har kuni o'z ustida ishlaydiganlar uchun.":"Для тех, кто каждый день работает над собой.",
    "Yumshoq lavanda ranglaridagi interfeys.":"Интерфейс в мягких лавандовых тонах.",
    "Marjon profil foni":"Коралловый фон профиля",
    "Iliq marjon ranglari bilan o'ziga xos profil.":"Уникальный профиль в тёплых коралловых тонах.",
    "Cho‘g‘ profil foni":"Огненный фон профиля",
    "Chuqur ranglar va olovli aksentlar.":"Глубокие цвета и огненные акценты.",
    "Ijodkor belgisi":"Значок Creator",
    "Yangi g'oyalarni amaliy natijaga aylantiruvchilar uchun.":"Для тех, кто превращает идеи в реальные результаты.",
    "Profil rasmingiz uchun billurdek yorqin ramka.":"Яркая кристальная рамка для фото профиля.",
    "Profilingizga jo'shqin va yorqin uslub.":"Энергичный и яркий стиль для вашего профиля.",
    "Sovuq moviy va oq ranglar uyg'unligi.":"Сочетание холодных голубых и белых оттенков.",
    "Iliq oltin ranglar bilan yorqin interfeys.":"Яркий интерфейс с тёплыми золотыми оттенками.",
    "Ocean profil foni":"Океанический фон профиля",
    "Chuqur dengiz ranglaridagi profil foni.":"Фон профиля в глубоких морских оттенках.",
    "Tog‘ profil foni":"Горный фон профиля",
    "Tog' manzarasidan ilhomlangan fon.":"Фон, вдохновлённый горными пейзажами.",
    "Shimol yog‘dusi tungi foni":"Фон «Северное сияние — ночь»",
    "Tungi osmon va shimol yog'dusi ranglari.":"Цвета ночного неба и северного сияния.",
    "Diqqat Pro belgisi":"Значок Diqqat Pro",
    "Innovator belgisi":"Значок Innovator",
    "Mentor belgisi":"Значок Mentor",
    "Bilimini boshqalar bilan ulashuvchilar uchun.":"Для тех, кто делится знаниями с другими.",
    "Ranglar jilosi bilan zamonaviy ramka.":"Современная рамка с переливами цветов.",
    "Carbon avatar ramkasi":"Углеродная рамка аватара",
    "Minimal qoramtir premium ramka.":"Минималистичная тёмная премиум-рамка.",
    "Aurora avatar ramkasi":"Рамка аватара «Северное сияние»",
    "Yashil va binafsha rangli yorqin ramka.":"Яркая рамка в зелёных и фиолетовых оттенках."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "O'ZINGIZNING YANGI BOSQICHINGIZ":"YOUR NEXT CHAPTER",
    "Bugungi kichik qadam — ertangi katta natija.":"A small step today leads to a big result tomorrow.",
    "Maqsadlaringizni tartibga soling, odatlaringizni rivojlantiring va har kuni kechagidan yaxshiroq bo'ling.":"Organize your goals, build better habits, and improve every day.",
    "XUSH KELIBSIZ":"WELCOME BACK",
    "Hisobingizga kiring":"Sign in to your account",
    "Davom etish uchun ma'lumotlaringizni kiriting.":"Enter your details to continue.",
    "Kirish":"Sign in",
    "Ro'yxatdan o'tish":"Create account",
    "Username yoki elektron pochta":"Username or email",
    "Username yoki email":"Username or email",
    "Parol":"Password",
    "Parolingizni kiriting":"Enter your password",
    "Bu qurilmada eslab qolish":"Remember this device",
    "Parolni unutdingizmi?":"Forgot your password?",
    "Ism va familiya":"Full name",
    "Elektron pochta":"Email address",
    "Tug'ilgan sana":"Date of birth",
    "Yoshingiz avtomatik hisoblanadi.":"Your age is calculated automatically.",
    "Maktab yoki sinf tanlash shart emas.":"You do not need to select a school or grade.",
    "Foydalanish shartlari va maxfiylik siyosatiga roziman.":"I agree to the Terms of Use and Privacy Policy.",
    "Hali hisobingiz yo'qmi?":"Don't have an account yet?",
    "Hisob yarating":"Create your account",
    "O'zgarishni bugundan boshla.":"Start making a change today.",
    "Har kuni bir qadam oldinga.":"One step forward every day.",
    "ASOSIY":"MAIN",
    "RIVOJLANISH":"GROWTH",
    "SHAXSIY":"PERSONAL",
    "Yig'ilgan ochkolar":"Earned points",
    "Hisobdan chiqish":"Sign out",
    "Menyuni yopish":"Close menu",
    "Yopish":"Close",
    "Foydalanuvchi":"User",
    "SmartGoal yuklanmoqda...":"Loading SmartGoal...",
    "Maqsad topildi:":"Goal found:",
    "Ism va familiyani to'g'ri kiriting.":"Enter a valid first and last name.",
    "Username formati noto'g'ri.":"Invalid username format.",
    "Rasm 2 MB dan kichik bo'lishi kerak.":"Image must be smaller than 2 MB.",
    "Rasmni yuklashda xatolik yuz berdi.":"Image upload failed.",
    "Profilni saqlashda xatolik.":"Could not save profile.",
    "Hisob yaratilmoqda...":"Creating your account...",
    "Server bilan aloqa o'rnatilmadi. Internetni tekshirib qayta urinib ko'ring.":"Could not connect to the server. Check your internet connection and try again.",
    "Username yoki email va parolni kiriting.":"Enter your username or email and password.",
    "Kirish amalga oshmadi.":"Sign-in failed.",
    "Hisobdan chiqdingiz.":"You have signed out.",
    "Masalan: Ingliz tilini o'rganish":"Example: Learn English",
    "O'tkazib yuborildi":"Skipped",
    "Birinchi kun tartibi bandingizni qo'shing.":"Add your first routine item.",
    "Kun tartibiga band qo'shish":"Add routine item",
    "Muddat yo'q":"No deadline",
    "Muddat o'tgan":"Overdue",
    "Bugun oxirgi kun":"Due today",
    "Bajarilgan band va uning XP bahosi o'zgartirilmaydi.":"Completed routine items and their XP awards cannot be changed.",
    "Vaqt va mashg'ulot nomini to'g'ri kiriting.":"Enter a valid time and activity name.",
    "Bu vaqtga boshqa mashg'ulot belgilangan. Boshqa vaqt tanlang.":"Another activity is already scheduled at this time. Choose a different time.",
    "Ilova ichidagi kun tartibi eslatmalari yoqildi.":"In-app routine reminders are enabled.",
    "AI maslahat bera olmadi.":"AI could not provide advice.",
    "AI bilan aloqa uzildi.":"The connection to AI was lost.",
    "Avval kuningiz haqida qisqacha yozing.":"First, briefly describe your day.",
    "AI reja tuzmoqda...":"AI is creating your plan...",
    "AI kun tartibini tuza olmadi.":"AI could not create the routine.",
    "AI bo'sh kun tartibi qaytardi.":"AI returned an empty routine.",
    "AI xatolik berdi.":"AI returned an error.",
    "Hammaga ko'rinadi":"Visible to everyone",
    "Faqat menga ko'rinadi":"Only visible to me",
    "Rasm 4 MB dan kichik bo'lishi kerak.":"Image must be smaller than 4 MB.",
    "Rasmni yuklab bo'lmadi.":"Could not download the image.",
    "Xotirangiz saqlandi.":"Memory saved.",
    "Faollik zanjiri":"Activity streak",
    "Ketma-ket faol kun":"Consecutive active days",
    "Faolligingiz va yutuqlaringiz haqidagi xabarlar.":"Updates about your activity and achievements.",
    "Qaysi ma'lumotlarni o'chirmoqchisiz?":"Which data would you like to delete?",
    "Avval o'chiriladigan bo'limni tanlang.":"Choose a section to delete first.",
    "Tanlangan ma'lumotlar o'chirildi. XP va xaridlaringiz saqlandi.":"Selected data was deleted. Your XP and purchases were preserved.",
    "Yengil moviy ranglar va sokin ko'rinish.":"A calm interface in light blue tones.",
    "Profilingizga nozik va yorqin uslub.":"A delicate, bright style for your profile.",
    "Yulduzli kosmik bezak.":"A starry cosmic design.",
    "Har kuni o'z ustida ishlaydiganlar uchun.":"For people who work on themselves every day.",
    "Yumshoq lavanda ranglaridagi interfeys.":"An interface in soft lavender tones.",
    "Marjon profil foni":"Coral profile background",
    "Iliq marjon ranglari bilan o'ziga xos profil.":"A distinctive profile in warm coral tones.",
    "Cho‘g‘ profil foni":"Ember profile background",
    "Chuqur ranglar va olovli aksentlar.":"Deep colors with fiery accents.",
    "Ijodkor belgisi":"Creator badge",
    "Yangi g'oyalarni amaliy natijaga aylantiruvchilar uchun.":"For people who turn new ideas into practical results.",
    "Profil rasmingiz uchun billurdek yorqin ramka.":"A brilliant crystal frame for your profile photo.",
    "Profilingizga jo'shqin va yorqin uslub.":"A bold, vibrant style for your profile.",
    "Sovuq moviy va oq ranglar uyg'unligi.":"A blend of cool blue and white tones.",
    "Iliq oltin ranglar bilan yorqin interfeys.":"A bright interface with warm golden tones.",
    "Ocean profil foni":"Ocean profile background",
    "Chuqur dengiz ranglaridagi profil foni.":"A profile background in deep ocean tones.",
    "Tog‘ profil foni":"Mountain profile background",
    "Tog' manzarasidan ilhomlangan fon.":"A background inspired by mountain scenery.",
    "Shimol yog‘dusi tungi foni":"Aurora Night background",
    "Tungi osmon va shimol yog'dusi ranglari.":"Night-sky and aurora colors.",
    "Diqqat Pro belgisi":"Diqqat Pro badge",
    "Innovator belgisi":"Innovator badge",
    "Mentor belgisi":"Mentor badge",
    "Bilimini boshqalar bilan ulashuvchilar uchun.":"For people who share their knowledge.",
    "Ranglar jilosi bilan zamonaviy ramka.":"A modern frame with iridescent colors.",
    "Carbon avatar ramkasi":"Carbon avatar frame",
    "Minimal qoramtir premium ramka.":"A minimal dark premium frame.",
    "Aurora avatar ramkasi":"Aurora avatar frame",
    "Yashil va binafsha rangli yorqin ramka.":"A bright frame in green and violet."
  });

  Object.assign(UI_TRANSLATIONS.ru, {
    "Har bir qadamingizni ko'rib boring":"Отслеживайте каждый свой шаг",
    "yoki":"или",
    "Mukofotlar do'koni":"Магазин наград",
    "Oyna":"Окно"
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Har bir qadamingizni ko'rib boring":"See every step of your journey",
    "yoki":"or",
    "Mukofotlar do'koni":"Rewards shop",
    "Oyna":"Window"
  });

  // Localize data-driven rank, achievement and reward catalog labels as well.
  Object.assign(UI_TRANSLATIONS.ru, {
    "Diqqat Pro":"Diqqat Pro",
    "Boshlovchi":"Новичок","Izlanuvchi":"Исследователь","Harakatdagi":"В движении","Intiluvchan":"Целеустремлённый","Tirishqoq":"Усердный","Mahoratli":"Опытный","Strateg":"Стратег","Yetakchi":"Лидер","Usta":"Мастер","Afsona":"Легенда",
    "Birinchi qadam":"Первый шаг","Birinchi vazifangizni bajaring.":"Выполните свою первую задачу.","Harakat boshlandi":"Начало положено","5 ta vazifani bajaring.":"Выполните 5 задач.","Tinimsiz harakat":"Постоянное движение","10 ta vazifani bajaring.":"Выполните 10 задач.","Maqsad sari":"К цели","Birinchi maqsadingizni yakunlang.":"Завершите свою первую цель.","Maqsadlar ustasi":"Мастер целей","3 ta maqsadni yakunlang.":"Завершите 3 цели.","500 ochko to‘plang.":"Наберите 500 очков.","Minglik marrasi":"Рубеж в тысячу","1000 ochko to‘plang.":"Наберите 1000 очков.","Barqaror intizom":"Стабильная дисциплина","25 ta vazifani bajaring.":"Выполните 25 задач.","Mehnat chempioni":"Чемпион труда","50 ta vazifani bajaring.":"Выполните 50 задач.","Yuz qadam":"Сто шагов","100 ta vazifani bajaring.":"Выполните 100 задач.","Katta orzular":"Большие мечты","5 ta maqsad yarating.":"Создайте 5 целей.","Rejalar me’mori":"Архитектор планов","10 ta maqsad yarating.":"Создайте 10 целей.","Birinchi marralar":"Первые рубежи","250 XP to‘plang.":"Наберите 250 XP.","Kuchli salohiyat":"Большой потенциал","2500 XP to‘plang.":"Наберите 2500 XP.","Afsonaviy natija":"Легендарный результат","5000 XP to‘plang.":"Наберите 5000 XP.","Kun tartibi ustasi":"Мастер распорядка","Kun tartibiga 10 ta band kiriting.":"Добавьте 10 пунктов в распорядок.",
    "Okean mavzusi":"Тема Ocean","Zumrad mavzusi":"Тема Emerald","Shafaq mavzusi":"Тема Sunset","Atirgul mavzusi":"Тема Rose","Yarim tun foni":"Фон Midnight","Galaktika foni":"Фон Galaxy","Qirollik foni":"Фон Royal","Diqqat belgisi":"Значок Focus","Olmos belgisi":"Значок Diamond","Sky mavzusi":"Тема Sky","Gilos gullari profil foni":"Фон профиля Sakura","Tumanlik profil foni":"Фон профиля Nebula","Quruvchi belgisi":"Значок Builder","Oltin avatar ramkasi":"Золотая рамка аватара","Maxsus avatar ramkasi":"Премиум-рамка аватара","Forest profil foni":"Лесной фон профиля","Quyosh chiqishi profil foni":"Фон профиля Sunrise","Olim belgisi":"Значок Scholar","Kashfiyotchi belgisi":"Значок Explorer","Lavanda mavzusi":"Тема Lavender","Yalpiz mavzusi":"Тема Mint","Ketma-ketlik belgisi":"Значок Streak","Billur avatar ramkasi":"Кристальная рамка аватара","Olov avatar ramkasi":"Огненная рамка аватара","Grafit mavzusi":"Тема Graphite","Muz mavzusi":"Тема Ice","Qahrabo mavzusi":"Тема Amber","Prism avatar ramkasi":"Рамка аватара Prism",
    "AI vazifani baholay olmadi.":"AI не смог оценить задачу.","XP hisoblashda xatolik.":"Ошибка при начислении XP.","Bu mahsulot sizda allaqachon mavjud.":"Этот предмет у вас уже есть.","Xarid vaqtida xatolik yuz berdi.":"Ошибка при покупке.","AI javob yozmoqda...":"AI печатает...","AI bilan bog‘lanib bo‘lmadi.":"Не удалось связаться с AI.","AI bo‘sh javob qaytardi. Qayta urinib ko‘ring.":"AI вернул пустой ответ. Попробуйте ещё раз.","AI hozircha javob bera olmadi.":"AI пока не смог ответить.","AI reja tuzishda xatolik yuz berdi.":"Ошибка при создании плана AI.","AI reja formatini tushunib bo‘lmadi. Qayta urinib ko‘ring.":"Не удалось распознать формат плана AI. Попробуйте ещё раз.","AI yaratgan vaqtlar noto‘g‘ri formatda.":"AI вернул время в неверном формате.","Mavjud bandlaringiz saqlandi, AI yangi mashg‘ulotlarni qo‘shdi.":"Существующие пункты сохранены, AI добавил новые занятия."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Diqqat Pro":"Diqqat Pro",
    "Boshlovchi":"Beginner","Izlanuvchi":"Explorer","Harakatdagi":"On the move","Intiluvchan":"Driven","Tirishqoq":"Persistent","Mahoratli":"Skilled","Strateg":"Strategist","Yetakchi":"Leader","Usta":"Master","Afsona":"Legend",
    "Birinchi qadam":"First step","Birinchi vazifangizni bajaring.":"Complete your first task.","Harakat boshlandi":"Momentum started","5 ta vazifani bajaring.":"Complete 5 tasks.","Tinimsiz harakat":"Steady progress","10 ta vazifani bajaring.":"Complete 10 tasks.","Maqsad sari":"Toward a goal","Birinchi maqsadingizni yakunlang.":"Complete your first goal.","Maqsadlar ustasi":"Goal master","3 ta maqsadni yakunlang.":"Complete 3 goals.","500 ochko to‘plang.":"Earn 500 points.","Minglik marrasi":"The thousand mark","1000 ochko to‘plang.":"Earn 1,000 points.","Barqaror intizom":"Consistent discipline","25 ta vazifani bajaring.":"Complete 25 tasks.","Mehnat chempioni":"Work champion","50 ta vazifani bajaring.":"Complete 50 tasks.","Yuz qadam":"One hundred steps","100 ta vazifani bajaring.":"Complete 100 tasks.","Katta orzular":"Big dreams","5 ta maqsad yarating.":"Create 5 goals.","Rejalar me’mori":"Architect of plans","10 ta maqsad yarating.":"Create 10 goals.","Birinchi marralar":"First milestones","250 XP to‘plang.":"Earn 250 XP.","Kuchli salohiyat":"Great potential","2500 XP to‘plang.":"Earn 2,500 XP.","Afsonaviy natija":"Legendary result","5000 XP to‘plang.":"Earn 5,000 XP.","Kun tartibi ustasi":"Routine master","Kun tartibiga 10 ta band kiriting.":"Add 10 items to your daily routine.",
    "Okean mavzusi":"Ocean theme","Zumrad mavzusi":"Emerald theme","Shafaq mavzusi":"Sunset theme","Atirgul mavzusi":"Rose theme","Yarim tun foni":"Midnight background","Galaktika foni":"Galaxy background","Qirollik foni":"Royal background","Diqqat belgisi":"Diqqat belgisi","Olmos belgisi":"Olmos belgisi","Sky mavzusi":"Sky theme","Gilos gullari profil foni":"Sakura profile background","Tumanlik profil foni":"Nebula profile background","Quruvchi belgisi":"Builder badge","Oltin avatar ramkasi":"Gold avatar frame","Maxsus avatar ramkasi":"Premium avatar frame","Forest profil foni":"Forest profile background","Quyosh chiqishi profil foni":"Sunrise profile background","Olim belgisi":"Scholar badge","Kashfiyotchi belgisi":"Explorer badge","Lavanda mavzusi":"Lavender theme","Yalpiz mavzusi":"Mint theme","Ketma-ketlik belgisi":"Streak badge","Billur avatar ramkasi":"Crystal avatar frame","Olov avatar ramkasi":"Flame avatar frame","Grafit mavzusi":"Graphite theme","Muz mavzusi":"Ice theme","Qahrabo mavzusi":"Amber theme","Prism avatar ramkasi":"Prism avatar frame",
    "AI vazifani baholay olmadi.":"AI could not evaluate the task.","XP hisoblashda xatolik.":"Error calculating XP.","Bu mahsulot sizda allaqachon mavjud.":"You already own this item.","Xarid vaqtida xatolik yuz berdi.":"An error occurred during purchase.","AI javob yozmoqda...":"AI is typing...","AI bilan bog‘lanib bo‘lmadi.":"Could not connect to AI.","AI bo‘sh javob qaytardi. Qayta urinib ko‘ring.":"AI returned an empty response. Please try again.","AI hozircha javob bera olmadi.":"AI could not respond right now.","AI reja tuzishda xatolik yuz berdi.":"An error occurred while creating the AI plan.","AI reja formatini tushunib bo‘lmadi. Qayta urinib ko‘ring.":"Could not understand the AI plan format. Please try again.","AI yaratgan vaqtlar noto‘g‘ri formatda.":"AI returned times in an invalid format.","Mavjud bandlaringiz saqlandi, AI yangi mashg‘ulotlarni qo‘shdi.":"Your existing items were kept and AI added new activities."
  });

  // Translate exact and data-driven UI messages (for example, a goal title inside a toast).
  Object.assign(UI_TRANSLATIONS.ru, {
    "Bu xarid uchun ochkolaringiz yetarli emas.":"Недостаточно очков для этой покупки.",
    "XP yechishda xatolik yuz berdi.":"Ошибка при списании XP.",
    "Parol 8–128 belgi bo‘lishi kerak.":"Пароль должен содержать от 8 до 128 символов.",
    "Xush kelibsiz!":"Добро пожаловать!",
    "Vazifa nomini kiriting.":"Введите название задачи.",
    "Bugun shu mazmundagi vazifa uchun XP avval berilgan.":"Сегодня за задачу с таким содержанием XP уже начислялись.",
    "AI vazifani tekshirdi, lekin bu safar XP ajratilmadi.":"AI проверил задачу, но в этот раз XP не начислены.",
    "Vazifa qayta ochildi. Avval berilgan XP qaytarib olinmaydi.":"Задача снова открыта. Ранее начисленные XP не возвращаются.",
    "Mahsulot profilingizga qo‘llandi.":"Предмет применён к вашему профилю.",
    "Bajarilgan band va uning XP bahosi o‘zgartirilmaydi.":"Выполненный пункт и начисленные XP нельзя изменить.",
    "Kun tartibi bandi serverga saqlanmadi. Internetni tekshirib qayta urinib ko‘ring.":"Не удалось сохранить пункт распорядка на сервере. Проверьте интернет и повторите попытку.",
    "Kun tartibi saqlandi.":"Распорядок сохранён.",
    "Ilova ichidagi eslatmalar yoqildi. Brauzer xabarlari bloklangan.":"Внутренние напоминания включены. Уведомления браузера заблокированы.",
    "Ilova ichidagi eslatmalar yoqildi. Brauzer xabarlariga ruxsat berilmadi.":"Внутренние напоминания включены. Разрешение на уведомления браузера не предоставлено.",
    "Sarlavha kiriting.":"Введите заголовок.",
    "Profil va yutuqlar uchun jami 8 tagacha rasm saqlash mumkin.":"Для профиля и достижений можно сохранить до 8 изображений.",
    "Zaxira fayli tayyorlandi.":"Резервная копия подготовлена.",
    "Fayl hajmi 5 MB dan oshmasligi kerak.":"Размер файла не должен превышать 5 МБ.",
    "Ma’lumotlar tiklandi.":"Данные восстановлены.",
    "Bu SmartGoal zaxira fayli emas yoki buzilgan.":"Это не резервная копия SmartGoal или файл повреждён.",
    "Kun tartibidan band o‘chirildi.":"Пункт распорядка удалён.",
    "Maqsad o‘chirildi.":"Цель удалена.",
    "Vazifa o‘chirildi.":"Задача удалена.",
    "Profil havolasi nusxalandi.":"Ссылка на профиль скопирована.",
    "Havolani nusxalab bo‘lmadi.":"Не удалось скопировать ссылку.",
    "Xotira o‘chirildi.":"Воспоминание удалено.",
    "Rang mavzusi o‘zgartirildi.":"Цветовая тема изменена.",
    "Interfeys sozlamalari asliga qaytarildi.":"Настройки интерфейса сброшены.",
    "Parolni tiklash backend ulanganda qo‘shiladi.":"Восстановление пароля появится после подключения серверной части.",
    "Tug‘ilgan sanani tekshiring.":"Проверьте дату рождения."
  });
  Object.assign(UI_TRANSLATIONS.en, {
    "Bu xarid uchun ochkolaringiz yetarli emas.":"Not enough points for this purchase.",
    "XP yechishda xatolik yuz berdi.":"An error occurred while deducting XP.",
    "Parol 8–128 belgi bo‘lishi kerak.":"Password must be 8–128 characters.",
    "Xush kelibsiz!":"Welcome!",
    "Vazifa nomini kiriting.":"Enter a task title.",
    "Bugun shu mazmundagi vazifa uchun XP avval berilgan.":"XP has already been awarded today for a task with similar content.",
    "AI vazifani tekshirdi, lekin bu safar XP ajratilmadi.":"AI reviewed the task, but no XP was awarded this time.",
    "Vazifa qayta ochildi. Avval berilgan XP qaytarib olinmaydi.":"Task reopened. Previously awarded XP will not be refunded.",
    "Mahsulot profilingizga qo‘llandi.":"Item applied to your profile.",
    "Bajarilgan band va uning XP bahosi o‘zgartirilmaydi.":"A completed routine item and its XP award cannot be changed.",
    "Kun tartibi bandi serverga saqlanmadi. Internetni tekshirib qayta urinib ko‘ring.":"The routine item could not be saved to the server. Check your connection and try again.",
    "Kun tartibi saqlandi.":"Daily routine saved.",
    "Ilova ichidagi eslatmalar yoqildi. Brauzer xabarlari bloklangan.":"In-app reminders are enabled. Browser notifications are blocked.",
    "Ilova ichidagi eslatmalar yoqildi. Brauzer xabarlariga ruxsat berilmadi.":"In-app reminders are enabled. Browser notification permission was not granted.",
    "Sarlavha kiriting.":"Enter a title.",
    "Profil va yutuqlar uchun jami 8 tagacha rasm saqlash mumkin.":"You can save up to 8 images for your profile and achievements.",
    "Zaxira fayli tayyorlandi.":"Backup file is ready.",
    "Fayl hajmi 5 MB dan oshmasligi kerak.":"File size must not exceed 5 MB.",
    "Ma’lumotlar tiklandi.":"Data restored.",
    "Bu SmartGoal zaxira fayli emas yoki buzilgan.":"This is not a SmartGoal backup file or it is corrupted.",
    "Kun tartibidan band o‘chirildi.":"Routine item deleted.",
    "Maqsad o‘chirildi.":"Goal deleted.",
    "Vazifa o‘chirildi.":"Task deleted.",
    "Profil havolasi nusxalandi.":"Profile link copied.",
    "Havolani nusxalab bo‘lmadi.":"Could not copy the link.",
    "Xotira o‘chirildi.":"Memory deleted.",
    "Rang mavzusi o‘zgartirildi.":"Color theme updated.",
    "Interfeys sozlamalari asliga qaytarildi.":"Interface settings were reset.",
    "Parolni tiklash backend ulanganda qo‘shiladi.":"Password recovery will be added when the backend is connected.",
    "Tug‘ilgan sanani tekshiring.":"Check your date of birth."
  });

  function translateUIString(value, dictionary = UI_TRANSLATIONS[settings.language] || {}) {
    const raw = String(value ?? "");
    const normalized = raw.trim().replace(/\s+/g, " ");
    if (dictionary[raw] !== undefined) return dictionary[raw];
    if (dictionary[normalized] !== undefined) return dictionary[normalized];

    const language = settings.language;
    let match = normalized.match(/^Maqsad topildi:\s*(.+)$/);
    if (match) return language === "ru" ? "Найдена цель: " + match[1] : language === "en" ? "Goal found: " + match[1] : raw;
    match = normalized.match(/^Vazifa topildi:\s*(.+)$/);
    if (match) return language === "ru" ? "Найдена задача: " + match[1] : language === "en" ? "Task found: " + match[1] : raw;
    match = normalized.match(/^(.+) muvaffaqiyatli xarid qilindi!$/);
    if (match) {
      const itemName = dictionary[match[1]] || match[1];
      return language === "ru" ? itemName + " успешно куплен!" : language === "en" ? itemName + " purchased successfully!" : raw;
    }
    return raw;
  }

  function translateVisibleUI(root = document.body) {
    if (!root) return;
    const dictionary = UI_TRANSLATIONS[settings.language] || {};
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script,style,textarea,input,[contenteditable='true']")) continue;
      if (!translationOriginalText.has(node)) translationOriginalText.set(node, node.nodeValue || "");
      const original = translationOriginalText.get(node), trimmed = original.trim();
      if (!trimmed) continue;
      // HTML line wrapping can insert indentation/newlines inside a text node.
      // Normalize whitespace before dictionary lookup so the same phrase is
      // translated consistently regardless of its markup formatting.
      const translated = translateUIString(trimmed, dictionary);
      node.nodeValue = original.replace(trimmed, translated);
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

  function syncNavigationState() {
    $$(".nav-link").forEach(button => {
      button.classList.toggle("active", button.dataset.page === currentPage);
    });

    const title = $("#page-title");
    if (title) title.textContent = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;
    document.title = (PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard) + " | SmartGoal";
  }

  function navigate(page, options = {}) {
    if (!PAGE_TITLES[page]) return;

    currentPage = page;
    const targetPath = PAGE_ROUTES[page];
    if (targetPath && window.location.pathname !== targetPath) {
      const method = options.replace ? "replaceState" : "pushState";
      window.history[method]({ smartGoalPage: page }, "", targetPath);
    }

    syncNavigationState();
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
    if (lastTranslatedLanguage !== settings.language) {
      translateVisibleUI(document.body);
      lastTranslatedLanguage = settings.language;
    } else {
      translateVisibleUI(content);
    }

    updateProfileDisplay();
    updateSidebarPoints();
    updateNotificationIndicators();
    updateCurrentDate();
    const localizedPageTitle = (UI_TRANSLATIONS[settings.language] || {})[PAGE_TITLES[currentPage]] || PAGE_TITLES[currentPage];
    document.title = localizedPageTitle + " | SmartGoal";
    refreshIcons(content);
    refreshIcons($("#sidebar-avatar"));
    refreshIcons($("#topbar-avatar"));
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

    const communityTab = event.target.closest("[data-community-tab]");
    if (communityTab) {
      const selected = communityTab.dataset.communityTab;
      document.querySelectorAll("[data-community-tab]").forEach(button => button.classList.toggle("active", button === communityTab));
      document.querySelectorAll("[data-community-panel]").forEach(panel => panel.classList.toggle("hidden", panel.dataset.communityPanel !== selected));
      return;
    }

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
      case "show-terms": {event.preventDefault();const lang=settings.language||"uz";const docs={uz:`<div class="terms-document"><p><strong>SmartGoal’dan foydalanishdan oldin quyidagi qoidalarni diqqat bilan o‘qing.</strong> Hisob yaratish orqali siz ularga amal qilishga rozilik bildirasiz.</p><ol><li><strong>Yosh va ma’lumotlarning haqqoniyligi.</strong> Tug‘ilgan sana, ism, email va boshqa ma’lumotlarni to‘g‘ri kiriting. Boshqa shaxs nomidan hisob ochmang. 13 yoshga to‘lmagan foydalanuvchilar hozircha ro‘yxatdan o‘ta olmaydi.</li><li><strong>Hisob xavfsizligi.</strong> Parolingizni hech kimga bermang, kuchli va noyob parol tanlang. Hisobingiz orqali sodir bo‘lgan harakatlar uchun javobgarlik sizga tegishli. Begona hisobga kirishga urinmang.</li><li><strong>Smart AI’dan mas’uliyatli foydalanish.</strong> AI tavsiyalari yordamchi xarakterga ega va har doim ham xatosiz bo‘lmasligi mumkin. Muhim ta’limiy, moliyaviy, sog‘liq yoki hayotiy qarorlarni faqat AI javobiga asoslanib qabul qilmang; zarur bo‘lsa, ishonchli mutaxassis bilan tekshiring.</li><li><strong>Hurmatli muloqot.</strong> Boshqa foydalanuvchilar va administratorlarga hurmat bilan munosabatda bo‘ling. Haqorat, kamsitish, tahdid, ta’qib, nafrat uyg‘otuvchi yoki zo‘ravonlikka undovchi xatti-harakatlar taqiqlanadi.</li><li><strong>Halol foydalanish va XP.</strong> XP, reyting, yutuq va mukofotlarni sun’iy oshirmang; vazifalarni ataylab mayda qismlarga bo‘lib tizimni aldashga, xatolar yoki texnik zaifliklardan foydalanishga urinmang. Mukofotlar bekor qilinishi yoki hisob cheklanishi mumkin.</li><li><strong>Platforma va texnik xavfsizlik.</strong> Spam, zararli dastur, virus, fishing, zararli havola, avtomatlashtirilgan hujum, ruxsatsiz kirish yoki xizmat ishiga xalaqit beruvchi harakatlarni amalga oshirmang. Platformani teskari tahlil qilish yoki himoyani chetlab o‘tish taqiqlanadi.</li><li><strong>Maxfiylik va shaxsiy ma’lumotlar.</strong> O‘zingizning yoki boshqalarning maxfiy ma’lumotlarini ruxsatsiz joylashtirmang. Parol, telefon, manzil va boshqa nozik ma’lumotlarni ommaviy chat yoki profilga yozmang. Boshqa foydalanuvchilarning ma’lumotlarini yig‘mang yoki tarqatmang.</li><li><strong>Kontent va qonuniylik.</strong> Noqonuniy, mualliflik huquqini buzuvchi, firibgarlik yoki zarar yetkazishga qaratilgan materiallarni tarqatmang. Saytdan faqat qonuniy va konstruktiv maqsadlarda foydalaning.</li><li><strong>Xizmatning ishlashi.</strong> SmartGoal ayrim funksiyalarni yangilashi, vaqtincha to‘xtatishi yoki texnik xizmat ko‘rsatishi mumkin. Ma’lumotlaringizni himoya qilish uchun hisobingizga oid maxfiy ma’lumotlarni ulashmang va mavjud eksport/zaxira imkoniyatlaridan foydalaning.</li><li><strong>Qoidabuzarlik oqibatlari.</strong> Qoidalar buzilganda kontent olib tashlanishi, XP yoki mukofotlar qayta ko‘rib chiqilishi, ayrim funksiyalar cheklanishi yoki hisob vaqtincha/to‘liq bloklanishi mumkin.</li><li><strong>O‘zgarishlar va aloqa.</strong> Shartlar platforma rivojlanishi bilan yangilanishi mumkin. Muhim o‘zgarishlarni e’lon qilamiz; xizmatdan foydalanishni davom ettirish yangilangan qoidalarga rozilikni anglatadi.</li></ol><p><strong>Eslatma:</strong> SmartGoal samarali rejalashtirishga yordam beradi, ammo natijani kafolatlamaydi. Maqsad va rejalaringizni o‘zingiz nazorat qiling.</p></div>`,ru:`<div class="terms-document"><p><strong>Перед использованием SmartGoal внимательно ознакомьтесь с правилами.</strong> Создавая аккаунт, вы соглашаетесь их соблюдать.</p><ol><li><strong>Возраст и достоверность данных.</strong> Указывайте настоящую дату рождения, имя, email и другие данные. Не создавайте аккаунт от имени другого человека. Пользователи младше 13 лет пока не могут зарегистрироваться.</li><li><strong>Безопасность аккаунта.</strong> Не сообщайте пароль другим, используйте надёжный уникальный пароль и не пытайтесь входить в чужие аккаунты.</li><li><strong>Ответственное использование ИИ.</strong> Советы Smart AI носят вспомогательный характер и могут содержать ошибки. Не принимайте важные решения только на основании ответа ИИ; при необходимости проверяйте информацию у специалиста.</li><li><strong>Уважительное общение.</strong> Запрещены оскорбления, дискриминация, угрозы, травля, разжигание ненависти и призывы к насилию в отношении пользователей и администраторов.</li><li><strong>Честность и XP.</strong> Не накручивайте XP, рейтинг и достижения, не дробите задачи ради обхода правил и не используйте ошибки системы. Награды могут быть отменены, а аккаунт ограничен.</li><li><strong>Техническая безопасность.</strong> Запрещены спам, вредоносные программы, вирусы, фишинг, вредоносные ссылки, атаки, несанкционированный доступ и вмешательство в работу сервиса.</li><li><strong>Конфиденциальность.</strong> Не публикуйте без разрешения личные данные свои и других людей. Не собирайте и не распространяйте чужие данные.</li><li><strong>Контент и законность.</strong> Не распространяйте незаконные материалы, мошеннический контент и материалы, нарушающие авторские права. Используйте платформу законно и конструктивно.</li><li><strong>Работа сервиса.</strong> Функции могут обновляться, временно приостанавливаться или обслуживаться. Не передавайте секретные данные аккаунта и используйте доступные способы резервного копирования.</li><li><strong>Последствия нарушений.</strong> При нарушениях контент может быть удалён, XP и награды пересмотрены, функции ограничены, а аккаунт временно или полностью заблокирован.</li><li><strong>Изменения правил.</strong> Условия могут обновляться по мере развития платформы. Продолжение использования означает согласие с обновлёнными правилами.</li></ol><p><strong>Примечание:</strong> SmartGoal помогает планировать, но не гарантирует результат. Контролируйте свои цели и решения самостоятельно.</p></div>`,en:`<div class="terms-document"><p><strong>Please read these rules carefully before using SmartGoal.</strong> By creating an account, you agree to follow them.</p><ol><li><strong>Age and truthful information.</strong> Enter your real date of birth, name, email, and other details. Do not impersonate anyone. Users under 13 cannot register at this time.</li><li><strong>Account security.</strong> Keep your password private, use a strong unique password, and never attempt to access another person's account.</li><li><strong>Responsible AI use.</strong> Smart AI suggestions are assistive and may be inaccurate. Do not base important decisions solely on AI output; verify information with a qualified person when needed.</li><li><strong>Respectful communication.</strong> Insults, discrimination, threats, harassment, hate speech, and encouragement of violence toward users or administrators are prohibited.</li><li><strong>Fair use and XP.</strong> Do not manipulate XP, rankings, or achievements, split tasks to exploit the system, or abuse bugs. Rewards may be reversed and accounts restricted.</li><li><strong>Platform security.</strong> Spam, malware, viruses, phishing, malicious links, automated attacks, unauthorized access, and interference with the service are prohibited.</li><li><strong>Privacy and personal data.</strong> Do not publish private information about yourself or others without permission. Do not collect or distribute other users' personal data.</li><li><strong>Content and lawful use.</strong> Do not distribute illegal, fraudulent, harmful, or copyright-infringing material. Use the platform only for lawful and constructive purposes.</li><li><strong>Service availability.</strong> Features may be updated, temporarily suspended, or maintained. Protect your account secrets and use available export or backup options.</li><li><strong>Enforcement.</strong> Violations may result in content removal, XP or reward adjustments, feature restrictions, or temporary/permanent account suspension.</li><li><strong>Changes to these terms.</strong> Rules may change as the platform evolves. Continued use means acceptance of updated terms.</li></ol><p><strong>Note:</strong> SmartGoal supports better planning but does not guarantee outcomes. You remain responsible for your goals and decisions.</p></div>`};const title={uz:"Foydalanish shartlari",ru:"Условия использования",en:"Terms of Use"},ok={uz:"Tushunarli",ru:"Понятно",en:"Got it"};openModal(title[lang],docs[lang],`<button type="button" class="primary-button" data-action="close-modal">${ok[lang]}</button>`);break;}

      case "view-profile":
        openPublicProfile(actionElement.dataset.username);
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
      case "routine-status":
        setRoutineStatus(id, actionElement.dataset.status);
        break;
      case "generate-routine-advice":
        generateRoutineAdvice();
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
      case "locked-theme": { const theme=actionElement.dataset.colorTheme,lang=settings.language||"uz";const msg={uz:"Bu rang hali ochilmagan. Avval do‘kondan xarid qiling.",ru:"Эта тема ещё закрыта. Сначала приобретите её в магазине.",en:"This theme is locked. Purchase it in the shop first."};const buy={uz:"Xarid qilish",ru:"Купить",en:"Purchase"};openModal(lang==="ru"?"Тема заблокирована":lang==="en"?"Theme locked":"Mavzu ochilmagan",`<p>${msg[lang]}</p>`,`<button type="button" class="primary-button" data-action="shop-theme" data-theme="${escapeHTML(theme)}">${buy[lang]}</button>`);break;}
      case "shop-theme": {const theme=actionElement.dataset.theme;storeFilter="theme";closeModal();navigate("rewards");requestAnimationFrame(()=>document.getElementById("store-item-theme-"+theme)?.scrollIntoView({behavior:"smooth",block:"center"}));break;}

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

      case "reset-preferences":
        openModal("Sozlamalarni asliga qaytarish", "<p>Til, kun/tun rejimi, rang mavzusi, matn hajmi, ovoz va animatsiyalar standart holatga qaytariladi.</p>", '<button class="secondary-button" type="button" data-action="close-modal">Bekor qilish</button><button class="primary-button" type="button" data-action="confirm-reset-preferences">Tiklash</button>');
        break;
      case "confirm-reset-preferences":
        settings = { ...settings, language: DEFAULT_SETTINGS.language, theme: DEFAULT_SETTINGS.theme, colorTheme: DEFAULT_SETTINGS.colorTheme, fontSize: DEFAULT_SETTINGS.fontSize, sound: DEFAULT_SETTINGS.sound, reducedMotion: DEFAULT_SETTINGS.reducedMotion };
        saveSettings();
        closeModal();
        currentSettingsTab = "general";
        render();
        showToast("Interfeys sozlamalari asliga qaytarildi.");
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
      case "confirm-clear-selected":
        clearSelectedData();
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
        event.preventDefault();
        const input = document.getElementById(actionElement.dataset.target);
        if (!input) break;
        const visible = input.type === "password";
        input.type = visible ? "text" : "password";
        actionElement.innerHTML = icon(visible ? "eye-off" : "eye", 18);
        actionElement.setAttribute("aria-label", visible ? "Parolni yashirish" : "Parolni ko‘rsatish");
        actionElement.setAttribute("aria-pressed", String(visible));
        refreshIcons(actionElement);
        input.focus({ preventScroll: true });
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

    if (target.matches("[data-delete-scope='all']")) {
      Array.from(document.querySelectorAll("#modal-body [data-delete-scope]")).forEach(input => {
        if (input !== target) input.checked = target.checked;
      });
      return;
    }

    if (target.matches("#modal-body [data-delete-scope]")) {
      const all = $("#modal-body [data-delete-scope='all']");
      const options = Array.from(document.querySelectorAll("#modal-body [data-delete-scope]:not([data-delete-scope='all'])"));
      const checked = options.filter(input => input.checked).length;
      if (all) {
        all.checked = checked === options.length;
        all.indeterminate = checked > 0 && checked < options.length;
      }
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
      const response=await apiFetch("/api/users/leaderboard",{credentials:"same-origin"});
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
      const response = await apiFetch("/api/users/profile?username=" + encodeURIComponent(username), {credentials:"same-origin"});
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success || !result.profile) throw new Error(result.message || "Profilni yuklab bo‘lmadi.");
      const p = result.profile, rank = getRank(Number(p.totalEarnedXP || p.xp || 0));
      const covers = {default:"linear-gradient(120deg,#5145cf,#9282f6)",midnight:"linear-gradient(120deg,#101827,#283958)",galaxy:"radial-gradient(circle at 80% 20%,#7256c9,#161b43 65%)",royal:"linear-gradient(120deg,#7c4a20,#d3a24b)",sakura:"linear-gradient(120deg,#e7a5bd,#8b6bba)",nebula:"radial-gradient(circle at 25% 25%,#a35ac8,#111b3c 70%)",aurora:"linear-gradient(130deg,#123d43,#5b4a9a 55%,#a3d5c6)",forest:"linear-gradient(130deg,#102f26,#39745a 55%,#b4c99a)",sunrise:"linear-gradient(130deg,#713f57,#e18c70 55%,#f5d99a)",coral:"linear-gradient(130deg,#7c3448,#e57e73 55%,#ffd0a6)",ember:"linear-gradient(130deg,#271d2e,#8b3c36 55%,#f1a15a)",ocean:"linear-gradient(130deg,#092d46,#167a9b 55%,#75c8d8)",mountain:"linear-gradient(130deg,#27384c,#71879a 55%,#c9d4d8)","aurora-night":"linear-gradient(130deg,#071d32,#265b68 55%,#7d67a8)"};
      const avatar = p.avatar ? '<img src="'+escapeHTML(p.avatar)+'" alt="Profil rasmi" loading="lazy" decoding="async">' : icon("user-round",40);
      const avatarFrame = ["premium","gold","neon","crystal","flame","prism","carbon","aurora"].includes(p.avatarFrame) ? " avatar-frame-"+p.avatarFrame : "";
      const badge = p.activeBadge ? '<span class="profile-active-badge">'+icon("award",13)+' '+escapeHTML(p.activeBadge)+'</span>' : "";
      const birthday = p.birthdate ? '<div class="profile-public-stat">'+icon("cake")+" "+escapeHTML(formatDate(p.birthdate))+'</div>' : "";
      const levelProgress='<section class="public-profile-level"><div class="public-profile-level-head"><strong>Level '+rank.level+' · '+escapeHTML(rank.name)+'</strong><span>'+Math.round(rank.progress)+'%</span></div><div class="progress-track"><div class="progress-fill" style="width:'+rank.progress+'%"></div></div><small>'+(rank.next?formatNumber(rank.remaining)+' XP keyingi darajagacha':'Eng yuqori daraja')+'</small></section>';
      const achievements = (Array.isArray(p.achievements) ? p.achievements : []).map(raw => {
        const id = typeof raw === "string" ? raw : raw.id;
        const item = ACHIEVEMENTS.find(entry => entry.id === id);
        return item ? '<span class="public-showcase-chip">'+icon(item.icon,14)+' '+escapeHTML(item.name)+'</span>' : "";
      }).join("");
      const inventory = (Array.isArray(p.inventory) ? p.inventory : []).map(raw => {
        const item = STORE_ITEMS.find(entry => entry.id === raw.id);
        return item ? '<span class="public-showcase-chip">'+icon(item.icon,14)+' '+escapeHTML(item.name)+'</span>' : "";
      }).join("");
      const showcase = '<section class="public-showcase"><h3>Yutuqlari</h3><div class="public-showcase-list">'+(achievements||'<small>Hali ochilgan yutuqlar yo‘q.</small>')+'</div><h3>Do‘kondan olingan buyumlar</h3><div class="public-showcase-list">'+(inventory||'<small>Hozircha maxsus buyumlar yo‘q.</small>')+'</div></section>';
      const publicMemories=(Array.isArray(p.memories)?p.memories:[]).map(memory=>`<article class="public-memory-card"><div><strong>${escapeHTML(memory.title||"Yutuq")}</strong><small>${escapeHTML(formatDate(memory.date||""))}</small></div>${memory.image?`<img src="${escapeHTML(memory.image)}" alt="${escapeHTML(memory.title||"Yutuq rasmi")}" loading="lazy" decoding="async">`:""}${memory.description?`<p>${escapeHTML(memory.description)}</p>`:""}</article>`).join("");
      const memoryShowcase=publicMemories?`<section class="public-showcase"><h3>Ommaviy yutuqlar va esdaliklar</h3><div class="public-memory-list">${publicMemories}</div></section>`:"";
      const html = '<div class="public-profile-cover" style="background:'+(covers[p.background]||covers.default)+'"></div><div class="public-profile-body"><div class="public-profile-avatar'+avatarFrame+'">'+avatar+'</div><h2>'+escapeHTML(p.name)+'</h2><p class="profile-username">@'+escapeHTML(p.username)+'</p>'+badge+'<p class="profile-bio">'+escapeHTML(p.bio||"Biografiya qo‘shilmagan.")+'</p><div class="public-profile-stats"><div><strong>'+formatNumber(p.xp)+'</strong><small>XP balansi</small></div><div><strong>'+formatNumber(p.totalEarnedXP||p.xp)+'</strong><small>Jami olgan XP</small></div><div><strong>'+rank.level+'</strong><small>Daraja</small></div></div>'+levelProgress+birthday+'<p class="card-description">Profil bezagi: '+formatNumber(p.customizationScore||0)+' / 5</p>'+showcase+memoryShowcase+'</div>';
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
    if (!query) { results.innerHTML = emptyState("Qidiruvga tayyor", "Username kiriting.", "users"); return; }
    if (query.length < 3) { results.innerHTML = emptyState("Yana belgi kiriting", "Qidiruv uchun kamida 3 ta belgi kerak.", "search"); return; }
    results.innerHTML = emptyState("Qidirilmoqda...", "Foydalanuvchilar tekshirilmoqda.", "loader-circle");
    try {
      const response = await apiFetch("/api/users/search?username=" + encodeURIComponent(query), { method:"GET", credentials:"include", headers:{"Accept":"application/json"} });
      const result = await response.json().catch(() => ({}));
      if (sequence !== communitySearchSequence) return;
      if (!response.ok || !result.success) throw new Error(result.message || "Qidiruv vaqtida xatolik yuz berdi.");
      const users = Array.isArray(result.users) ? result.users : [];
      if (!users.length) { results.innerHTML = emptyState("Foydalanuvchi topilmadi", "Bu username bilan boshlanadigan foydalanuvchi yo‘q.", "user-search"); return; }
      results.innerHTML = users.map(user => `
        <div class="user-item community-user-result">
          <span class="avatar avatar-medium">${icon("user-round")}</span>
          <div class="user-item-info">
            <button class="user-profile-link" type="button" data-action="view-profile" data-username="${escapeHTML(user.username || "")}"><strong>${escapeHTML(user.name || "Foydalanuvchi")}</strong></button>
            <small>@${escapeHTML(user.username || "")} · Level ${getRank(Number(user.totalEarnedXP||user.xp||0)).level} · ${formatNumber(user.totalEarnedXP??user.xp??0)} XP jami${user.username === data.profile.username ? " · Sizning profilingiz" : ""}</small>
          </div>
          <button class="card-action" type="button" data-action="view-profile" data-username="${escapeHTML(user.username || "")}">Profilni ko‘rish</button>
        </div>`).join("");
      refreshIcons();
    } catch (error) {
      if (sequence !== communitySearchSequence) return;
      results.innerHTML = emptyState("Qidiruv ishlamadi", escapeHTML(error.message || "Server bilan bog‘lanib bo‘lmadi."), "alert-circle");
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
      const response = await apiFetch("/api/me", { credentials: "include" });
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
    window.addEventListener("popstate", () => {
      currentPage = resolvePageFromPath();
      syncNavigationState();
      render();
    });

    document.addEventListener("click", handleClick);
    document.addEventListener("change", handleChange);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("invalid", event => { event.preventDefault(); const messages={uz:"Iltimos, ushbu maydonni to‘g‘ri to‘ldiring.",ru:"Пожалуйста, корректно заполните это поле.",en:"Please complete this field correctly."}; showToast(messages[settings.language]||messages.uz,"error"); }, true);
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
    if (!ROUTE_PAGES[window.location.pathname]) {
      window.history.replaceState({ smartGoalPage: currentPage }, "", PAGE_ROUTES[currentPage] || "/");
    }
    syncNavigationState();
    attachEvents();
    initializeSmartGoal();
    setInterval(() => {
      if (currentPage === "planner") render();
      checkRoutineReminders();
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

})();
