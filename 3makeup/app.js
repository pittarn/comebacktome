(function () {
  const C = CONFIG;
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- fill text ---------- */
  $("#to").textContent = C.to;
  $("#coverHint").textContent = C.coverHint;
  $("#letterTitle").textContent = C.letterTitle;
  const lb = $("#letterBody");
  C.letter.forEach((t) => { const p = document.createElement("p"); p.textContent = t; p.className = "reveal pending"; lb.appendChild(p); });
  const sg = document.createElement("p"); sg.className = "sign reveal pending"; sg.textContent = C.signature; lb.appendChild(sg);
  $("#momentsTitle").textContent = C.momentsTitle;
  $("#promisesTitle").textContent = C.promisesTitle;
  $("#promisesHint").textContent = C.promisesHint;
  $("#question").textContent = C.question;
  $("#yes").textContent = C.yesButton;
  $("#no").textContent = C.noButton;
  $("#yesTitle").textContent = C.yesTitle;
  $("#yesText").textContent = C.yesText;

  /* ---------- photos ---------- */
  const strip = $("#strip");
  C.photos.forEach((ph, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "polaroid";
    const box = document.createElement("div"); box.className = "ph";
    if (ph.src) { const im = document.createElement("img"); im.src = ph.src; im.alt = ph.caption; box.appendChild(im); }
    else box.innerHTML = `<div class="empty"><img src="${i % 2 ? "rose-white.webp" : "rose-red.webp"}" alt=""><small>รูปที่ ${i + 1}</small></div>`;
    const cap = document.createElement("span"); cap.textContent = ph.caption;
    b.append(box, cap);
    b.addEventListener("click", () => {
      if (!ph.src) return;
      $("#lbImg").src = ph.src; $("#lbImg").alt = ph.caption; $("#lbCap").textContent = ph.caption;
      $("#lightbox").classList.add("show");
    });
    strip.appendChild(b);
  });

  /* ---------- promises ---------- */
  const pr = $("#promises");
  C.promises.forEach((t, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "promise";
    b.innerHTML = `<div class="in"><div class="face front"><img src="${i % 2 ? "rose-white.webp" : "rose-red.webp"}" alt=""></div><div class="face back"></div></div>`;
    b.querySelector(".back").append(document.createTextNode(t));
    b.addEventListener("click", () => b.classList.toggle("open"));
    pr.appendChild(b);
  });

  /* ---------- reveal on scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.remove("pending"); io.unobserve(e.target); }
  }), { threshold: 0.15 }) : null;
  function watchReveals() {
    document.querySelectorAll(".reveal.pending").forEach((el, i) => {
      el.style.transitionDelay = (el.closest("#letterBody") ? i * 0.35 : 0) + "s";
      if (io) io.observe(el); else el.classList.remove("pending");
    });
  }

  /* ---------- cover ---------- */
  const cover = $("#cover");
  document.body.classList.add("locked");
  /* ---------- background music ---------- */
  const music = $("#music"), mbtn = $("#musicBtn");
  if (C.music) { music.src = C.music; music.volume = 0.7; }
  function setMusicUI() { mbtn.classList.toggle("off", music.paused); }
  function playMusic() { if (!C.music) return; music.play().then(setMusicUI).catch(setMusicUI); }
  function stopMusic() { music.pause(); setMusicUI(); }
  mbtn.addEventListener("click", () => (music.paused ? playMusic() : stopMusic()));

  function openLetter() {
    if (cover.classList.contains("opening")) return;
    cover.classList.add("opening");
    if (C.music) { mbtn.hidden = false; playMusic(); }
    setTimeout(() => { cover.classList.add("gone"); document.body.classList.remove("locked"); watchReveals(); }, reduce ? 0 : 1700);
  }
  $("#seal").addEventListener("click", openLetter);
  $(".env-letter").addEventListener("click", openLetter);

  /* ---------- the question ---------- */
  const no = $("#no"), yes = $("#yes"), area = $("#btns");
  let tries = 0, scale = 1;
  function dodge(e) {
    if (e) e.preventDefault();
    tries++;
    no.textContent = C.noTexts[(tries - 1) % C.noTexts.length];
    scale = Math.min(1.9, scale + 0.12);
    yes.style.transform = `scale(${scale})`;
    no.classList.add("run");
    const a = area.getBoundingClientRect(), w = no.offsetWidth, h = no.offsetHeight;
    const yh = yes.offsetHeight * scale, gap = 14;
    const topMax = a.height / 2 - yh / 2 - h - gap, botMin = a.height / 2 + yh / 2 + gap;
    const x = Math.random() * Math.max(0, a.width - w);
    const y = Math.random() < 0.5 ? Math.random() * Math.max(0, topMax) : botMin + Math.random() * Math.max(0, a.height - h - botMin);
    no.style.left = x + "px"; no.style.top = y + "px";
  }
  no.addEventListener("click", dodge);
  no.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") dodge(); });

  yes.addEventListener("click", () => {
    $("#yay").classList.add("show");
    burst();
  });
  $("#again").addEventListener("click", () => {
    $("#yay").classList.remove("show");
    tries = 0; scale = 1; yes.style.transform = ""; no.classList.remove("run"); no.style.left = no.style.top = "";
    no.textContent = C.noButton;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- video ---------- */
  const vid = $("#vid");
  if (C.video) {
    vid.src = C.video; if (C.videoPoster) vid.poster = C.videoPoster;
    $("#vbtn").textContent = C.videoButton;
    $("#vbtn").addEventListener("click", () => { $("#videoVeil").classList.add("show"); vid.play().catch(() => {}); });
  } else $("#vbtn").hidden = true;
  vid.addEventListener("play", stopMusic);
  $("#vclose").addEventListener("click", () => { vid.pause(); $("#videoVeil").classList.remove("show"); });
  $("#lbclose").addEventListener("click", () => $("#lightbox").classList.remove("show"));
  document.querySelectorAll(".veil").forEach((v) => v.addEventListener("click", (e) => {
    if (e.target === v) { v.classList.remove("show"); vid.pause(); }
  }));
  addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".veil.show").forEach((v) => { v.classList.remove("show"); vid.pause(); }); });

  /* ---------- falling petals ---------- */
  const cv = $("#petals"), cx = cv.getContext("2d");
  let W = 0, H = 0; const DPR = Math.min(devicePixelRatio || 1, 2);
  function size() { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener("resize", size);
  const mk = (top) => ({ x: Math.random() * W, y: top ? -20 - Math.random() * H * 0.3 : Math.random() * H, s: 5 + Math.random() * 7,
    vy: 0.3 + Math.random() * 0.6, vx: -0.3 + Math.random() * 0.6, r: Math.random() * 6.3, vr: -0.02 + Math.random() * 0.04,
    ph: Math.random() * 6.3, red: Math.random() < 0.6, a: 0.55 + Math.random() * 0.35 });
  let P = []; for (let i = 0; i < 16; i++) P.push(mk(false));
  function burst() { for (let i = 0; i < 90; i++) { const p = mk(true); p.y = -20 - Math.random() * H * 0.8; p.vy += 0.8; P.push(p); } }
  function petal(p) {
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.ph)));
    const g = cx.createLinearGradient(0, -p.s, 0, p.s);
    if (p.red) { g.addColorStop(0, "#e0384f"); g.addColorStop(1, "#7a0a20"); } else { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#e8d8cc"); }
    cx.globalAlpha = p.a; cx.fillStyle = g; cx.beginPath(); cx.moveTo(0, -p.s);
    cx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.8, 0, p.s); cx.bezierCurveTo(-p.s * 0.7, p.s * 0.8, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
    cx.fill(); cx.restore();
  }
  function tick() {
    cx.clearRect(0, 0, W, H);
    P = P.filter((p, i) => {
      p.ph += 0.03; p.y += p.vy; p.x += p.vx + Math.sin(p.ph) * 0.4; p.r += p.vr;
      if (p.y > H + 20) { if (i < 16) Object.assign(p, mk(true)); else return false; }
      petal(p); return true;
    });
    requestAnimationFrame(tick);
  }
  if (!reduce) requestAnimationFrame(tick);
})();
