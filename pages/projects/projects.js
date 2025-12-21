// projects.js

(async function initProjectsList() {
  try {
    const titles = await fetchSheetTitles();
    const projectSheets = titles
      .filter(isProjectSheetName)
      .sort((a, b) => {
        const na = parseInt(a.split("-")[1], 10);
        const nb = parseInt(b.split("-")[1], 10);
        return na - nb;
      });

    const list = document.getElementById("projects_list");
    list.innerHTML = "";

    index = 0;

    // Optional: if you want each project card to show title/thumbnail,
    // you can fetch a tiny range from each project sheet.
    for (const sheetName of projectSheets) {
      // Define a small standard header range per project:
      // A2=Project Title, B2=Short blurb, C2=thumb drive link, D2=thumb type (image/video)
      const [title, blurb, thumbUrl, thumbType] = await fetchSheetRow({
        sheetName,
        rangeA1: "A2:D2",
      });

      const card = document.createElement("div");
      card.className = "project-card";
      //card.style.cursor = "pointer";
      //card.onclick = () => goToProject(sheetName);

      const info = document.createElement("div");
      info.className = "project-info";

      const h3 = document.createElement("h3");
      h3.textContent = title || sheetName;

      const p = document.createElement("p");
      p.textContent = blurb || "";

      const button = document.createElement("button");
      button.textContent = "View Project";
      button.onclick = () => goToProject(sheetName);

      const media = document.createElement("div");
      media.id = `thumb-${sheetName}`;
      media.className = "project-thumb";

      info.appendChild(h3);
      info.appendChild(p);
      info.appendChild(button);

      if (index % 2 === 0) {
        card.appendChild(info);
        card.appendChild(media);
        card.classList.add("reverse");
      } else {
        card.appendChild(media);
        card.appendChild(info);
      }

      list.appendChild(card);

      // Render thumb only if provided (type required)
      if (thumbUrl && thumbType) {
        setMediaFromDrive(media, thumbUrl, thumbType, { alt: title || sheetName, imgWidth: 1000 });
      }

      index++;
    }
  } catch (err) {
    console.error(err);
  }
})();
