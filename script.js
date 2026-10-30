/* ============================================================
   Data proyek untuk modal.
   TODO: ganti "link" dengan URL GitHub / portofolio tiap proyek.
   Biarkan "" jika belum ada, tombol akan menampilkan "segera".
   ============================================================ */
const projects = [
  {
    title: "Chatbot Customer Service Berbasis RAG",
    category: "Machine Learning",
    description:
      "Chatbot CS toko laptop yang menjawab dari 5 dokumen toko. Dokumen disimpan di ChromaDB dan dicari dengan embedding multilingual-e5-small. Bot hanya menjawab dari dokumen dan meneruskan ke tim CS jika informasi tidak ada. Berjalan lewat Telegram, diuji dengan 19 skenario otomatis.",
    stack: ["RAG", "ChromaDB", "multilingual-e5-small", "Telegram"],
    link: "https://github.com/JeJes-7/Chatbot-Customer-Service-Berbasis-RAG",
  },
  {
    title: "Sistem Prediksi Gagal Jantung",
    category: "Machine Learning & MLOps",
    description:
      "Model Random Forest untuk memprediksi kematian pasien gagal jantung dari data klinis, dengan preprocessing dan pelacakan eksperimen/parameter/metrik/artefak memakai MLflow. Pipeline MLOps end-to-end: model disajikan lewat REST API Flask, dimonitor dengan Prometheus dan Grafana (request rate, latensi, error, CPU, memori), dilengkapi alerting dan workflow CI di GitHub.",
    stack: [
      "Random Forest",
      "MLflow",
      "Flask",
      "Prometheus",
      "Grafana",
      "GitHub CI",
    ],
    link: "https://github.com/JeJes-7/MSML",
  },
  {
    title: "Predictive Maintenance Copilot",
    category: "Machine Learning",
    description:
      'Model deteksi kegagalan mesin hibrida (One-Class SVM + XGBoost; skor anomali OCSVM jadi fitur tambahan XGBoost), penyebab kerusakan dijelaskan dengan SHAP. Aplikasi "Maintenance Copilot" end-to-end: backend REST API Flask yang mengklasifikasikan mesin menjadi Normal/Warning/Critical, dashboard Streamlit, visualisasi SHAP per mesin, dan rekomendasi tindakan teknisi otomatis memakai LLM.',
    stack: ["One-Class SVM", "XGBoost", "SHAP", "Flask", "Streamlit", "LLM"],
    link: "https://github.com/JeJes-7/Sistem-Pemeliharaan-Mesin",
  },
];

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute(
    "aria-label",
    open ? "Tutup menu navigasi" : "Buka menu navigasi",
  );
  mobileMenu.hidden = !open;
}
menuBtn.addEventListener("click", () =>
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true"),
);
mobileMenu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- Avatar fallback (inisial JY jika foto tidak ada) ---------- */
const avatarImg = document.querySelector(".avatar img");
if (avatarImg) {
  avatarImg.addEventListener("error", () => {
    avatarImg.style.display = "none";
  });
}

/* ---------- Reveal saat scroll ---------- */
const reveals = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Modal proyek (keyboard, focus trap, Esc) ---------- */
const modal = document.getElementById("project-modal");
const closeBtn = document.getElementById("modal-close");
const linkEl = document.getElementById("modal-link");
let lastFocused = null;

function openModal(index) {
  const p = projects[index];
  if (!p) return;
  lastFocused = document.activeElement;

  document.getElementById("modal-title").textContent = p.title;
  document.getElementById("modal-category").textContent = p.category;
  document.getElementById("modal-description").textContent = p.description;

  const stack = document.getElementById("modal-stack");
  stack.innerHTML = "";
  p.stack.forEach((t) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.textContent = t;
    stack.appendChild(li);
  });

  if (p.link) {
    linkEl.href = p.link;
    linkEl.textContent = "Lihat portofolio";
    linkEl.removeAttribute("aria-disabled");
  } else {
    linkEl.href = "#";
    linkEl.textContent = "Link portofolio (segera)";
    linkEl.setAttribute("aria-disabled", "true");
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    modal.classList.add("is-open");
    closeBtn.focus();
  });
  document.addEventListener("keydown", onKeydown);
}

