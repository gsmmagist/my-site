"use strict";

// Интерактивная функция: переключение светлой и тёмной темы.
(function initializeSite() {
  const themeButton = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");
  const themeIcon = themeButton.querySelector(".theme-icon");
  const year = document.getElementById("year");
  const storageKey = "magistrdev-theme";

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (_error) {
      // При запрете localStorage переключение темы всё равно работает.
    }
  }

  function readTheme() {
    try {
      return window.localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
    } catch (_error) {
      return "light";
    }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeLabel.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    themeIcon.textContent = isDark ? "☀" : "☾";
  }

  applyTheme(readTheme());
  themeButton.addEventListener("click", function () {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });

  year.textContent = String(new Date().getFullYear());
}());
