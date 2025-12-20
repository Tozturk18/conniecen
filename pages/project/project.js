// pages/project/project.js
// Requires ../../global.js to be loaded first

(async function initProjectPage() {
  try {
    const sheetName = getCurrentProjectSheetName();

    if (!sheetName) {
      const base = getBasePath();
      window.location.href = `${base}/pages/projects/projects.html`;
      return;
    }

    // Persist selected project (cookie + URL sync for p)
    setCurrentProjectSheetName(sheetName);

    // Page number (1-based). Default = 1.
    const page = getProjectPage();

    // HERO (always from A2:D2)
    const [title, desc, heroMediaUrl, heroMediaType] = await fetchSheetRow({
      sheetName,
      rangeA1: "A2:D2",
    });

    setText("project_title", title || sheetName);
    setText("project_desc", desc || "");

    if (heroMediaUrl && heroMediaType) {
      setMedia("project_media", heroMediaUrl, heroMediaType, {
        alt: title || sheetName,
        imgWidth: 2000,
        showControls: true,
      });
    } else {
      clearElement("project_media");
    }

    // BODY content depends on page -> columns A/B, C/D, E/F, ...
    const { contentRangeA1 } = getPageRange(page);
    const rows = await fetchSheetValues({
      sheetName,
      rangeA1: contentRangeA1,
    });

    const hasContent = renderProjectContent(rows, title || sheetName);

    // Setup pagination UI (prev/next + disabling)
    await setupEnsureNextAvailabilityAndBindUI(sheetName, page, hasContent);
  } catch (err) {
    console.error("Project page failed:", err);
    const base = getBasePath();
    window.location.href = `${base}/pages/projects/projects.html`;
  }
})();

