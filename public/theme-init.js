(() => {
  const root = document.documentElement;
  let theme = "light";

  try {
    theme = window.localStorage.getItem("cestudy:theme:v1") === "dark" ? "dark" : "light";
  } catch {
    // Continue with the safe light default when browser storage is unavailable.
  }

  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", theme === "dark" ? "#0B1421" : "#FFFFFF");
  }
})();
