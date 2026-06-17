# Portfolio Content Guide

The site is still a static GitHub Pages site. Content is edited from Google Sheets through the Google Sheets API, but the new model uses one flexible `content` tab instead of many page-specific tabs.

## Setup

1. Open the existing Google Sheet.
2. Add a new tab named `content`.
3. Import or copy the rows from `docs/content-template.csv`.
4. Share the Sheet so the public website can read it. For a simple public portfolio, use "Anyone with the link can view".
5. Keep `content.config.js` pointed at the Sheet ID.

The default transport uses the Google Sheets API. The browser API key in `content.config.js` should be restricted in Google Cloud to the GitHub Pages domain and local development URLs.

## Columns

- `section`: The content group. Supported values include `site`, `theme`, `hero`, `stat`, `practice`, `offering`, `about`, `process`, `work`, `project`, `project_block`, `contact`, and `social`.
- `id`: Stable slug. For a `project_block`, this must match the project `id`.
- `title`, `eyebrow`, `summary`, `body`: Text fields shown in different parts of the site.
- `media_url`: Optional Google Drive image/video link or normal image/video/embed URL. This is how Connie changes her portrait and project images.
- `media_type`: `image`, `video`, or `embed`.
- `link_label`, `link_url`: Optional button or social link fields.
- `tags`: Comma-separated labels.
- `color`: Used only by `theme` rows.
- `order`: Number used for sorting within a section.
- `published`: Use `TRUE` to show a row. Use `FALSE` to hide it without deleting it.

## Common Edits

- Add a project: copy a `project` row, give it a new `id`, then add one or more `project_block` rows with the same `id`.
- Hide a project: set `published` to `FALSE`.
- Reorder cards: change `order`.
- Change colors: edit `theme` rows. Supported IDs are `accent`, `accent-soft`, `moss`, `plum`, `ink`, `muted`, `surface`, and `paper`.
- Add a portrait or project image: put a public Google Drive link in `media_url` and set `media_type` to `image`.

## Legacy Tabs

The old `home`, `about`, and `proj-*` tabs can still be read by `legacySheets.enabled` in `content.config.js`. By default, legacy tabs only supplement the redesigned content with existing media such as the portrait/resume link. Set `legacySheets.supplementOnly` to `false` only if you intentionally want the old tab text and projects to replace the redesigned content.
