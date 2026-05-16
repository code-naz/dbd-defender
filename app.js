const LAB_VIDEO_URL = ""; // Isi dengan link YouTube penuh, contoh: https://www.youtube.com/watch?v=XXXXXXXX
const LOCAL_VIDEO_SRC = "assets/animasi nyamuk.mp4"; // Opsional, kalau file video lokal tersedia

const quizQuestions = [
  {
    question: "Nyamuk yang paling sering dikaitkan dengan penularan DBD adalah ...",
    options: ["Aedes aegypti", "Nyamuk buah", "Capung", "Lebah"],
    answer: 0,
    explanation: "Aedes aegypti adalah nyamuk yang perlu diwaspadai karena dapat menularkan DBD.",
  },
  {
    question: "Salah satu cara 3M adalah ...",
    options: ["Menguras tempat penampungan air", "Membiarkan air tergenang", "Menumpuk barang bekas", "Menutup ventilasi"],
    answer: 0,
    explanation: "Menguras tempat penampungan air membantu memutus tempat berkembang biak nyamuk.",
  },
  {
    question: "Menutup rapat tempat penampungan air termasuk pencegahan DBD yang disebut ...",
    options: ["Mendaur ulang", "Menutup", "Menguras", "Membakar"],
    answer: 1,
    explanation: "Menutup rapat tempat air adalah bagian dari gerakan 3M.",
  },
  {
    question: "Barang bekas yang dapat menampung air sebaiknya ...",
    options: ["Disimpan di halaman", "Dibiarkan begitu saja", "Didaur ulang atau dibuang dengan benar", "Diisi air"],
    answer: 2,
    explanation: "Barang bekas dapat menjadi sarang nyamuk kalau menampung air hujan.",
  },
  {
    question: "Kelambu berguna untuk ...",
    options: ["Menangkap ikan", "Melindungi saat tidur dari gigitan nyamuk", "Membuat air bersih", "Menambah cahaya"],
    answer: 1,
    explanation: "Kelambu membantu mengurangi risiko gigitan nyamuk saat tidur.",
  },
  {
    question: "Kalau ada air yang tergenang di sekitar rumah, sebaiknya kita ...",
    options: ["Biarkan saja", "Buang atau kuras", "Tambahkan daun", "Tutup dengan kain basah"],
    answer: 1,
    explanation: "Air tergenang adalah tempat favorit nyamuk untuk berkembang biak.",
  },
  {
    question: "Kebersihan lingkungan penting karena ...",
    options: ["Bikin rumah lebih ramai", "Mengurangi tempat nyamuk berkembang biak", "Membuat nyamuk tambah banyak", "Tidak ada pengaruh"],
    answer: 1,
    explanation: "Lingkungan bersih membuat nyamuk lebih sulit berkembang.",
  },
  {
    question: "Pakai lotion anti-nyamuk termasuk tindakan ...",
    options: ["Pencegahan", "Penularan", "Penyimpanan", "Pembiakan"],
    answer: 0,
    explanation: "Itu salah satu langkah pencegahan agar tidak mudah digigit nyamuk.",
  },
  {
    question: "Kalau tubuh demam tinggi dan lemas, sebaiknya ...",
    options: ["Pura-pura tidak sakit", "Tetap minum cukup dan segera periksa ke tenaga kesehatan", "Lari-lari", "Makan es sebanyak-banyaknya"],
    answer: 1,
    explanation: "Gejala seperti demam perlu diperhatikan dan diperiksa oleh tenaga kesehatan.",
  },
  {
    question: "Tujuan utama pencegahan DBD adalah ...",
    options: ["Membuat nyamuk makin banyak", "Melindungi keluarga dan lingkungan", "Mengurangi kebersihan", "Menambah genangan air"],
    answer: 1,
    explanation: "Pencegahan DBD dilakukan agar keluarga dan lingkungan tetap aman.",
  },
];

const state = {
  activeMenu: null,
  quizIndex: 0,
  quizScore: 0,
  quizLocked: false,
  quizHasAnswered: false,
};

const overlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalPanel = document.getElementById("modalPanel");

document.querySelectorAll("[data-menu]").forEach((button) => {
  button.addEventListener("click", () => openMenu(button.dataset.menu));
});

document.querySelector("[data-close-modal]").addEventListener("click", closeMenu);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) {
    closeMenu();
  }
});

function openMenu(menuKey) {
  state.activeMenu = menuKey;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  renderMenu(menuKey);
  requestAnimationFrame(() => {
    modalPanel.scrollTop = 0;
  });
}

function closeMenu() {
  overlay.hidden = true;
  document.body.style.overflow = "";
  modalBody.innerHTML = "";
  state.activeMenu = null;
}

