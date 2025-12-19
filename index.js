// index.js
// Requires global.js to be loaded first

(async function initHome() {
  try {
    const [title, name, intro, heroLink] = await fetchSheetRow({
      sheetName: "home",
      rangeA1: "A2:D2",
    });

    setText("title", title);
    setText("name", name);
    setText("intro", intro);

    // Home hero is always an image for now
    setMediaFromDrive("hero_image", heroLink, "image", {
      alt: name || "Hero image",
      imgWidth: 2000,
    });
  } catch (err) {
    console.error(err);
  }
})();
