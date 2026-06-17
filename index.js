const CONFIG = {
  spreadsheetId: "",
  apiKey: "",
  contentSheetName: "content",
  formspreeEndpoint: "",
  sheetTransport: "api",
  legacySheets: {
    enabled: true,
    supplementOnly: true,
    projectPrefix: "proj-",
    maxProjects: 12
  },
  ...(window.CONNIECEN_SITE_CONFIG || {})
};

const DEFAULT_ROWS = [
  row("site", "main", {
    title: "Connie Cen",
    summary: "Dance/movement therapy, meditative practice, and Taoist-informed wellbeing."
  }),
  row("theme", "accent", { color: "#c75c6e" }),
  row("theme", "accent-soft", { color: "#f3c6d0" }),
  row("theme", "moss", { color: "#607d67" }),
  row("theme", "plum", { color: "#40304d" }),
  row("hero", "main", {
    eyebrow: "Therapeutic movement, music, and contemplative practice",
    title: "Connie Cen",
    summary: "A grounded space for embodied therapy through meditative dance, music, tai chi, and Taoist-informed reflection.",
    tags: "Dance therapy, Tai chi, Music, Taoism"
  }),
  row("practice", "main", {
    summary: "The work combines gentle movement, sound, breath, and inquiry so clients can reconnect with their body without pressure to perform."
  }),
  row("stat", "mind-body", {
    title: "Mind-body",
    summary: "Somatic support and reflective practice",
    order: 1
  }),
  row("stat", "movement", {
    title: "Movement",
    summary: "Dance, tai chi, breath, and rhythm",
    order: 2
  }),
  row("stat", "sound", {
    title: "Sound",
    summary: "Music-led attention and integration",
    order: 3
  }),
  row("offering", "meditative-dance", {
    title: "Meditative Dance",
    summary: "Slow, expressive movement for emotional awareness, grounding, and gentle self-observation.",
    tags: "Movement, Breath",
    order: 1
  }),
  row("offering", "music-listening", {
    title: "Music and Listening",
    summary: "Sound-based reflection sessions that use rhythm, voice, and silence as therapeutic anchors.",
    tags: "Music, Reflection",
    order: 2
  }),
  row("offering", "tai-chi", {
    title: "Tai Chi Foundations",
    summary: "Accessible tai chi-inspired movement for balance, pacing, and attention to internal change.",
    tags: "Tai chi, Nervous system",
    order: 3
  }),
  row("offering", "taoist-reflection", {
    title: "Taoist-Informed Reflection",
    summary: "A contemplative approach to change, rhythm, restraint, and the wisdom of natural cycles.",
    tags: "Taoism, Inquiry",
    order: 4
  }),
  row("about", "main", {
    eyebrow: "About",
    title: "A practice shaped by movement, listening, and cultural memory.",
    body: "Connie's work sits at the intersection of therapeutic care, meditative dance, music, tai chi, and Taoist thought.\n\nHer sessions are designed to feel attentive and unhurried: a place to notice sensation, restore agency, and make meaning through the body as well as words.",
    media_url: "https://drive.google.com/file/d/19cLwbyRq6YorLtdr89_RFPRDIixV_0Pz/view?usp=sharing",
    media_type: "image",
    link_label: "Resume",
    link_url: "",
    order: 1
  }),
  row("process", "arrive", {
    title: "Arrive",
    summary: "Begin with breath, attention, and a clear sense of what the body is carrying.",
    order: 1
  }),
  row("process", "listen", {
    title: "Listen",
    summary: "Use music, silence, and guided noticing to identify texture before interpretation.",
    order: 2
  }),
  row("process", "move", {
    title: "Move",
    summary: "Let gesture, tai chi, and dance create a precise but gentle working language.",
    order: 3
  }),
  row("process", "integrate", {
    title: "Integrate",
    summary: "Close with practical reflection that can travel back into daily life.",
    order: 4
  }),
  row("work", "main", {
    summary: "Projects can be added, hidden, reordered, and expanded from the spreadsheet without changing code."
  }),
  row("project", "embodied-listening", {
    title: "Embodied Listening Workshop",
    summary: "A small-group workshop using music, paired reflection, and movement scores to build embodied attention.",
    tags: "Workshop, Music, Movement",
    order: 1
  }),
  row("project", "cherry-blossom-study", {
    title: "Cherry Blossom Movement Study",
    summary: "A seasonal practice inspired by sakura: impermanence, softness, rhythm, and renewal.",
    tags: "Sakura, Dance, Contemplation",
    order: 2
  }),
  row("project", "tai-chi-breath", {
    title: "Tai Chi and Breath Series",
    summary: "A sequence of accessible sessions focused on balance, recovery, and embodied steadiness.",
    tags: "Tai chi, Breath, Group practice",
    order: 3
  }),
  row("project_block", "embodied-listening", {
    title: "Format",
    body: "Participants move through a low-pressure sequence: arrival, listening, simple gestures, journaling, and group integration.",
    order: 1
  }),
  row("project_block", "embodied-listening", {
    title: "Intention",
    body: "The workshop gives participants tools for noticing emotion through rhythm and posture without forcing a fixed narrative.",
    order: 2
  }),
  row("project_block", "cherry-blossom-study", {
    title: "Seasonal prompt",
    body: "Cherry blossoms offer a visual language for beauty, change, and the short life of each moment. The movement study turns that language into breath, pacing, and gesture.",
    order: 1
  }),
  row("project_block", "tai-chi-breath", {
    title: "Session arc",
    body: "Each session starts with stance and breath, then moves into slow weight shifts, hand forms, and quiet reflection.",
    order: 1
  }),
  row("contact", "main", {
    eyebrow: "Contact",
    title: "For sessions, workshops, and collaborations.",
    summary: "Share a little about what you are looking for, and Connie will respond with next steps.",
    order: 1
  }),
  row("social", "email", {
    title: "Email",
    link_url: "mailto:hello@example.com",
    order: 1
  }),
  row("social", "facebook", {
    title: "Facebook",
    link_url: "https://www.facebook.com/kangying.cen/",
    order: 2
  })
];

