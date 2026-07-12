/* showcase.js — RO FIKA 演出本体
   光のWebGL / Lenis / 文字点灯 / FIKA TIMEの移ろい / 横スクロールギャラリー / カーソル / グレイン
   停止時(html.is-motion-off)は一切初期化しない(main.jsのポリシー) */

(function () {
  "use strict";

  if (document.documentElement.classList.contains("is-motion-off")) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var isMobile = matchMedia("(max-width: 767px)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* 光の状態(ScrollTriggerが書き、描画ループが読む) */
  var state = { warmth: 0, warmthTarget: 0 };

  document.addEventListener("DOMContentLoaded", function () {
    initLenis();
    initLightGL();
    initGrain();
    initIlluminate();
    initFikaTime();
    initGalleryScroll();
    initHeroParallax();
    if (fine) initCursor();
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  });

  /* ---- Lenis スムーズスクロール ---- */
  var lenis = null;
  function initLenis() {
    if (!window.Lenis) return;
    document.documentElement.style.scrollBehavior = "auto"; // 競合防止
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ページ内アンカーもLenis経由に
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      if (a.classList.contains("skip-link")) return; // フォーカス移動を殺さない
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      });
    });
  }

  /* ---- 背面の光(Three.js フルスクリーンシェーダー) ----
     木漏れ日の斑 + 斜めの光線。uWarmth で午後(白金)→夕方(琥珀)に移ろう */
  function initLightGL() {
    var canvas = document.querySelector(".gl-light");
    if (!canvas || !window.THREE) { document.body.classList.add("no-webgl"); return; }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    } catch (e) {
      document.body.classList.add("no-webgl");
      return;
    }
    var DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(DPR);
    renderer.setSize(innerWidth, innerHeight);

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var uniforms = {
      uTime: { value: 0 },
      uWarmth: { value: 0 },
      uRes: { value: new THREE.Vector2(innerWidth, innerHeight) }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: [
        "varying vec2 vUv;",
        "void main() { vUv = uv; gl_Position = vec4(position, 1.0); }"
      ].join("\n"),
      fragmentShader: [
        "precision highp float;",
        "varying vec2 vUv;",
        "uniform float uTime; uniform float uWarmth; uniform vec2 uRes;",
        "float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
        "float noise(vec2 p) {",
        "  vec2 i = floor(p), f = fract(p);",
        "  vec2 u = f * f * (3.0 - 2.0 * f);",
        "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),",
        "             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);",
        "}",
        "float fbm(vec2 p) {",
        "  float v = 0.0, a = 0.5;",
        "  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }",
        "  return v;",
        "}",
        "void main() {",
        "  float aspect = uRes.x / max(uRes.y, 1.0);",
        "  vec2 p = vec2(vUv.x * aspect, vUv.y);",
        "  float t = uTime * 0.05;",
        // 木漏れ日の斑(ゆっくり流れて明滅)
        "  float dapple = fbm(p * 2.4 + vec2(t, t * 0.6));",
        "  dapple = smoothstep(0.42, 0.78, dapple);",
        // 右上から差す斜めの光線
        "  float band = sin((p.x * 0.7 - p.y * 1.5) * 5.0 + uTime * 0.1 + fbm(p * 1.3) * 2.2);",
        "  float rays = smoothstep(0.15, 0.95, band * 0.5 + 0.5);",
        // 上ほど明るい(窓の高さ)、右上に光だまり
        "  float topGlow = smoothstep(0.05, 0.95, vUv.y);",
        "  float pool = smoothstep(1.15, 0.25, length(vUv - vec2(0.72, 0.78)));",
        "  float I = (dapple * 0.5 + rays * 0.32) * topGlow + pool * 0.22;",
        // 色温度: 午後の白金 → 夕方の琥珀
        "  vec3 noon = vec3(1.0, 0.955, 0.85);",
        "  vec3 dusk = vec3(1.0, 0.76, 0.5);",
        "  vec3 light = mix(noon, dusk, uWarmth);",
        "  float alpha = I * (0.42 + uWarmth * 0.34);",
        "  gl_FragColor = vec4(light, alpha);",
        "}"
      ].join("\n")
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    var bgBase = { r: 250, g: 246, b: 236 };  /* --color-bg */
    var bgDusk = { r: 247, g: 228, b: 198 };
    var clock = new THREE.Clock();

    function render() {
      uniforms.uTime.value += clock.getDelta();
      state.warmth += (state.warmthTarget - state.warmth) * 0.06;
      uniforms.uWarmth.value = state.warmth;
      var w = state.warmth;
      document.body.style.backgroundColor =
        "rgb(" + Math.round(bgBase.r + (bgDusk.r - bgBase.r) * w) + "," +
                 Math.round(bgBase.g + (bgDusk.g - bgBase.g) * w) + "," +
                 Math.round(bgBase.b + (bgDusk.b - bgBase.b) * w) + ")";
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.addEventListener("resize", function () {
      renderer.setSize(innerWidth, innerHeight);
      uniforms.uRes.value.set(innerWidth, innerHeight);
    });
  }

  /* ---- フィルムグレイン(事前生成タイル・低負荷) ---- */
  function initGrain() {
    var canvas = document.querySelector(".grain");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var TILE = 256;
    var tiles = [];
    for (var i = 0; i < 3; i++) {
      var t = document.createElement("canvas");
      t.width = TILE; t.height = TILE;
      var tc = t.getContext("2d");
      var img = tc.createImageData(TILE, TILE);
      for (var j = 0; j < img.data.length; j += 4) {
        var v = 238 + Math.random() * 17; // multiply用: わずかに暗い紙の粒
        img.data[j] = img.data[j + 1] = img.data[j + 2] = v;
        img.data[j + 3] = 255;
      }
      tc.putImageData(img, 0, 0);
      tiles.push(t);
    }
    function size() { canvas.width = innerWidth; canvas.height = innerHeight; }
    size();
    window.addEventListener("resize", size);

    var last = 0, frame = 0;
    function loop(now) {
      requestAnimationFrame(loop);
      if (now - last < 1000 / 24) return; // 24fps
      last = now;
      frame = (frame + 1) % 3;
      var tile = tiles[frame];
      var ox = Math.floor(Math.random() * TILE), oy = Math.floor(Math.random() * TILE);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var x = -ox; x < canvas.width; x += TILE)
        for (var y = -oy; y < canvas.height; y += TILE)
          ctx.drawImage(tile, x, y);
    }
    requestAnimationFrame(loop);
  }

  /* ---- Concept: 文字点灯(pitfalls.md #2 の行ボックス方式) ---- */
  function initIlluminate() {
    var ill = document.querySelector("[data-illuminate]");
    if (!ill) return;
    var sentences = ill.innerHTML.split(/<br[^>]*>/i);
    ill.innerHTML = "";
    sentences.forEach(function (sentence) {
      var clean = sentence.replace(/<[^>]*>/g, "").trim();
      if (!clean) return;
      var line = document.createElement("span");
      line.className = "concept__line";
      clean.split("").forEach(function (c) {
        var sp = document.createElement("span");
        sp.className = "ch";
        sp.textContent = c;
        line.appendChild(sp);
      });
      ill.appendChild(line);
    });
    gsap.to(".concept__text .ch", {
      opacity: 1, ease: "none", stagger: 1,
      scrollTrigger: { trigger: ".concept", start: "top 40%", end: "bottom 92%", scrub: true }
    });
  }

  /* ---- FIKA TIME: 時計が進み、光が夕方へ移ろう ---- */
  function initFikaTime() {
    var section = document.querySelector(".fika");
    if (!section) return;
    var clockEl = section.querySelector(".js-fika-clock");
    var phrases = section.querySelectorAll(".fika__phrase");
    var START = 13 * 60, END = 17 * 60 + 10; // 1:00 PM → 5:10 PM

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: function (self) {
        var p = self.progress;
        state.warmthTarget = p;
        if (clockEl) {
          var total = Math.round(START + (END - START) * p);
          var h = Math.floor(total / 60), m = total % 60;
          clockEl.textContent = (h - 12) + ":" + (m < 10 ? "0" + m : m);
        }
        var idx = Math.min(phrases.length - 1, Math.floor(p * phrases.length));
        phrases.forEach(function (el, i) { el.classList.toggle("is-current", i === idx); });
      }
    });

    // ギャラリーに入ったら光を午後に戻す(写真の色を邪魔しない)
    ScrollTrigger.create({
      trigger: ".gallery",
      start: "top 80%",
      end: "top top",
      scrub: true,
      onUpdate: function (self) {
        state.warmthTarget = Math.min(state.warmthTarget, 1 - self.progress);
      }
    });
  }

  /* ---- Gallery: 横スクロール(pin + scrub) ---- */
  function initGalleryScroll() {
    var track = document.querySelector(".gallery__track");
    var pinEl = document.querySelector(".gallery__pin");
    if (!track || !pinEl) return;
    gsap.to(track, {
      x: function () { return -(track.scrollWidth - innerWidth); },
      ease: "none",
      scrollTrigger: {
        trigger: ".gallery",
        pin: pinEl,
        scrub: 1,
        start: "top top",
        end: function () { return "+=" + (track.scrollWidth - innerWidth); },
        invalidateOnRefresh: true
      }
    });
  }

  /* ---- ヒーロー窓写真: 控えめパララックス ---- */
  function initHeroParallax() {
    var win = document.querySelector(".hero__window");
    if (!win) return;
    gsap.to(win, {
      yPercent: -14, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---- カスタムカーソル(光の玉 + 遅延リング) ---- */
  function initCursor() {
    var cursor = document.querySelector(".cursor");
    if (!cursor) return;
    var dot = cursor.querySelector(".cursor__dot");
    var ring = cursor.querySelector(".cursor__ring");
    var x = -100, y = -100, rx = -100, ry = -100;

    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = "translate(" + (x - 4) + "px," + (y - 4) + "px)";
    }, { passive: true });

    gsap.ticker.add(function () {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = "translate(" + (rx - 18) + "px," + (ry - 18) + "px)";
    });

    document.querySelectorAll("[data-cursor], a, button").forEach(function (el) {
      el.addEventListener("pointerenter", function () { cursor.classList.add("is-active"); });
      el.addEventListener("pointerleave", function () { cursor.classList.remove("is-active"); });
    });
  }
})();