function closeModal() {
  modal.classList.remove("is-open");
  document.removeEventListener("keydown", onKeydown);
  setTimeout(
    () => {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    },
    reduceMotion ? 0 : 200,
  );
}

function onKeydown(e) {
  if (e.key === "Escape") {
    closeModal();
    return;
  }
  if (e.key !== "Tab") return;
  const focusable = modal.querySelectorAll(
    'button, [href], [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => openModal(Number(card.dataset.project)));
});
modal
  .querySelectorAll("[data-close]")
  .forEach((el) => el.addEventListener("click", closeModal));
closeBtn.addEventListener("click", closeModal);
linkEl.addEventListener("click", (e) => {
  if (linkEl.getAttribute("aria-disabled") === "true") e.preventDefault();
});

/* ---------- Hero: titik data berkelompok (ala PSO + K-Means) ---------- */
(function heroClusters() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const COLORS = ["#22d3ee", "#a78bfa", "#fbbf24"];
  const CENTROID = "#f472b6";
  const PER_CLUSTER = 36;
  let w = 0,
    h = 0,
    dpr = 1,
    raf = 0,
    visible = true;
  let centroids = [];
  let pts = [];

  function init() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // posisi dasar centroid, dominan di sisi kanan agar tidak menutupi teks
    const base = [
      [0.72, 0.25],
      [0.88, 0.62],
      [0.58, 0.72],
    ];
    centroids = base.map(([bx, by], i) => ({
      bx: bx * w,
      by: by * h,
      x: bx * w,
      y: by * h,
      ph: i * 2.1,
    }));
    pts = [];
    centroids.forEach((c, ci) => {
      for (let i = 0; i < PER_CLUSTER; i++) {
        pts.push({
          c: ci,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          r: 1.5 + Math.random() * 2,
          spread: 20 + Math.random() * 70,
        });
      }
    });
  }

  function step(t) {
    ctx.clearRect(0, 0, w, h);
    centroids.forEach((c) => {
      c.x = c.bx + Math.sin(t / 2600 + c.ph) * 22;
      c.y = c.by + Math.cos(t / 3100 + c.ph) * 18;
    });

    // garis tipis titik -> centroid
    ctx.lineWidth = 1;
    pts.forEach((p) => {
      const c = centroids[p.c];
      // pergerakan ala partikel: inersia + tarikan ke centroid + gangguan acak
      const tx = c.x + Math.cos(p.spread + t / 4000) * p.spread;
      const ty = c.y + Math.sin(p.spread * 1.3 + t / 4500) * p.spread;
      p.vx = p.vx * 0.9 + (tx - p.x) * 0.012 + (Math.random() - 0.5) * 0.08;
      p.vy = p.vy * 0.9 + (ty - p.y) * 0.012 + (Math.random() - 0.5) * 0.08;
      p.x += p.vx;
      p.y += p.vy;

      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = COLORS[p.c];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
    });

    pts.forEach((p) => {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = COLORS[p.c];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // centroid
    centroids.forEach((c) => {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = CENTROID;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c.x - 5, c.y);
      ctx.lineTo(c.x + 5, c.y);
      ctx.moveTo(c.x, c.y - 5);
      ctx.lineTo(c.x, c.y + 5);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    if (visible) step(t);
    raf = requestAnimationFrame(loop);
  }

  init();
  if (reduceMotion) {
    // tampilan statis: biarkan titik menetap dulu, lalu gambar sekali
    for (let i = 0; i < 120; i++) step(i * 16);
    return;
  }
  raf = requestAnimationFrame(loop);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    }).observe(canvas);
  }
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(init, 150);
  });
})();