const STYLE_VARIABLES = {
  accent: "--color-accent",
  "accent-soft": "--color-accent-soft",
  moss: "--color-moss",
  plum: "--color-plum",
  ink: "--color-ink",
  muted: "--color-muted",
  surface: "--color-surface",
  paper: "--color-paper"
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindNavigation();
  bindContactForm();
  setText("[data-content='site.title']", "Connie Cen", true);
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  const { rows, source } = await loadRows();
  document.documentElement.dataset.contentSource = source;
  renderSite(normalizeRows(rows));
}

function row(section, id, values = {}) {
  return {
    section,
    id,
    title: "",
    eyebrow: "",
    summary: "",
    body: "",
    media_url: "",
    media_type: "",
    link_label: "",
    link_url: "",
    tags: "",
    color: "",
    order: "",
    published: "TRUE",
    ...values
  };
}

async function loadRows() {
  if (CONFIG.spreadsheetId && CONFIG.contentSheetName) {
    try {
      const contentSheetExists = await configuredSheetExists(CONFIG.contentSheetName);
      if (contentSheetExists) {
        const sheetRows = await fetchConfiguredSheetRows(CONFIG.contentSheetName, "A1:N1000");
        const parsed = parseSheetRows(sheetRows);
        if (parsed.length) return { rows: parsed, source: `${CONFIG.sheetTransport}-content-sheet` };
      }
    } catch (err) {
      console.info("Content sheet unavailable; using fallback content.", err);
    }
  }

  if (CONFIG.legacySheets?.enabled && CONFIG.spreadsheetId) {
    try {
      const legacyRows = await loadLegacyRows();
      if (legacyRows.length) {
        if (CONFIG.legacySheets.supplementOnly !== false) {
          return { rows: mergeRows(DEFAULT_ROWS, legacyRows), source: `${CONFIG.sheetTransport}-legacy-supplement` };
        }
        return { rows: legacyRows, source: `${CONFIG.sheetTransport}-legacy-sheet` };
      }
    } catch (err) {
      console.info("Legacy sheets unavailable; using fallback content.", err);
    }
  }

  return { rows: DEFAULT_ROWS, source: "local-defaults" };
}

