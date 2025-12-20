// pages/about/about.js
// Requires ../../global.js to be loaded first

(async function initAbout() {
  try {
    // about!A2=text, B2=media url, C2=media type (image|video|embed), D2=resume url
    const [aboutText, mediaUrl, mediaType, resumeUrl] = await fetchSheetRow({
      sheetName: "about",
      rangeA1: "A2:D2",
    });

    // 1) About paragraph: your HTML has an empty <p></p> under "About Me"
    const aboutP = document.querySelector("main p");
    if (aboutP) aboutP.textContent = aboutText ?? "";

    // 2) Media
    if (mediaUrl && mediaType) {
      setMedia("about_media", mediaUrl, mediaType, {
        alt: "Connie Cen",
        imgWidth: 2000,
        showControls: true,
      });
    } else {
      // Clear if not provided
      clearElement("about_media");
    }

    // 3) Resume button
    const resumeBtn = document.querySelector("main button");
    if (resumeBtn) {
      const link = (resumeUrl || "").trim();

      if (!link) {
        resumeBtn.disabled = true;
        resumeBtn.title = "Resume link not available";
      } else {
        resumeBtn.disabled = false;
        resumeBtn.title = "";
        resumeBtn.onclick = () => {
          // If it's a Drive link, open the human-friendly view URL
          if (link.includes("drive.google.com")) {
            const fileId = extractDriveFileId(link);
            if (fileId) {
              window.open(`https://drive.google.com/file/d/${fileId}/view`, "_blank", "noopener");
              return;
            }
          }
          // Otherwise open as-is
          window.open(link, "_blank", "noopener");
        };
      }
    }
  } catch (err) {
    console.error("About page failed to load:", err);
  }
})();
