export interface IdentityFont {
  id: string;
  display: string;
  body: string;
  mono: string;
  google_fonts_url: string;
  stack_display: string;
  stack_body: string;
  stack_mono: string;
}

export interface IdentityPalette {
  id: string;
  hue: number;
  neutral_family: string;
  accent: string;
  accent_dark: string;
  surface: string;
  surface_alt: string;
  fg: string;
  fg_muted: string;
  border: string;
  surface_dark: string;
  surface_alt_dark: string;
  fg_dark: string;
  fg_muted_dark: string;
  border_dark: string;
}

export interface IdentityLayout {
  id: "magazine" | "dashboard" | "feed" | "directory" | "longform" | "kiosk";
  component: string;
  component_path: string;
  density: "loose" | "normal" | "dense";
  brief: string;
}

export interface IdentityVoice {
  id: string;
  label_latest: string;
  label_recent: string;
  label_featured: string;
  label_more: string;
  nav_posts: string;
  nav_about: string;
  cta_subscribe: string;
  cta_subscribe_desc: string;
  cta_button: string;
  site_motto: string;
}

export interface Identity {
  font: IdentityFont;
  palette: IdentityPalette;
  layout: IdentityLayout;
  voice: IdentityVoice;
}

export const identity: Identity = {
  "font": {
    "id": "f30_mono_fira_dmsans",
    "display": "Fira Code",
    "body": "DM Sans",
    "mono": "Fira Code",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap",
    "stack_display": "\"Fira Code\", ui-monospace, monospace",
    "stack_body": "\"DM Sans\", \"Helvetica Neue\", system-ui, sans-serif",
    "stack_mono": "\"Fira Code\", ui-monospace, monospace"
  },
  "palette": {
    "id": "p27_h304_ink",
    "hue": 304,
    "neutral_family": "ink",
    "accent": "196 39 185",
    "accent_dark": "232 74 221",
    "surface": "255 255 255",
    "surface_alt": "245 245 245",
    "fg": "10 10 10",
    "fg_muted": "80 80 80",
    "border": "220 220 220",
    "surface_dark": "10 10 10",
    "surface_alt_dark": "22 22 22",
    "fg_dark": "240 240 240",
    "fg_muted_dark": "160 160 160",
    "border_dark": "50 50 50"
  },
  "layout": {
    "id": "feed",
    "component": "HomeNewspaper",
    "component_path": "@components/clusters/HomeNewspaper.astro",
    "density": "dense",
    "brief": "Newspaper-style feed: dense single-column with sidebar digest."
  },
  "voice": {
    "id": "v12_index",
    "label_latest": "Recently indexed",
    "label_recent": "All entries",
    "label_featured": "Featured entry",
    "label_more": "Open entry",
    "nav_posts": "Entries",
    "nav_about": "About this index",
    "cta_subscribe": "Update notifications",
    "cta_subscribe_desc": "We notify you when a new entry is indexed.",
    "cta_button": "Notify me",
    "site_motto": "An indexed catalog. Sourced. Dated. Searchable."
  }
} as const;