async function configuredSheetExists(sheetName) {
  if (CONFIG.sheetTransport !== "api" || !CONFIG.apiKey) return true;

  try {
    const titles = await fetchSheetTitlesApi(CONFIG.spreadsheetId, CONFIG.apiKey);
    return titles.includes(sheetName);
  } catch (err) {
    console.info("Could not read sheet titles; attempting direct content fetch.", err);
    return true;
  }
}

async function fetchSheetTitlesApi(spreadsheetId, apiKey) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `?fields=sheets(properties(title))&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Google Sheets metadata request failed: ${response.status} ${response.statusText}`);

  const data = await response.json();
  return (data.sheets || [])
    .map((sheet) => sheet?.properties?.title)
    .filter(Boolean);
}

async function fetchConfiguredSheetRows(sheetName, rangeA1 = "A1:Z1000") {
  const preferred = CONFIG.sheetTransport === "api" ? "api" : "gviz";
  const fallback = preferred === "api" ? "gviz" : "api";

  try {
    return await fetchSheetRowsWithTransport(preferred, sheetName, rangeA1);
  } catch (err) {
    if (fallback === "api" && !CONFIG.apiKey) throw err;
    return fetchSheetRowsWithTransport(fallback, sheetName, rangeA1);
  }
}

async function fetchSheetRowsWithTransport(transport, sheetName, rangeA1) {
  if (transport === "api") {
    if (!CONFIG.apiKey) throw new Error("Google Sheets API key is missing.");
    return fetchSheetsApiRows(CONFIG.spreadsheetId, sheetName, rangeA1, CONFIG.apiKey);
  }

  return fetchGvizRows(CONFIG.spreadsheetId, sheetName);
}

async function fetchSheetsApiRows(spreadsheetId, sheetName, rangeA1, apiKey) {
  const range = `${sheetName}!${rangeA1}`;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Google Sheets API request failed: ${response.status} ${response.statusText}`);

  const data = await response.json();
  return data.values || [];
}

async function fetchGvizRows(spreadsheetId, sheetName) {
  const url = new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`);
  url.searchParams.set("tqx", "out:json");
  url.searchParams.set("sheet", sheetName);
  url.searchParams.set("headers", "0");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error(`Sheet request failed: ${response.status}`);

  const text = await response.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?/);
  if (!match) throw new Error("Unexpected Google sheet response.");

  const payload = JSON.parse(match[1]);
  if (payload.status !== "ok") {
    const message = payload.errors?.map((item) => item.detailed_message || item.message).join("; ");
    throw new Error(message || `Google sheet "${sheetName}" is unavailable.`);
  }

  return (payload.table?.rows || []).map((sheetRow) =>
    (sheetRow.c || []).map((cell) => String(cell?.f ?? cell?.v ?? "").trim())
  );
}

function parseSheetRows(sheetRows) {
  const firstDataRow = sheetRows.findIndex((cells) => cells.some(Boolean));
  if (firstDataRow < 0) return [];

  const headers = sheetRows[firstDataRow].map(normalizeKey);
  return sheetRows.slice(firstDataRow + 1)
    .map((cells) => {
      const item = {};
      headers.forEach((key, index) => {
        if (!key) return;
        item[key] = cells[index] || "";
      });
      return item;
    })
    .filter((item) => item.section || item.id || item.title || item.body);
}

function mergeRows(baseRows, overrideRows) {
  const byKey = new Map();
  baseRows.forEach((item) => {
    byKey.set(rowKey(item), { ...item });
  });

  overrideRows.forEach((item) => {
    const key = rowKey(item);
    const current = byKey.get(key) || row(item.section, item.id);
    Object.entries(item).forEach(([field, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        current[field] = value;
      }
    });
    byKey.set(key, current);
  });

  return Array.from(byKey.values());
}

function rowKey(item) {
  return `${clean(item.section)}:${slugify(item.id || item.title || item.section)}`;
}

