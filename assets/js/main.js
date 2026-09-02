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

  /* ---------- Swipe card dots (mobile carousels) ---------- */
  function initSwipeDots() {
    document.querySelectorAll(".card-grid--swipe .card-swipe-row").forEach(function (row) {
      var cards = Array.prototype.slice.call(row.children).filter(function (el) {
        return el.classList.contains("card");
      });
      if (cards.length < 2) return;

      var dotsWrap = document.createElement("div");
      dotsWrap.className = "swipe-dots";

      var dots = cards.map(function (card, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "swipe-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () {
          card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        });
        dotsWrap.appendChild(dot);
        return dot;
      });

      row.insertAdjacentElement("afterend", dotsWrap);

      var ticking = false;
      row.addEventListener(
        "scroll",
        function () {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            var rowRect = row.getBoundingClientRect();
            var center = rowRect.left + rowRect.width / 2;
            var closest = 0;
            var closestDist = Infinity;
            cards.forEach(function (card, i) {
              var r = card.getBoundingClientRect();
              var dist = Math.abs(r.left + r.width / 2 - center);
              if (dist < closestDist) {
                closestDist = dist;
                closest = i;
              }
            });
            dots.forEach(function (dot, i) {
              dot.classList.toggle("active", i === closest);
            });
            ticking = false;
          });
        },
        { passive: true }
      );
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initLangToggle();
    initYear();
    initSwipeDots();
  });
})();
