// global.js

// -----------------------------
// Config
// -----------------------------
const SHEETS = {
  apiKey: "AIzaSyAUOrlB9qpIJIaqhZT0mL5rCatr8rjLMI8",
  spreadsheetId: "1ft3RxtV4uV81U3Cw2mOROOJ6gvQ5Ce6-O_2nnIq4Dp4",
};

// -----------------------------
// Google Sheets helpers
// -----------------------------
async function fetchSheetValues({ sheetName, rangeA1 }) {
  const range = `${sheetName}!${rangeA1}`;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS.spreadsheetId}` +
    `/values/${encodeURIComponent(range)}?key=${encodeURIComponent(SHEETS.apiKey)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheets request failed: ${res.status} ${res.statusText}`);

  const data = await res.json();
  return data?.values ?? [];
}

async function fetchSheetRow({ sheetName, rangeA1, rowIndex = 0 }) {
  const values = await fetchSheetValues({ sheetName, rangeA1 });
  const row = values[rowIndex];
  if (!row) throw new Error(`No row returned for ${sheetName}!${rangeA1}`);
  return row;
}

// -----------------------------
// DOM helpers
// -----------------------------
function byId(id) {
  return document.getElementById(id);
}

function clearElement(idOrEl) {
  const el = typeof idOrEl === "string" ? byId(idOrEl) : idOrEl;
  if (!el) return null;
  el.innerHTML = "";
  return el;
}

function setText(idOrEl, text) {
  const el = typeof idOrEl === "string" ? byId(idOrEl) : idOrEl;
  if (!el) return;
  el.textContent = text ?? "";
}

const menuButton = document.getElementById("menu_button");

menuButton?.addEventListener("click", menuToggle);

function menuToggle() {
  const menuBars = menuButton.querySelectorAll("span");
  
  menuBars[0].classList.toggle("toggle1");
  menuBars[1].classList.toggle("toggle2");
  menuBars[2].classList.toggle("toggle3");
  
  const navLinks = document.querySelector("nav");
  navLinks.classList.toggle("show");
}

function closeMenu() {
  const navLinks = document.querySelector("nav");
  if (!navLinks) return;

  navLinks.classList.remove("show");

  if (!menuButton) return;
  const menuBars = menuButton.querySelectorAll("span");
  if (menuBars.length === 3) {
    menuBars[0].classList.remove("toggle1");
    menuBars[1].classList.remove("toggle2");
    menuBars[2].classList.remove("toggle3");
  }
}

const mainEl = document.querySelector("main");
mainEl?.addEventListener("click", () => {
  const navLinks = document.querySelector("nav");
  if (navLinks?.classList.contains("show")) {
    closeMenu();
  }
});

// -----------------------------
// Google Drive helpers
// -----------------------------
function extractDriveFileId(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/<id>/
    /[?&]id=([a-zA-Z0-9_-]+)/,               // ?id=<id>
    /\/uc\?export=.*?&id=([a-zA-Z0-9_-]+)/,  // /uc?export=...&id=<id>
  ];

  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m?.[1]) return m[1];
  }
  return "";
}

function driveImageUrl(fileId, width = 2000) {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}

function isDriveUrl(url) {
  return typeof url === "string" && url.trim().includes("drive.google.com");
}

// -----------------------------
// YouTube / Vimeo helpers
// -----------------------------
function toYouTubeEmbedUrl(url) {
  // Supports:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    let id = "";

    if (host === "youtu.be") {
      id = u.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/watch")) {
        id = u.searchParams.get("v") || "";
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/")[2] || "";
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2] || "";
      }
    }

    if (!id) return "";
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return "";
  }
}

function toVimeoEmbedUrl(url) {
  // Supports:
  // - https://vimeo.com/123456789
  // - https://player.vimeo.com/video/123456789
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    let id = "";

    if (host === "vimeo.com") {
      id = u.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "player.vimeo.com") {
      // /video/<id>
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "video") id = parts[1] || "";
    }

    if (!id || !/^\d+$/.test(id)) return "";
    return `https://player.vimeo.com/video/${id}`;
  } catch {
    return "";
  }
}

function toEmbedUrl(url) {
  // If already an embed URL, allow it.
  // Otherwise, convert YouTube/Vimeo watch URLs into embed URLs.
  const yt = toYouTubeEmbedUrl(url);
  if (yt) return yt;

  const vm = toVimeoEmbedUrl(url);
  if (vm) return vm;

  // Fallback: return original URL (might already be embeddable)
  return url;
}