function normalizeRows(rows) {
  return rows
    .map((item) => ({
      section: clean(item.section),
      id: slugify(item.id || item.title || item.section),
      title: clean(item.title),
      eyebrow: clean(item.eyebrow),
      summary: clean(item.summary),
      body: clean(item.body),
      media_url: clean(item.media_url || item.mediaUrl),
      media_type: clean(item.media_type || item.mediaType || "image").toLowerCase(),
      link_label: clean(item.link_label || item.linkLabel),
      link_url: clean(item.link_url || item.linkUrl),
      tags: clean(item.tags),
      color: clean(item.color),
      order: toNumber(item.order),
      published: isPublished(item.published)
    }))
    .filter((item) => item.published && item.section);
}

function normalizeKey(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clean(value) {
  return String(value ?? "").trim();
}

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 999;
}

function isPublished(value) {
  const text = clean(value).toLowerCase();
  return !["false", "no", "n", "0", "hide", "hidden", "draft"].includes(text);
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function renderSite(rows) {
  const model = createModel(rows);
  applyTheme(model.theme);
  renderCopy(model);
  renderStats(model.stats);
  renderOfferings(model.offerings);
  renderAbout(model.about);
  renderProcess(model.process);
  renderProjects(model.projects, model.projectBlocks);
  renderContact(model.contact, model.socials);
}

function createModel(rows) {
  const bySection = (section) => rows
    .filter((item) => item.section === section)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  return {
    site: bySection("site")[0] || DEFAULT_ROWS.find((item) => item.section === "site"),
    hero: bySection("hero")[0] || DEFAULT_ROWS.find((item) => item.section === "hero"),
    practice: bySection("practice")[0] || DEFAULT_ROWS.find((item) => item.section === "practice"),
    about: bySection("about")[0] || DEFAULT_ROWS.find((item) => item.section === "about"),
    work: bySection("work")[0] || DEFAULT_ROWS.find((item) => item.section === "work"),
    contact: bySection("contact")[0] || DEFAULT_ROWS.find((item) => item.section === "contact"),
    theme: bySection("theme"),
    stats: bySection("stat"),
    offerings: bySection("offering"),
    process: bySection("process"),
    projects: bySection("project"),
    projectBlocks: bySection("project_block"),
    socials: bySection("social")
  };
}

function applyTheme(themeRows) {
  const root = document.documentElement;
  themeRows.forEach((item) => {
    const variable = STYLE_VARIABLES[item.id];
    if (!variable || !isSafeCssColor(item.color)) return;
    root.style.setProperty(variable, item.color);
  });
}

function isSafeCssColor(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

function renderCopy(model) {
  const siteTitle = model.site?.title || "Connie Cen";
  const siteSummary = model.site?.summary || "";
  const hero = model.hero || {};
  const practice = model.practice || {};
  const work = model.work || {};
  const contact = model.contact || {};

  document.title = `${siteTitle} | Embodied Therapy`;
  updateMeta("description", siteSummary || hero.summary);
  updateMeta("og:title", siteTitle, "property");
  updateMeta("og:description", siteSummary || hero.summary, "property");

  setText("[data-content='site.title']", siteTitle, true);
  setText("[data-content='hero.eyebrow']", hero.eyebrow);
  setText("[data-content='hero.title']", hero.title || siteTitle);
  setText("[data-content='hero.summary']", hero.summary);
  setText("[data-content='practice.summary']", practice.summary);
  setText("[data-content='work.summary']", work.summary);
  setText("[data-content='contact.eyebrow']", contact.eyebrow || "Contact");
  setText("[data-content='contact.title']", contact.title || "Contact");
  setText("[data-content='contact.summary']", contact.summary);
}

function updateMeta(name, value, attr = "name") {
  if (!value) return;
  const el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.setAttribute("content", value);
}

function setText(selector, value, all = false) {
  const targets = all ? document.querySelectorAll(selector) : [document.querySelector(selector)];
  targets.forEach((target) => {
    if (target) target.textContent = value || "";
  });
}

function renderStats(items) {
  const container = document.getElementById("hero-stats");
  if (!container) return;
  replaceChildren(container, items.slice(0, 3).map((item) => {
    const stat = document.createElement("div");
    stat.className = "stat";
    stat.innerHTML = `<strong></strong><span></span>`;
    stat.querySelector("strong").textContent = item.title;
    stat.querySelector("span").textContent = item.summary;
    return stat;
  }));
}

function renderOfferings(items) {
  const container = document.getElementById("offering-grid");
  if (!container) return;

  if (!items.length) {
    replaceChildren(container, [emptyState("Add offering rows in the content sheet to show practice areas.")]);
    return;
  }

  replaceChildren(container, items.map((item) => {
    const card = document.createElement("article");
    card.className = "offering-card";
    card.append(heading("h3", item.title), paragraph(item.summary), tagList(item.tags));
    return card;
  }));
}

function renderAbout(item) {
  if (!item) return;
  setText("[data-content='about.eyebrow']", item.eyebrow || "About");
  setText("[data-content='about.title']", item.title);

  const body = document.getElementById("about-body");
  if (body) {
    replaceChildren(body, splitParagraphs(item.body || item.summary).map(paragraph));
  }

  const actions = document.getElementById("about-actions");
  if (actions) {
    const actionItems = [];
    if (item.link_url && item.link_label) {
      const link = document.createElement("a");
      link.className = "button secondary";
      link.href = normalizedExternalUrl(item.link_url);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = item.link_label;
      actionItems.push(link);
    }
    replaceChildren(actions, actionItems);
  }

  const media = document.getElementById("about-media");
  if (media && item.media_url) {
    renderMedia(media, item, { alt: item.title || "Connie Cen portrait" });
  }
}

function renderProcess(items) {
  const container = document.getElementById("process-rail");
  if (!container) return;
  replaceChildren(container, items.map((item, index) => {
    const step = document.createElement("article");
    step.className = "process-step";
    const number = String(index + 1).padStart(2, "0");
    step.append(heading("span", number), heading("h3", item.title), paragraph(item.summary));
    return step;
  }));
}

function renderProjects(projects, blocks) {
  const container = document.getElementById("project-grid");
  const dialog = document.getElementById("project-dialog");
  const dialogContent = document.getElementById("dialog-content");
  if (!container || !dialog || !dialogContent) return;

  const closeButton = dialog.querySelector(".dialog-close");
  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  if (!projects.length) {
    replaceChildren(container, [emptyState("Add project rows in the content sheet to show selected work.")]);
    return;
  }

  replaceChildren(container, projects.map((project) => {
    const card = document.createElement("button");
    card.className = "project-card";
    card.type = "button";
    card.append(projectMedia(project), projectCardCopy(project));
    card.addEventListener("click", () => openProject(project, blocks.filter((block) => block.id === project.id)));
    return card;
  }));
}

function openProject(project, blocks) {
  const dialog = document.getElementById("project-dialog");
  const dialogContent = document.getElementById("dialog-content");
  if (!dialog || !dialogContent) return;

  const inner = document.createElement("div");
  inner.className = "dialog-inner";
  inner.append(heading("p", "Selected work", "eyebrow"), heading("h2", project.title), paragraph(project.summary, "dialog-summary"), tagList(project.tags));

  if (project.media_url) {
    inner.append(projectMedia(project));
  }

  const blockWrap = document.createElement("div");
  blockWrap.className = "project-blocks";
  const sortedBlocks = blocks.sort((a, b) => a.order - b.order);
  replaceChildren(blockWrap, sortedBlocks.map((block) => {
    const article = document.createElement("article");
    article.className = "project-block";
    if (block.title) article.append(heading("h3", block.title));
    if (block.body || block.summary) article.append(...splitParagraphs(block.body || block.summary).map(paragraph));
    if (block.media_url) article.append(projectMedia(block));
    return article;
  }));
  inner.append(blockWrap);

  replaceChildren(dialogContent, [inner]);
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function projectCardCopy(project) {
  const copy = document.createElement("div");
  copy.className = "project-copy";
  copy.append(heading("h3", project.title), paragraph(project.summary), tagList(project.tags));
  return copy;
}

function projectMedia(item) {
  const wrap = document.createElement("div");
  wrap.className = "project-media";
  if (item.media_url) {
    renderMedia(wrap, item, { alt: item.title || "Project media" });
  } else {
    const art = document.createElement("div");
    art.className = "project-art";
    wrap.append(art);
  }
  return wrap;
}

function renderContact(contact, socials) {
  const form = document.getElementById("contact-form");
  if (form) {
    form.action = contact?.link_url || CONFIG.formspreeEndpoint || form.action;
  }

  const links = document.getElementById("contact-links");
  const footerLinks = document.getElementById("footer-links");
  const anchors = socials
    .filter((item) => item.title && item.link_url)
    .map((item) => {
      const link = document.createElement("a");
      link.href = normalizedExternalUrl(item.link_url);
      link.target = item.link_url.startsWith("mailto:") ? "" : "_blank";
      link.rel = item.link_url.startsWith("mailto:") ? "" : "noopener";
      link.textContent = item.title;
      return link;
    });

  replaceChildren(links, anchors.map((anchor) => anchor.cloneNode(true)));
  replaceChildren(footerLinks, anchors);
}

function bindNavigation() {
  const header = document.querySelector("[data-nav]");
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    toggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  });
}

function bindContactForm() {
  const form = document.getElementById("contact-form");
  const submit = document.getElementById("contact-submit");
  const status = document.getElementById("contact-status");
  if (!form || !submit || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error(`Form request failed: ${response.status}`);
      form.reset();
      status.textContent = "Message sent. Thank you.";
    } catch (err) {
      console.error(err);
      status.textContent = "Could not send right now. Please email directly.";
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  });
}

