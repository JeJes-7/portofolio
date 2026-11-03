/* ============================================================
   Data proyek untuk modal.
   TODO: ganti "link" dengan URL GitHub / portofolio tiap proyek.
   Biarkan "" jika belum ada, tombol akan menampilkan "segera".
   ============================================================ */
const projects = [
  {
    title: 'Skripsi: Klasterisasi Subtipe Pasien Diabetes',
    category: 'Skripsi · Machine Learning',
    description:
      'Sistem klasterisasi subtipe pasien diabetes berbasis PSO-KMeans pada data NHANES. Preprocessing statistik mencakup penanganan missing value, deteksi outlier, uji multikolinearitas, dan standardisasi z-score. Pasien dikelompokkan ke 4 subtipe (SIDD, SIRD, MARD, MOD) dengan K-Means yang dioptimasi PSO (DBI 1,3628), lalu diimplementasikan sebagai aplikasi web Laravel + MySQL dan diuji dengan 20 kasus blackbox testing.',
    stack: ['PSO', 'K-Means', 'NHANES', 'Laravel', 'MySQL'],
    link: 'https://diabetes.42web.io/',
    linkLabel: 'Lihat Demo (sistem klasterisasi offline)'
  },
  {
    title: 'Predictive Maintenance Copilot',
    category: 'Machine Learning',
    description:
      'Model deteksi kegagalan mesin hibrida (One-Class SVM + XGBoost; skor anomali OCSVM jadi fitur tambahan XGBoost), penyebab kerusakan dijelaskan dengan SHAP. Aplikasi "Maintenance Copilot" end-to-end: backend REST API Flask yang mengklasifikasikan mesin menjadi Normal/Warning/Critical, dashboard Streamlit, visualisasi SHAP per mesin, dan rekomendasi tindakan teknisi otomatis memakai LLM.',
    stack: ['One-Class SVM', 'XGBoost', 'SHAP', 'Flask', 'Streamlit', 'LLM'],
    link: 'https://github.com/JeJes-7/Sistem-Pemeliharaan-Mesin'
  },
  {
    title: 'Sistem Prediksi Gagal Jantung',
    category: 'Machine Learning & MLOps',
    description:
      'Model Random Forest untuk memprediksi kematian pasien gagal jantung dari data klinis, dengan preprocessing dan pelacakan eksperimen/parameter/metrik/artefak memakai MLflow. Pipeline MLOps end-to-end: model disajikan lewat REST API Flask, dimonitor dengan Prometheus dan Grafana (request rate, latensi, error, CPU, memori), dilengkapi alerting dan workflow CI di GitHub.',
    stack: ['Random Forest', 'MLflow', 'Flask', 'Prometheus', 'Grafana', 'GitHub CI'],
    link: 'https://github.com/JeJes-7/MSML'
  },
  {
    title: 'Analisis Sentimen Ulasan Aplikasi Bibit',
    category: 'NLP · Proyek Sertifikasi BNSP',
    description:
      'Klasifikasi sentimen (positif/negatif) pada 5.000 ulasan aplikasi Bibit dari Google Play Store; setelah ulasan netral dikeluarkan tersisa 4.696 ulasan. Teks Indonesia diproses lewat cleaning, normalisasi slang, stopword removal, dan stemming PySastrawi, lalu diubah dengan TF-IDF (unigram + bigram). Empat algoritma dibandingkan pada rasio 60:40 hingga 90:10, dan Logistic Regression dipilih karena paling konsisten dan seimbang antar kelas (akurasi 90%, F1 macro 88%).',
    stack: ['PySastrawi', 'TF-IDF', 'Logistic Regression', 'Random Forest', 'Naïve Bayes', 'Decision Tree'],
    link: 'https://github.com/JeJes-7/Analisis-Sentimen'
  },
  {
    title: 'Chatbot Customer Service Berbasis RAG',
    category: 'Machine Learning',
    description:
      'Chatbot CS toko laptop yang menjawab dari 5 dokumen toko. Dokumen disimpan di ChromaDB dan dicari dengan embedding multilingual-e5-small. Bot hanya menjawab dari dokumen dan meneruskan ke tim CS jika informasi tidak ada. Berjalan lewat Telegram, diuji dengan 19 skenario otomatis.',
    stack: ['RAG', 'ChromaDB', 'multilingual-e5-small', 'Telegram'],
    link: 'https://github.com/JeJes-7/Chatbot-Customer-Service-Berbasis-RAG'
  }
];

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  mobileMenu.hidden = !open;
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ---------- Avatar fallback (inisial JY jika foto tidak ada) ---------- */
const avatarImg = document.querySelector('.avatar img');
if (avatarImg) {
  avatarImg.addEventListener('error', () => { avatarImg.style.display = 'none'; });
}

