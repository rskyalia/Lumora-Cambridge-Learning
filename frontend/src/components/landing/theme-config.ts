// Shared, framework-neutral theme constants.
// Kept OUTSIDE the "use client" module so both the server component
// (inline anti-flash script) and the client provider receive real strings,
// not client-reference objects.

export const THEME_ROOT_ID = "landing-root";
export const THEME_STORAGE_KEY = "lumora-landing-theme";