function renderMedia(container, item, { alt = "" } = {}) {
  container.innerHTML = "";
  container.classList.add("has-media");
  const url = item.media_url;
  const type = (item.media_type || "image").toLowerCase();
  if (!url) return;

  if (type === "embed") {
    const iframe = document.createElement("iframe");
    iframe.src = toEmbedUrl(url);
    iframe.title = alt || item.title || "Embedded media";
    iframe.loading = "lazy";
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.referrerPolicy = "no-referrer";
    container.append(iframe);
    return;
  }

  if (type === "video") {
    if (isDriveUrl(url)) {
      const fileId = extractDriveFileId(url);
      if (fileId) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
        iframe.title = alt || item.title || "Video";
        iframe.loading = "lazy";
        iframe.allow = "autoplay; fullscreen";
        iframe.referrerPolicy = "no-referrer";
        container.append(iframe);
        return;
      }
    }

    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    container.append(video);
    return;
  }

  const image = document.createElement("img");
  image.src = isDriveUrl(url) ? driveImageUrl(url, 1600) : url;
  image.alt = alt || item.title || "";
  image.loading = "lazy";
  image.decoding = "async";
  image.referrerPolicy = "no-referrer";
  image.onerror = () => {
    if (isDriveUrl(url) && !image.dataset.fallback) {
      const id = extractDriveFileId(url);
      if (id) {
        image.dataset.fallback = "true";
        image.src = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
        return;
      }
    }
    renderMediaPlaceholder(container);
  };
  container.append(image);
}

