export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const DARK_THEME_CLASS = "dark";
export const DEFAULT_THEME: Theme = "dark";
export const ENABLE_SYSTEM_THEME = true;

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

type ThemeInitScriptOptions = {
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

export function getThemeInitScript({
  defaultTheme = DEFAULT_THEME,
  enableSystem = ENABLE_SYSTEM_THEME,
}: ThemeInitScriptOptions = {}) {
  return `
    (() => {
      const storageKey = "${THEME_STORAGE_KEY}";
      const mediaQuery = "${THEME_MEDIA_QUERY}";
      const darkClass = "${DARK_THEME_CLASS}";
      const defaultTheme = "${defaultTheme}";
      const enableSystem = ${enableSystem ? "true" : "false"};
      const root = document.documentElement;

      const getStoredTheme = () => {
        try {
          const value = localStorage.getItem(storageKey);
          return value === "light" || value === "dark" || value === "system" ? value : null;
        } catch {
          return null;
        }
      };

      const getSystemTheme = () => {
        return window.matchMedia(mediaQuery).matches ? "dark" : "light";
      };

      const resolveTheme = (theme) => {
        if (theme === "system" && enableSystem) {
          return getSystemTheme();
        }

        return theme === "dark" ? "dark" : "light";
      };

      const applyTheme = (resolvedTheme) => {
        root.classList.toggle(darkClass, resolvedTheme === "dark");
        root.style.colorScheme = resolvedTheme;
      };

      applyTheme(resolveTheme(getStoredTheme() ?? defaultTheme));
    })();
  `.trim();
}
