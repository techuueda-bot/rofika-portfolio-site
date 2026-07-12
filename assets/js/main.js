/* main.js — 基盤(スターター由来)
   構成: モーション停止判定 / ローダー / reveal / ヘッダー状態 / ハンバーガー
   演出本体(GSAP/Three.js)は showcase.js 側 */

(function () {
  // 停止判定はどのスクリプトより先に(showcase.jsもこのクラスを見る)
  var motionOff = false;
  try { motionOff = sessionStorage.getItem("rofika-motion") === "off"; } catch (e) {}
  if (motionOff) {
    document.documentElement.classList.add("is-motion-off");
    document.body ? document.body.classList.add("is-loaded") : null;
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initReveal();
  initHeader();
  initNav();
  initMotionStop();
});

/* ---- ローダー: 窓に光が満ちる。5秒保険付き(pitfalls.md #6) ---- */
function initLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;

  if (document.documentElement.classList.contains("is-motion-off")) {
    document.body.classList.add("is-loaded");
    return;
  }

  const light = loader.querySelector(".loader__light");
  const count = loader.querySelector(".js-loader-count");
  let progress = 0;
  let finished = false;

  const tick = setInterval(() => {
    if (finished) return;
    progress = Math.min(92, progress + 3 + Math.random() * 9);
    render(progress);
  }, 120);

  function render(p) {
    const v = Math.round(p);
    if (count) count.textContent = String(v);
    if (light) light.style.transform = `scaleY(${v / 100})`;
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(tick);
    render(100);
    setTimeout(() => {
      loader.classList.add("is-done");
      document.body.classList.add("is-loaded");
      window.dispatchEvent(new CustomEvent("rofika:opened"));
    }, 380);
  }

  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish);
  setTimeout(finish, 5000); // 開かない事故の保険
}

/* ---- スクロールリビール ---- */
function initReveal() {
  const targets = document.querySelectorAll(".js-reveal");
  if (!targets.length) return;
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

/* ---- ヘッダー: スクロールで背景を付ける ---- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- ハンバーガー(aria連動。削除禁止) ---- */
function initNav() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

/* ---- モーション停止(ポリシー実装。削除禁止) ----
   reduced-motion環境にのみボタンが表示され(CSS側)、
   押した場合は sessionStorage に記録してリロード(確実に全停止/全再開) */
function initMotionStop() {
  const btn = document.querySelector(".motion-stop");
  if (!btn) return;
  const off = document.documentElement.classList.contains("is-motion-off");
  btn.textContent = off ? "アニメーションを再生する" : "アニメーションを停止する";
  btn.addEventListener("click", () => {
    try { sessionStorage.setItem("rofika-motion", off ? "on" : "off"); } catch (e) {}
    location.reload();
  });
}