function renderMediaPlaceholder(container) {
  container.innerHTML = "";
  container.classList.remove("has-media");
  const placeholder = document.createElement("div");
  placeholder.className = "media-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  container.append(placeholder);
}

function splitParagraphs(value) {
  return clean(value).split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
}

function paragraph(text, className = "") {
  const p = document.createElement("p");
  if (className) p.className = className;
  p.textContent = text || "";
  return p;
}

function heading(level, text, className = "") {
  const el = document.createElement(level);
  if (className) el.className = className;
  el.textContent = text || "";
  return el;
}

function tagList(value) {
  const tags = clean(value).split(",").map((tag) => tag.trim()).filter(Boolean);
  const list = document.createElement("ul");
  list.className = "tag-list";
  tags.forEach((tag) => {
    const item = document.createElement("li");
    item.textContent = tag;
    list.append(item);
  });
  return list;
}

function emptyState(text) {
  const el = document.createElement("p");
  el.className = "empty-state";
  el.textContent = text;
  return el;
}

function replaceChildren(container, children) {
  container.replaceChildren(...children.filter(Boolean));
}

function normalizedExternalUrl(url) {
  const value = clean(url);
  if (!value) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return `https://${value}`;
}

function isDriveUrl(url) {
  return clean(url).includes("drive.google.com");
}

