window.CONNIECEN_SITE_CONFIG = {
  spreadsheetId: "1ft3RxtV4uV81U3Cw2mOROOJ6gvQ5Ce6-O_2nnIq4Dp4",
  apiKey: "AIzaSyAUOrlB9qpIJIaqhZT0mL5rCatr8rjLMI8",
  contentSheetName: "content",
  formspreeEndpoint: "https://formspree.io/f/xnjardpn",

  // Preferred: create a Google Sheet tab named "content" using docs/content-template.csv.
  // The site reads it with the Google Sheets API so Connie can edit content remotely.
  // Keep this browser key restricted in Google Cloud to the GitHub Pages domain.
  sheetTransport: "api",

  // Until the new content tab is added, use the old home/about tabs only to supplement
  // the polished default content with Connie's existing portrait/resume media.
  legacySheets: {
    enabled: true,
    supplementOnly: true,
    projectPrefix: "proj-",
    maxProjects: 12
  }
};
