const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const nav = document.getElementById("nav");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const LANG_KEY = "jco-lang";
let currentLang = localStorage.getItem(LANG_KEY) === "en" ? "en" : "fr";

const applyI18n = (lang) => {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml, lang);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder, lang));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria, lang));
  });
  const title = t("meta.title", lang);
  if (title) document.title = title;
};

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyI18n(btn.dataset.lang));
});
applyI18n(currentLang);

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = String(new FormData(form).get("name") || "").trim();
  statusEl.textContent = t("contact.thanks", currentLang).replace("{name}", name);
  form.reset();
});

const sections = [...document.querySelectorAll("section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];
const spy = () => {
  const y = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= y) current = section.id;
  });
  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
  });
  nav?.classList.toggle("is-scrolled", window.scrollY > 12);
};
window.addEventListener("scroll", spy, { passive: true });
spy();