/* ---------- Reveal saat scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Modal proyek (keyboard, focus trap, Esc) ---------- */
const modal = document.getElementById('project-modal');
const closeBtn = document.getElementById('modal-close');
const linkEl = document.getElementById('modal-link');
let lastFocused = null;

function openModal(index) {
  const p = projects[index];
  if (!p) return;
  lastFocused = document.activeElement;

  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-category').textContent = p.category;
  document.getElementById('modal-description').textContent = p.description;

  const stack = document.getElementById('modal-stack');
  stack.innerHTML = '';
  p.stack.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'chip';
    li.textContent = t;
    stack.appendChild(li);
  });

  if (p.link) {
    linkEl.href = p.link;
    linkEl.textContent = p.linkLabel || 'Lihat di GitHub';
    linkEl.removeAttribute('aria-disabled');
  } else {
    linkEl.href = '#';
    linkEl.textContent = 'Link portofolio (segera)';
    linkEl.setAttribute('aria-disabled', 'true');
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    closeBtn.focus();
  });
  document.addEventListener('keydown', onKeydown);
}

function closeModal() {
  modal.classList.remove('is-open');
  document.removeEventListener('keydown', onKeydown);
  setTimeout(() => {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }, reduceMotion ? 0 : 200);
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
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

document.querySelectorAll('[data-project]').forEach((card) => {
  card.addEventListener('click', () => openModal(Number(card.dataset.project)));
});
modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
closeBtn.addEventListener('click', closeModal);
linkEl.addEventListener('click', (e) => {
  if (linkEl.getAttribute('aria-disabled') === 'true') e.preventDefault();
});

/* ---------- Hero: titik data berkelompok (ala PSO + K-Means) ---------- */
(function heroClusters() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const COLORS = ['#22d3ee', '#a78bfa', '#fbbf24'];
  const CENTROID = '#f472b6';
  const PER_CLUSTER = 36;
  let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
  let centroids = [];
  let pts = [];

  function init() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // posisi dasar centroid, dominan di sisi kanan agar tidak menutupi teks
    const base = [[.72, .25], [.88, .62], [.58, .72]];
    centroids = base.map(([bx, by], i) => ({ bx: bx * w, by: by * h, x: bx * w, y: by * h, ph: i * 2.1 }));
    pts = [];
    centroids.forEach((c, ci) => {
      for (let i = 0; i < PER_CLUSTER; i++) {
        pts.push({
          c: ci,
          x: Math.random() * w, y: Math.random() * h,
          vx: 0, vy: 0,
          r: 1.5 + Math.random() * 2,
          spread: 20 + Math.random() * 70
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
      p.vx = p.vx * 0.9 + (tx - p.x) * 0.012 + (Math.random() - .5) * .08;
      p.vy = p.vy * 0.9 + (ty - p.y) * 0.012 + (Math.random() - .5) * .08;
      p.x += p.vx; p.y += p.vy;

      ctx.globalAlpha = .10;
      ctx.strokeStyle = COLORS[p.c];
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(c.x, c.y); ctx.stroke();
    });

    pts.forEach((p) => {
      ctx.globalAlpha = .85;
      ctx.fillStyle = COLORS[p.c];
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });

    // centroid
    centroids.forEach((c) => {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = CENTROID; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(c.x, c.y, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(c.x - 5, c.y); ctx.lineTo(c.x + 5, c.y);
      ctx.moveTo(c.x, c.y - 5); ctx.lineTo(c.x, c.y + 5); ctx.stroke();
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

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  }
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 150); });
})();

/* ---------- Carousel proyek: autoplay, pause on hover, tombol, drag/swipe ---------- */
(function projectCarousel() {
  const root = document.getElementById('project-carousel');
  if (!root) return;

  const viewport = root.querySelector('.carousel-viewport');
  const track = root.querySelector('.carousel-track');
  const cards = Array.from(track.children);
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  const dotsEl = root.querySelector('.carousel-dots');

  const DELAY = 3500;               // jeda autoplay (ms)
  let index = 0, spv = 3, step = 0;
  let timer = null;
  let hovering = false, focused = false, offscreen = false;

  // drag state
  let dragging = false, moved = false, startX = 0, dx = 0, pid = null;

  const maxIndex = () => Math.max(0, cards.length - spv);
  const clamp = (n) => Math.min(Math.max(n, 0), maxIndex());

  function measure() {
    spv = parseInt(getComputedStyle(root).getPropertyValue('--spv'), 10) || 1;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    step = cards[0].offsetWidth + gap;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', 'Ke halaman ' + (i + 1));
      b.addEventListener('click', () => go(i));
      dotsEl.appendChild(b);
    }
    dotsEl.hidden = maxIndex() === 0;
    prevBtn.hidden = nextBtn.hidden = maxIndex() === 0;
  }

  function render() {
    index = clamp(index);
    track.style.transform = 'translate3d(' + (-index * step) + 'px,0,0)';
    Array.from(dotsEl.children).forEach((d, i) =>
      i === index ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
    // kartu di luar layar tidak bisa difokus (keyboard) / dibaca screen reader
    cards.forEach((c, i) => { c.inert = i < index || i >= index + spv; });
  }

  // navigasi manual & autoplay: berputar (loop) di ujung
  function go(i) {
    index = i > maxIndex() ? 0 : i < 0 ? maxIndex() : i;
    render();
    start();
  }

  /* ----- Autoplay ----- */
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (reduceMotion || maxIndex() === 0) return;
    timer = setInterval(() => {
      if (hovering || focused || offscreen || dragging || document.hidden) return;
      go(index + 1);
    }, DELAY);
  }

  // pauseOnMouseEnter (hanya mouse, bukan sentuhan)
  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovering = false; start(); } });
  // pause juga saat navigasi keyboard
  root.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) focused = true; });
  root.addEventListener('focusout', () => { focused = false; });
  // pause saat carousel tidak terlihat
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { offscreen = !e.isIntersecting; }).observe(root);
  }

  prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn.addEventListener('click', () => go(index + 1));

  /* ----- Drag / swipe (mouse + sentuh) ----- */
  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; moved = false; dx = 0;
    startX = e.clientX; pid = e.pointerId;
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pid) return;
    dx = e.clientX - startX;
    if (!moved) {
      if (Math.abs(dx) < 6) return;          // abaikan getaran kecil agar klik kartu tetap jalan
      moved = true;
      viewport.setPointerCapture(pid);
      viewport.classList.add('is-dragging');
      track.classList.add('no-anim');
    }
    track.style.transform = 'translate3d(' + (-index * step + dx) + 'px,0,0)';
  });

  function endDrag(e) {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    if (moved) {
      viewport.classList.remove('is-dragging');
      track.classList.remove('no-anim');
      let delta = Math.round(-dx / step);
      if (delta === 0 && Math.abs(dx) > step * 0.2) delta = dx < 0 ? 1 : -1;
      index = clamp(index + delta);
      render();
      start();
      setTimeout(() => { moved = false; }, 100);
    }
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // setelah drag, jangan buka modal proyek
  viewport.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  track.addEventListener('dragstart', (e) => e.preventDefault());

  /* ----- Layout responsif ----- */
  function relayout() {
    track.classList.add('no-anim');
    measure();
    buildDots();
    render();
    void track.offsetWidth;                   // paksa reflow, lalu aktifkan animasi lagi
    track.classList.remove('no-anim');
  }
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(viewport);
  relayout();
  start();
})();
