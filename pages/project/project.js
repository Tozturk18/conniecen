// project.js

(async function initProjectPage() {
  try {
    const sheetName = getCurrentProjectSheetName();
    if (!sheetName) {
      // If no project selected, bounce to projects list
      window.location.href = "projects.html";
      return;
    }

    // Persist it (cookie + URL sync)
    setCurrentProjectSheetName(sheetName);

    // Define a standard “hero” range for every project sheet:
    // A2=Title, B2=Description, C2=Media URL, D2=Media Type (image/video)
    const [title, desc, mediaUrl, mediaType] = await fetchSheetRow({
      sheetName,
      rangeA1: "A2:D2",
    });

    setText("project_title", title || sheetName);
    setText("project_desc", desc || "");

    if (mediaUrl && mediaType) {
      setMediaFromDrive("project_media", mediaUrl, mediaType, {
        alt: title || sheetName,
        imgWidth: 2000,
      });
    } else {
      // Clear if no media
      clearElement("project_media");
    }
  } catch (err) {
    console.error(err);
    // If someone typed a bad ?p= value
    window.location.href = "projects.html";
  }
})();
