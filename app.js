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
          Dibawah ini ada video edukasi bagaimana nyamuk dapat berkembang biak (siklus hidup nyamuk).
        </p>
      </div>

      <div class="video-frame">
        ${videoMarkup}
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
        <h2 class="section-title" id="modalTitle">Misi Agen Anti Nyamuk</h2>
        <p class="section-subtitle">
          Buku saku ini berisi penjelasan singkat tentang Demam Berdarah, nyamuk Aedes aegypti, dan cara pencegahannya.
        </p>
      </div>

      <div class="white-card">
        <h3>Demam Berdarah</h3>
        <p>
          Demam Berdarah adalah penyakit berbahaya yang dapat menyerang siapa saja, terutama anak-anak.
          Penyakit ini ditularkan melalui gigitan nyamuk Aedes aegypti yang sering hidup di sekitar lingkungan rumah.
          Nyamuk ini memiliki ciri khas berwarna hitam dengan garis putih dan biasanya aktif menggigit manusia pada pagi dan sore hari.
          Oleh karena itu, kita harus selalu waspada dan menjaga kebersihan lingkungan setiap hari.
        </p>

        <p>
          Nyamuk Aedes aegypti berkembang biak di tempat yang sering tidak kita sadari, yaitu genangan air bersih.
          Banyak orang mengira nyamuk hanya hidup di air kotor, padahal nyamuk ini justru menyukai air yang bersih dan tenang.
          Contohnya adalah air di bak mandi, ember, kaleng bekas, botol, dan bahkan ban bekas yang menampung air hujan.
          Jika tempat-tempat ini tidak dibersihkan secara rutin, maka akan menjadi sarang nyamuk yang berbahaya.
        </p>

        <p>
          Di dalam air tersebut, nyamuk akan bertelur dan menghasilkan jentik.
          Jentik adalah tahap awal kehidupan nyamuk yang hidup di dalam air dan bergerak-gerak kecil.
          Meskipun ukurannya sangat kecil, jentik akan berkembang menjadi nyamuk dewasa yang siap menggigit manusia dan menyebarkan penyakit.
          Oleh karena itu, jika kita menemukan jentik di dalam air, itu adalah tanda bahwa tempat tersebut sudah menjadi sarang nyamuk dan harus segera dibersihkan.
        </p>
      </div>

      <div class="white-card">
        <h3>Cara Pencegahan</h3>
        <ul>
          <li>Menguras tempat penampungan air secara rutin</li>
          <li>Menutup rapat bak mandi, ember, dan wadah air</li>
          <li>Mendaur ulang atau membuang barang bekas yang dapat menampung air</li>
          <li>Menjaga kebersihan lingkungan rumah setiap hari</li>
          <li>Memakai kelambu atau lotion anti-nyamuk bila diperlukan</li>
        </ul>
      </div>
    </section>
  `;
}

function renderAboutMenu() {
  return `
    <section class="content-grid">
      <div>
        <h2 class="section-title" id="modalTitle">DBD Defender</h2>
        <p class="section-subtitle">
          Teman Digital Anak untuk Belajar dan Melindungi Diri dari Demam Berdarah
        </p>
      </div>

      <div class="white-card">
        <p>
          DBD Defender adalah website edukasi multimedia interaktif yang dirancang untuk membantu anak-anak memahami bahaya Demam Berdarah serta cara pencegahannya.
          Melalui pendekatan yang menyenangkan dan interaktif, website ini mengajak anak untuk belajar mengenali lingkungan sekitar, memahami risiko, serta melakukan tindakan sederhana untuk menjaga kesehatan.
        </p>

        <p>
          Website ini bertujuan untuk meningkatkan literasi kesehatan anak, khususnya dalam pencegahan Demam Berdarah, sehingga anak dapat lebih sadar, peduli, dan mampu melindungi diri serta lingkungannya sejak dini.
          Program ini dikembangkan dengan fokus implementasi di Desa Muntang, Kabupaten Purbalingga, sebagai bagian dari upaya edukasi berbasis masyarakat.
        </p>
      </div>

      <div class="white-card">
        <h3>Tim Pengembang</h3>
        <ul>
          <li>Ketua Tim: Dimas Bagus Firmansyah (2311102002)</li>
          <li>Anggota 1: Ahmadan Syaridin (231102038)</li>
          <li>Anggota 2: Mochamad Dafa Irkham Maulana (2311102103)</li>
          <li>Anggota 3: Muhamad Nasrulloh (2311102044)</li>
          <li>Anggota 4: Asa Putra Pratama (2211102092)</li>
          <li>Dosen Pembimbing: Aminatus Sa'adah, S.Si., M.Si.</li>
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
          Kerjakan 10 soal untuk menguji pemahamanmu tentang DBD.  
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
          Pilih satu jawaban diatas untuk melihat hasilnya.
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