// -----------------------------
// Paging helpers
// -----------------------------
function getProjectPage() {
  const raw = getQueryParam("page");
  const n = parseInt(raw || "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function setProjectPage(pageNum) {
  setQueryParam("page", String(pageNum));
}

function goToProjectPage(pageNum) {
  const p = Math.max(1, pageNum);
  setProjectPage(p);
  // reload with updated URL
  window.location.reload();
}

function colIndexToA1(idx0) {
  // 0 -> A, 1 -> B, ... 25 -> Z, 26 -> AA ...
  let n = idx0 + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function getPageRange(pageNum) {
  // Page 1 => A5:B100
  // Page 2 => C5:D100
  // Page 3 => E5:F100
  // page n => startCol = (n-1)*2, endCol = startCol+1
  const startCol0 = (pageNum - 1) * 2;
  const endCol0 = startCol0 + 1;
  const startCol = colIndexToA1(startCol0);
  const endCol = colIndexToA1(endCol0);

  return {
    contentRangeA1: `${startCol}5:${endCol}100`,
    startCol,
    endCol,
  };
}

// -----------------------------
// Type + optional (500px) parser
// -----------------------------
function parseTypeAndSize(rawType) {
  // Examples:
  // "image"
  // "image (500px)"
  // "video (400px)"
  // "embed (600px)"
  if (!rawType) return { type: "content", heightPx: null };

  const text = rawType.trim().toLowerCase();
  const sizeMatch = text.match(/\((\d+)\s*px\)/);
  const heightPx = sizeMatch ? parseInt(sizeMatch[1], 10) : null;

  const cleanType = text.replace(/\(.*?\)/g, "").trim();

  let type = cleanType;
  if (!type || type === "text" || type === "paragraph") type = "content";
  if (type === "img") type = "image";
  if (type === "vid") type = "video";

  return { type, heightPx: Number.isFinite(heightPx) ? heightPx : null };
}

function isRowEmpty(row) {
  if (!row || row.length === 0) return true;
  const a = (row[0] || "").trim();
  const b = (row[1] || "").trim();
  return !a && !b;
}

// -----------------------------
// Renderer
// Returns true if any blocks were rendered
// -----------------------------
function renderProjectContent(rows, projectTitle) {
  const container = clearElement("project_content");
  if (!container) return false;

  let rendered = 0;

  if (!rows || rows.length === 0) return false;

  rows.forEach((row) => {
    if (isRowEmpty(row)) return;

    const value = (row[0] || "").trim();
    if (!value) return;

    const { type, heightPx } = parseTypeAndSize(row[1]);

    const block = document.createElement("div");
    block.className = "project_block";

    if (type === "content") {
      const p = document.createElement("p");
      p.className = "project_paragraph";
      p.textContent = value;
      block.appendChild(p);
      container.appendChild(block);
      rendered += 1;
      return;
    }

    if (type === "image" || type === "video" || type === "embed") {
      const mediaDiv = document.createElement("div");
      mediaDiv.className = "project_media_block";

      if (heightPx) {
        mediaDiv.style.height = `${heightPx}px`;
        mediaDiv.style.display = "flex";
        mediaDiv.style.alignItems = "center";
        mediaDiv.style.justifyContent = "center";
        mediaDiv.style.overflow = "hidden";
      }

      block.appendChild(mediaDiv);
      container.appendChild(block);
      rendered += 1;

      setMedia(mediaDiv, value, type, {
        alt: projectTitle,
        imgWidth: 2000,
        showControls: true,
      });

      // Apply height constraint to the element itself after it exists
      requestAnimationFrame(() => {
        const el = mediaDiv.querySelector("img, video, iframe");
        if (el && heightPx) {
          el.style.height = `${heightPx}px`;
          el.style.width = "auto";
          el.style.maxWidth = "100%";
        }
      });

      return;
    }

    // Unknown types -> safe fallback as text
    const p = document.createElement("p");
    p.className = "project_paragraph";
    p.textContent = value;
    block.appendChild(p);
    container.appendChild(block);
    rendered += 1;
  });

  return rendered > 0;
}

// -----------------------------
// Pagination UI logic
// -----------------------------

async function setupEnsureNextAvailabilityAndBindUI(sheetName, page, hasCurrentPageContent) {
  const wrap = document.getElementById("project_pagination");
  const prevBtn = document.getElementById("proj_prev");
  const nextBtn = document.getElementById("proj_next");
  const label = document.getElementById("proj_page_label");
  const block = document.createElement("div");

  if (!wrap || !prevBtn || !nextBtn || !label) return;

  // Label always accurate if pagination is shown
  label.textContent = `Page ${page}`;

  // -----------------------------
  // Prev button visibility
  // -----------------------------
  const hasPrev = page > 1;
  prevBtn.style.display = hasPrev ? "" : "none";

  if (hasPrev) {
    prevBtn.onclick = () => goToProjectPage(page - 1);
  } else {
    wrap.prepend(block);
    prevBtn.onclick = null;
  }

  // -----------------------------
  // Next button visibility
  // Check "next page" columns (row 5-100) contain ANY content or type
  // -----------------------------
  let hasNext = false;

  try {
    const nextPage = page + 1;
    const { contentRangeA1 } = getPageRange(nextPage);

    // Only fetch next page’s 2 columns, rows 5-100
    const nextRows = await fetchSheetValues({ sheetName, rangeA1: contentRangeA1 });

    hasNext = (nextRows || []).some((r) => {
      const v = (r?.[0] || "").trim();
      const t = (r?.[1] || "").trim();
      return v.length > 0 || t.length > 0;
    });
  } catch (e) {
    hasNext = false;
  }

  nextBtn.style.display = hasNext ? "" : "none";

  if (hasNext) {
    nextBtn.onclick = () => goToProjectPage(page + 1);
  } else {
    wrap.appendChild(block);
    nextBtn.onclick = null;
  }

  // -----------------------------
  // Show pagination only if needed
  // - If project has only 1 page, we hide entire bar.
  //   That corresponds to: page===1, no prev, no next.
  // -----------------------------
  const showPagination = hasPrev || hasNext;

  wrap.style.display = showPagination ? "grid" : "none";
}