// -----------------------------
// Media renderer (explicit type)
// mediaType: "image" | "video" | "embed"
// -----------------------------
function setMedia(containerIdOrEl, mediaUrl, mediaType, {
  alt = "",
  imgWidth = 2000,
  showControls = true
} = {}) {
  const container = clearElement(containerIdOrEl);
  if (!container) return;

  if (!mediaUrl || typeof mediaUrl !== "string") return;
  if (!mediaType || typeof mediaType !== "string") return;

  const url = mediaUrl.trim();
  const type = mediaType.trim().toLowerCase();

  // -----------------------------
  // EMBED (YouTube/Vimeo/iframe-friendly links)
  // -----------------------------
  if (type === "embed") {
    const iframe = document.createElement("iframe");
    iframe.src = toEmbedUrl(url);
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer";
    iframe.style.width = "100%";
    iframe.style.aspectRatio = "16 / 9";
    iframe.style.border = "0";

    // If embed fails, provide link
    iframe.onerror = () => {
      const a = document.createElement("a");
      a.href = url;
      a.textContent = "Open media";
      a.target = "_blank";
      a.rel = "noopener";
      container.innerHTML = "";
      container.appendChild(a);
    };

    container.appendChild(iframe);
    return;
  }

  // -----------------------------
  // Drive links: special handling
  // -----------------------------
  if (isDriveUrl(url)) {
    const fileId = extractDriveFileId(url);

    if (!fileId) {
      setText(container, "Invalid Google Drive link.");
      return;
    }

    if (type === "image") {
      const img = document.createElement("img");

      const primaryUrl = driveImageUrl(fileId, imgWidth);
      const fallbackUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w${imgWidth}`;

      img.src = primaryUrl;
      img.alt = alt;
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.crossOrigin = "anonymous";

      let triedFallback = false;
      img.onerror = () => {
        if (!triedFallback) {
          triedFallback = true;
          img.src = fallbackUrl;
          return;
        }

        setText(
          container,
          "Image failed to load. Confirm the Drive file is shared as “Anyone with the link can view”."
        );
      };

      container.appendChild(img);
      return;
    }

    if (type === "video") {
      // Most reliable for Drive videos on static sites
      const iframe = document.createElement("iframe");
      iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
      iframe.allow = "autoplay; fullscreen";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer";
      iframe.style.width = "100%";
      iframe.style.aspectRatio = "16 / 9";
      iframe.style.border = "0";

      container.appendChild(iframe);
      return;
    }

    // Drive fallback
    const a = document.createElement("a");
    a.href = `https://drive.google.com/file/d/${fileId}/view`;
    a.textContent = "Open file";
    a.target = "_blank";
    a.rel = "noopener";
    container.appendChild(a);
    return;
  }

  // -----------------------------
  // Normal web URLs
  // -----------------------------
  if (type === "image") {
    const img = document.createElement("img");
    img.src = url;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      const a = document.createElement("a");
      a.href = url;
      a.textContent = "Open image";
      a.target = "_blank";
      a.rel = "noopener";
      container.innerHTML = "";
      container.appendChild(a);
    };

    container.appendChild(img);
    return;
  }

  if (type === "video") {
    // Works for direct mp4/webm/etc.
    // If the host blocks embedding, onerror falls back to a link.
    const video = document.createElement("video");
    video.src = url;
    video.controls = showControls;
    video.preload = "metadata";
    video.playsInline = true;

    video.onerror = () => {
      const a = document.createElement("a");
      a.href = url;
      a.textContent = "Open video";
      a.target = "_blank";
      a.rel = "noopener";
      container.innerHTML = "";
      container.appendChild(a);
    };

    container.appendChild(video);
    return;
  }

  // Unknown type: link out
  const a = document.createElement("a");
  a.href = url;
  a.textContent = "Open media";
  a.target = "_blank";
  a.rel = "noopener";
  container.appendChild(a);
}

// Backwards-compatible wrapper (old name)
function setMediaFromDrive(containerIdOrEl, mediaUrl, mediaType, opts = {}) {
  return setMedia(containerIdOrEl, mediaUrl, mediaType, opts);
}

// -----------------------------
// Cookie helpers (simple, safe)
// -----------------------------
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
    `expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const n = encodeURIComponent(name) + "=";
  const parts = document.cookie.split(";").map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith(n)) return decodeURIComponent(p.slice(n.length));
  }
  return "";
}

// -----------------------------
// URL helpers
// -----------------------------
function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function setQueryParam(key, value) {
  const url = new URL(window.location.href);
  if (!value) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  window.history.replaceState({}, "", url.toString());
}

// -----------------------------
// Spreadsheet metadata (sheet names only, no grid data)
// -----------------------------
async function fetchSheetTitles() {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS.spreadsheetId}` +
    `?fields=sheets(properties(title))&key=${encodeURIComponent(SHEETS.apiKey)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheet titles request failed: ${res.status} ${res.statusText}`);

  const data = await res.json();
  return (data.sheets || [])
    .map(s => s?.properties?.title)
    .filter(Boolean);
}

// -----------------------------
// Project routing conventions
// -----------------------------
function isProjectSheetName(name) {
  return /^proj-\d+$/i.test(name);
}

function getCurrentProjectSheetName() {
  const fromUrl = getQueryParam("p");
  if (fromUrl) return fromUrl;

  const fromCookie = getCookie("current_project");
  return fromCookie || "";
}

function setCurrentProjectSheetName(sheetName) {
  if (!sheetName) return;
  setCookie("current_project", sheetName, 30);
  setQueryParam("p", sheetName);
}

function getBasePath() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  const isGitHubIo = window.location.hostname.endsWith("github.io");
  if (isGitHubIo && pathParts.length > 0) {
    return `/${pathParts[0]}`;
  }

  return "";
}

function goToProject(sheetName) {
  setCurrentProjectSheetName(sheetName);

  const base = getBasePath();
  const url = new URL(`${base}/pages/project/project.html`, window.location.origin);
  url.searchParams.set("p", sheetName);

  window.location.href = url.toString();
}