function renderMenu(menuKey) {
  if (menuKey === "lab") {
    modalBody.innerHTML = renderLabMenu();
    return;
  }

  if (menuKey === "quiz") {
    resetQuiz();
    renderQuiz();
    return;
  }

  if (menuKey === "book") {
    modalBody.innerHTML = renderBookMenu();
    return;
  }

  if (menuKey === "about") {
    modalBody.innerHTML = renderAboutMenu();
    return;
  }

  modalBody.innerHTML = `
    <h2 class="section-title" id="modalTitle">Menu tidak ditemukan</h2>
    <div class="white-card">
      <p>Menu yang dipilih belum tersedia.</p>
    </div>
  `;
}

function renderLabMenu() {
  const videoMarkup = getVideoMarkup();

  return `
    <section class="content-grid">
      <div>
        <h2 class="section-title" id="modalTitle">Laboratorium Nyamuk</h2>
        <p class="section-subtitle">
          Menu ini bisa dipakai untuk menampilkan video edukasi dari YouTube atau video lokal dari folder <code>assets</code>.
        </p>
      </div>

      <div class="video-frame">
        ${videoMarkup}
      </div>

      <div class="white-card">
        <h3>Catatan</h3>
        <p>
          Isi video bisa diganti kapan saja lewat konstanta <strong>LAB_VIDEO_URL</strong> atau
          <strong>LOCAL_VIDEO_SRC</strong> di <code>app.js</code>.
        </p>
      </div>
    </section>
  `;
}

function getVideoMarkup() {
  if (LAB_VIDEO_URL.trim()) {
    const embedUrl = toYouTubeEmbedUrl(LAB_VIDEO_URL.trim());
    if (embedUrl) {
      return `
        <iframe
          src="${embedUrl}"
          title="Video Laboratorium Nyamuk"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      `;
    }
  }

  return `
    <video controls playsinline preload="metadata">
      <source src="${LOCAL_VIDEO_SRC}" type="video/mp4" />
    </video>
  `;
}

function toYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    return "";
  } catch {
    return "";
  }
}

function renderBookMenu() {
  return `
    <section class="content-grid">
      <div>
        <h2 class="section-title" id="modalTitle">Buku Saku</h2>
        <p class="section-subtitle">
          Ringkasan singkat yang ramah anak tentang DBD dan cara pencegahannya.
        </p>
      </div>

      <div class="info-columns">
        <article class="white-card">
          <h3>Apa itu DBD?</h3>
          <p>
            DBD adalah penyakit yang disebabkan oleh virus dan ditularkan melalui gigitan nyamuk tertentu.
            Karena itu, lingkungan yang bersih dan bebas genangan air sangat penting.
          </p>
        </article>

        <article class="white-card">
          <h3>Tanda yang perlu diwaspadai</h3>
          <ul>
            <li>Demam tinggi</li>
            <li>Badan lemas</li>
            <li>Sakit kepala atau nyeri tubuh</li>
            <li>Perlu segera diperiksa tenaga kesehatan</li>
          </ul>
        </article>

        <article class="white-card">
          <h3>3M Plus</h3>
          <ul>
            <li>Menguras tempat air</li>
            <li>Menutup rapat penampungan air</li>
            <li>Mendaur ulang atau membuang barang bekas</li>
            <li>Plus: pakai kelambu, lotion anti-nyamuk, dan jaga kebersihan</li>
          </ul>
        </article>

        <article class="white-card">
          <h3>Kebiasaan baik</h3>
          <p>
            Rajin cek halaman rumah, buang sampah dengan benar, dan pastikan tidak ada air tergenang.
          </p>
        </article>
      </div>
    </section>
  `;
}

function renderAboutMenu() {
  return `
    <section class="content-grid">
      <div>
        <h2 class="section-title" id="modalTitle">Tentang</h2>
        <p class="section-subtitle">
          DBD Defender dibuat sebagai media edukasi interaktif untuk anak-anak agar lebih mudah memahami bahaya DBD dan cara mencegahnya.
        </p>
      </div>

      <div class="white-card">
        <h3>Tujuan aplikasi</h3>
        <ul>
          <li>Memperkenalkan bahaya DBD dengan visual yang menarik</li>
          <li>Membantu anak-anak belajar lewat video, bacaan, dan quiz</li>
          <li>Mendorong kebiasaan hidup bersih di rumah dan lingkungan</li>
        </ul>
      </div>

      <div class="white-card">
        <h3>Struktur menu</h3>
        <ul>
          <li><strong>Laboratorium Nyamuk</strong> — video edukasi</li>
          <li><strong>Ujian Agen</strong> — 10 soal quiz interaktif</li>
          <li><strong>Buku Saku</strong> — informasi ringkas</li>
          <li><strong>Tentang</strong> — penjelasan aplikasi</li>
        </ul>
      </div>
    </section>
  `;
}

function resetQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizLocked = false;
  state.quizHasAnswered = false;
}

function renderQuiz() {
  const current = quizQuestions[state.quizIndex];

  if (!current) {
    renderQuizSummary();
    return;
  }

  modalBody.innerHTML = `
    <section class="content-grid">
      <div>
        <h2 class="section-title" id="modalTitle">Ujian Agen</h2>
        <p class="section-subtitle">
          Jawab 10 soal. Setelah memilih jawaban, kamu langsung tahu benar atau salah. Di akhir akan muncul total skor.
        </p>
      </div>

      <div class="quiz-card">
        <div class="quiz-meta">
          <span class="pill">Soal ${state.quizIndex + 1} dari ${quizQuestions.length}</span>
          <span class="pill">Benar: ${state.quizScore}</span>
        </div>

        <h3 class="quiz-question">${current.question}</h3>

        <div class="quiz-options" id="quizOptions">
          ${current.options
            .map(
              (option, index) => `
                <button
                  type="button"
                  class="quiz-option"
                  data-answer-index="${index}"
                  ${state.quizLocked ? "disabled" : ""}
                >
                  ${String.fromCharCode(65 + index)}. ${option}
                </button>
              `
            )
            .join("")}
        </div>

        <div class="quiz-feedback" id="quizFeedback">
          Pilih satu jawaban untuk melihat hasilnya.
        </div>

        <div class="quiz-actions">
          <button type="button" class="action-button secondary" data-quiz-back ${state.quizIndex === 0 ? "disabled" : ""}>
            Kembali
          </button>
          <button type="button" class="action-button" data-quiz-next hidden>
            Lanjut
          </button>
        </div>
      </div>
    </section>
  `;

  const optionButtons = modalBody.querySelectorAll(".quiz-option");
  const feedback = modalBody.querySelector("#quizFeedback");
  const nextButton = modalBody.querySelector("[data-quiz-next]");
  const backButton = modalBody.querySelector("[data-quiz-back]");

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => handleQuizAnswer(Number(button.dataset.answerIndex), optionButtons, feedback, nextButton));
  });

  nextButton.addEventListener("click", () => {
    state.quizIndex += 1;
    state.quizLocked = false;
    state.quizHasAnswered = false;
    renderQuiz();
  });

  backButton.addEventListener("click", () => {
    if (state.quizIndex === 0) return;
    state.quizIndex -= 1;
    state.quizLocked = false;
    state.quizHasAnswered = false;
    renderQuiz();
  });
}

function handleQuizAnswer(selectedIndex, optionButtons, feedback, nextButton) {
  if (state.quizLocked) return;

  const current = quizQuestions[state.quizIndex];
  const isCorrect = selectedIndex === current.answer;

  state.quizLocked = true;
  state.quizHasAnswered = true;

  if (isCorrect) {
    state.quizScore += 1;
  }

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === current.answer) {
      button.classList.add("is-correct");
    }

    if (index === selectedIndex && !isCorrect) {
      button.classList.add("is-wrong");
    }
  });

  feedback.innerHTML = `
    <strong>${isCorrect ? "Benar!" : "Salah."}</strong> ${current.explanation}
  `;

  nextButton.hidden = false;
  nextButton.textContent = state.quizIndex === quizQuestions.length - 1 ? "Lihat Hasil" : "Lanjut";
  nextButton.focus();
}

function renderQuizSummary() {
  const wrong = quizQuestions.length - state.quizScore;

  modalBody.innerHTML = `
    <section class="content-grid">
      <div>
        <h2 class="section-title" id="modalTitle">Hasil Ujian Agen</h2>
        <p class="section-subtitle">
          Selesai menjawab semua soal. Berikut hasil akhirnya.
        </p>
      </div>

      <div class="summary-card">
        <div class="summary-score">${state.quizScore} / ${quizQuestions.length}</div>
        <p class="summary-note">
          Benar: <strong>${state.quizScore}</strong><br />
          Salah: <strong>${wrong}</strong>
        </p>

        <div class="quiz-actions" style="justify-content:center;">
          <button type="button" class="action-button" data-quiz-restart>
            Ulangi Quiz
          </button>
        </div>
      </div>
    </section>
  `;

  modalBody.querySelector("[data-quiz-restart]").addEventListener("click", () => {
    resetQuiz();
    renderQuiz();
  });
}