const parts = window.location.pathname.split("/").filter(Boolean);
const base = window.location.hostname.endsWith("github.io") && parts.length ? `/${parts[0]}` : "";
window.location.replace(`${window.location.origin}${base}/index.html`);
