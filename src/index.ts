/**
 * Use `window.innerHeight` & `window.innerWidth` to determine if script is
 * loading in the context of a web extension background page
 */
export function isBackgroundPage(): boolean {
  return window.innerHeight === 0 && window.innerWidth === 0;
}

// When this script is being loaded in the context of a web extension background
// page, we don't need to render the app UI so we use dynamic imports to prevent
// unnecessary loading & initialization UI-related modules (React, stylesheets,
// UI assets etc.)
if (isBackgroundPage()) {
  console.log("[INFO] Script is loaded as a background page");
  import("./background/index");
} else {
  console.log("[INFO] Script is not loaded as a background page");
  import("./application");
}
