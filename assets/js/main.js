(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Language toggle (English / Spanish) ---------- */
  var LANG_KEY = "monarca-lang";

  function applyLang(lang) {
    lang = lang === "es" ? "es" : "en";
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-es]").forEach(function (el) {
      if (!el.hasAttribute("data-en-cache")) {
        el.setAttribute("data-en-cache", el.textContent);
      }
      el.textContent = lang === "es" ? el.getAttribute("data-es") : el.getAttribute("data-en-cache");
    });

    document.querySelectorAll("[data-es-placeholder]").forEach(function (el) {
      if (!el.hasAttribute("data-en-placeholder-cache")) {
        el.setAttribute("data-en-placeholder-cache", el.getAttribute("placeholder") || "");
      }
      el.setAttribute(
        "placeholder",
        lang === "es" ? el.getAttribute("data-es-placeholder") : el.getAttribute("data-en-placeholder-cache")
      );
    });

    document.querySelectorAll("[data-lang-option]").forEach(function (opt) {
      var isActive = opt.getAttribute("data-lang-option") === lang;
      opt.classList.toggle("active", isActive);
      opt.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* storage unavailable, ignore */
    }
  }

  function initLangToggle() {
    var saved = "en";
    try {
      saved = localStorage.getItem(LANG_KEY) || "en";
    } catch (e) {
      /* storage unavailable, default to English */
    }
    applyLang(saved);

    document.querySelectorAll("[data-lang-option]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        applyLang(opt.getAttribute("data-lang-option"));
      });
    });
  }

  function initYear() {
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initLangToggle();
    initYear();
  });
})();