function extractDriveFileId(url) {
  const value = clean(url);
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/uc\?export=.*?&id=([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

function driveImageUrl(url, width = 1600) {
  const id = extractDriveFileId(url);
  return id ? `https://lh3.googleusercontent.com/d/${id}=w${width}` : url;
}

function toEmbedUrl(url) {
  const value = clean(url);
  const youtube = toYouTubeEmbedUrl(value);
  if (youtube) return youtube;
  const vimeo = toVimeoEmbedUrl(value);
  if (vimeo) return vimeo;
  return value;
}

function toYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/watch")) id = parsed.searchParams.get("v") || "";
      if (parsed.pathname.startsWith("/shorts/")) id = parsed.pathname.split("/")[2] || "";
      if (parsed.pathname.startsWith("/embed/")) id = parsed.pathname.split("/")[2] || "";
    }
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function toVimeoEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "vimeo.com") id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "player.vimeo.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "video") id = parts[1] || "";
    }
    return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : "";
  } catch {
    return "";
  }
}

async function loadLegacyRows() {
  const [home, about] = await Promise.all([
    fetchConfiguredSheetRows("home", "A1:E100").catch(() => []),
    fetchConfiguredSheetRows("about", "A1:D100").catch(() => [])
  ]);
  const rows = [];
  const homeData = home[1] || [];
  const aboutData = about[1] || [];

  if (CONFIG.legacySheets?.supplementOnly !== false) {
    const portraitCandidates = [aboutData[1], homeData[3]].filter(Boolean);
    const portraitUrl = portraitCandidates.find(isDriveUrl) || portraitCandidates[0] || "";

    if (portraitUrl || aboutData[3]) {
      rows.push(row("about", "main", {
        media_url: portraitUrl,
        media_type: portraitUrl ? (portraitUrl === aboutData[1] ? aboutData[2] || "image" : homeData[4] || "image") : "image",
        link_label: aboutData[3] ? "Resume" : "",
        link_url: aboutData[3] || ""
      }));
    }

    return rows;
  }

  if (homeData.length) {
    rows.push(row("hero", "main", {
      eyebrow: homeData[0] || "",
      title: "Connie Cen",
      summary: homeData[2] || homeData[1] || "",
      media_url: homeData[3] || "",
      media_type: homeData[4] || "image"
    }));
  }

  if (aboutData.length) {
    rows.push(row("about", "main", {
      title: "About Connie",
      body: aboutData[0] || "",
      media_url: aboutData[1] || "",
      media_type: aboutData[2] || "image",
      link_label: aboutData[3] ? "Resume" : "",
      link_url: aboutData[3] || ""
    }));
  }

  const legacy = CONFIG.legacySheets || {};
  const projectPrefix = legacy.projectPrefix || "proj-";
  const maxProjects = Number.isFinite(legacy.maxProjects) ? legacy.maxProjects : 12;
  const projectSheets = await Promise.all(
    Array.from({ length: maxProjects }, (_, index) =>
      fetchConfiguredSheetRows(`${projectPrefix}${index}`, "A1:Z100").catch(() => [])
    )
  );

  projectSheets.forEach((sheet, index) => {
    const header = sheet[1] || [];
    if (!header.length) return;
    const id = `${projectPrefix}${index}`;
    rows.push(row("project", id, {
      title: header[0] || `Project ${index + 1}`,
      summary: header[1] || "",
      media_url: header[2] || "",
      media_type: header[3] || "image",
      order: index + 1
    }));

    const contentRows = sheet.slice(4);
    contentRows.forEach((content, rowIndex) => {
      for (let col = 0; col < content.length; col += 2) {
        const value = content[col] || "";
        const type = content[col + 1] || "";
        if (!value) continue;
        const isMedia = /image|video|embed/i.test(type);
        rows.push(row("project_block", id, {
          title: isMedia ? "" : `Page ${Math.floor(col / 2) + 1}`,
          body: isMedia ? "" : value,
          media_url: isMedia ? value : "",
          media_type: isMedia ? type.replace(/\(.*?\)/g, "").trim().toLowerCase() : "",
          order: rowIndex + col + 1
        }));
      }
    });
  });

  return rows;
}
