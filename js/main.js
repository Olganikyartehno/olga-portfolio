(function () {
  "use strict";

  var header = document.getElementById("header");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var navLinks = nav ? nav.querySelectorAll("a") : [];

  /* Шапка: тень после прокрутки + прогресс чтения */
  var progress = document.getElementById("progress");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct.toFixed(2) + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Hero: свечение следует за курсором */
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var glow = document.querySelector(".hero__glow");
  var hero = document.querySelector(".hero");

  if (glow && hero && !reducedMotion && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - 0.5) * 48;
      var y = ((event.clientY - rect.top) / rect.height - 0.5) * 48;
      glow.style.setProperty("--gx", x.toFixed(1) + "px");
      glow.style.setProperty("--gy", y.toFixed(1) + "px");
    });

    hero.addEventListener("mouseleave", function () {
      glow.style.setProperty("--gx", "0px");
      glow.style.setProperty("--gy", "0px");
    });
  }

  /* Мобильное меню */
  function closeMenu() {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  }

  function openMenu() {
    nav.classList.add("is-open");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");
  }

  if (burger) {
    burger.addEventListener("click", function () {
      nav.classList.contains("is-open") ? closeMenu() : openMenu();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  /* Плавный скролл к якорям с учётом фиксированной шапки */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      var target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      var headerOffset = header.offsetHeight + 12;
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });

      try {
        history.replaceState(null, "", id);
      } catch (err) {
        /* file:// и старые браузеры не дают менять URL */
      }
    });
  });

  /* Подсветка активного пункта меню */
  var sections = ["about", "projects", "contacts"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var isActive = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", isActive);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* Появление блоков при прокрутке */
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }
})();
