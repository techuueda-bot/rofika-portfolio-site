const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const driftItems = Array.from(document.querySelectorAll("[data-drift]"));
const scenes = Array.from(document.querySelectorAll(".window-scene"));
const ambients = Array.from(document.querySelectorAll(".ambient"));

let ticking = false;

function setScrollMotion() {
  if (reduceMotion.matches) {
    return;
  }

  const viewport = window.innerHeight || 1;

  driftItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const progress = (center - viewport / 2) / viewport;
    const strength = item.dataset.drift === "window" ? 22 : 12;
    const xStrength = item.dataset.drift === "window" ? 8 : 5;

    item.style.setProperty("--drift-y", `${progress * -strength}px`);
    item.style.setProperty("--drift-x", `${progress * xStrength * (index % 2 ? -1 : 1)}px`);
  });

  scenes.forEach((scene, index) => {
    const rect = scene.getBoundingClientRect();
    const progress = (rect.top - viewport) / (viewport + rect.height);
    const direction = index % 2 ? -1 : 1;
    scene.style.setProperty("--scene-x", `${progress * 28 * direction}px`);
  });

  ambients.forEach((ambient, index) => {
    const amount = window.scrollY * (index ? -0.018 : 0.014);
    ambient.style.setProperty("--float-y", `${amount}px`);
  });

  ticking = false;
}

function requestScrollMotion() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(setScrollMotion);
}

if (!reduceMotion.matches) {
  setScrollMotion();
  window.addEventListener("scroll", requestScrollMotion, { passive: true });
  window.addEventListener("resize", requestScrollMotion);
}
