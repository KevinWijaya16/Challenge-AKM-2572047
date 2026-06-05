AOS.init({ once: true });

// ==========================================
// 1. LOGIKA KALKULATOR BIAYA AWS LAMBDA
// ==========================================
function hitungBiaya() {
const requests =
    parseFloat(document.getElementById("input-requests").value) || 0;
const durationMs =
    parseFloat(document.getElementById("input-duration").value) || 0;
const memoryMb =
    parseFloat(document.getElementById("input-memory").value) || 0;

const COST_PER_MILLION_REQUESTS = 0.2;
const COST_PER_GB_SECOND = 0.0000166667;

const requestCost = (requests / 1000000) * COST_PER_MILLION_REQUESTS;
const durationSec = durationMs / 1000;
const memoryGb = memoryMb / 1024;
const totalGbSec = requests * durationSec * memoryGb;
const durationCost = totalGbSec * COST_PER_GB_SECOND;
const totalCost = requestCost + durationCost;

const resultCard = document.getElementById("calc-result-card");
resultCard.classList.add("border-amber-500", "scale-[1.01]");
setTimeout(() => {
    resultCard.classList.remove("border-amber-500", "scale-[1.01]");
}, 300);

document.getElementById("res-requests").innerText =
    requests.toLocaleString("id-ID");
document.getElementById("res-gbsec").innerText =
    totalGbSec.toLocaleString("id-ID", { maximumFractionDigits: 2 }) +
    " GB-s";
document.getElementById("res-total").innerText = totalCost.toFixed(2);
}

window.onload = function () {
hitungBiaya();
loadQuestion();
};

// ==========================================
// 2. LOGIKA KUIS DENGAN FITUR BENAR / SALAH REALTIME
// ==========================================
const quizData = [
{
    question:
    "Manakah dari pernyataan berikut yang paling tepat menggambarkan AWS Lambda?",
    options: [
    "Layanan penyimpanan cloud database terdistribusi.",
    "Layanan compute serverless berbasis event yang mengeksekusi kode tanpa mengelola server.",
    "Layanan jaringan virtual untuk menghubungkan VPC lokal ke internet.",
    "Perangkat keras fisik yang disewa pengguna dari data center Amazon.",
    ],
    answer: 1,
},
{
    question:
    "Komponen apa saja yang digunakan AWS Lambda untuk menentukan komponen biaya durasi eksekusi?",
    options: [
    "Jumlah baris kode dan ukuran storage yang diunggah.",
    "Sistem operasi yang dipilih serta tipe processor (Intel / AMD).",
    "Jumlah memori (RAM) yang dialokasikan dan waktu berjalan kode dalam milidetik.",
    "Jumlah traffic bandwidth inbound dan outbound data transfer.",
    ],
    answer: 2,
},
{
    question:
    "Kapan AWS Lambda akan mengenakan biaya komputasi kepada Anda?",
    options: [
    "Setiap jam selama fungsi Anda tetap aktif di dashboard AWS.",
    "Hanya ketika ada event yang memicu pemanggilan dan pengeksekusian kode Anda.",
    "Biaya flat bulanan tidak peduli kode dipanggil atau tidak.",
    "Hanya ketika developer melakukan login ke konsol manajemen AWS.",
    ],
    answer: 1,
},
{
    question:
    "Apa yang dimaksud dengan konsep Event-Driven pada AWS Lambda?",
    options:[
        "Fungsi berjalan terus-menerus selama 24 jam tanpa berhenti.",
        "Fungsi hanya berjalan secara terjadwal setiap akhir bulan.",
        "Fungsi berjalan otomatis merespons pemicu (event) dari layanan AWS lain.",
        "Fungsi hanya bisa dipicu secara manual oleh administrator utama.",
    ],
    answer: 2,
},
{
    question:
    "Bagaimana sistem pembayaran (Pay As You Go) yang diterapkan oleh AWS Lambda?",
    options:[
        "Pengguna membayar biaya sewa flat yang sama setiap bulannya.",
        "Pengguna membayar berdasarkan jumlah pemicuan dan durasi eksekusi kode dalam hitungan milidetik.",
        "Biaya dihitung berdasarkan kapasitas penyimpanan SSD yang digunakan server.",
        "Biaya dihitung dari jumlah baris kode yang diunggah oleh pengguna.",
    ],
    answer: 1,
},
{
    question:
    "Pada langkah ke-2 dalam alur kerja Lambda (Atur Hak Akses), komponen apa yang digunakan untuk mengontrol secara ketat layanan AWS yang boleh berinteraksi dengan fungsi Anda?",
    options:[
        "API Gateway",
        "Runtime Environment",
        "Lambda Layers",
        "Peran IAM Eksekusi",
    ],
    answer: 3,
},
{
    question:
    "AWS Lambda merupakan salah satu layanan dari Amazon Web Services yang bergerak di bidang komputasi. Layanan ini berbasis?",
    options:[
        "Serverless",
        "Virtual Machine",
        "Container Orchestration",
        "Dedicated Hosting",
    ],
    answer: 0,
},
{
    question: 
    "Apa fungsi utama dari komponen Handler di dalam kodingan AWS Lambda?",
    options:[
        "Sebagai tempat menyimpan pustaka (library) eksternal.",
        "Sebagai titik masuk (entry point) untuk objek peristiwa yang diproses oleh kode fungsi.",
        "Sebagai alat untuk memantau penggunaan RAM secara real-time.",
        "Sebagai pembuat alamat URL publik agar fungsi bisa diakses dari luar.",
    ],
    answer: 1,
},
{
    question:
    "Di dalam kurikulum AWS Academy Cloud Foundations, materi mengenai konsep komputasi serverless dan AWS Lambda ini dipelajari pada modul berapa?",
    options:[
        "Modul 3: AWS Global Infrastructure",
        "Modul 4: AWS Cloud Security",
        "Modul 6: Cloud Compute",
        "Modul 7: Cloud Storage",
    ],
    answer: 2,
},
{
    question:
    "Sebuah aplikasi startup e-commerce yang baru rilis menggunakan AWS Lambda untuk memproses transaksi. Diperkirakan dalam satu bulan aplikasi tersebut akan menerima 1.000.000 (1 juta) Request, dengan durasi eksekusi rata-rata kode adalah 500 ms, dan alokasi memori sebesar 512 MB. Buka kalkulator simulasi AWS Lambda Anda, masukkan angka-angka di atas, lalu tentukan berapa estimasi total biaya bulanan yang harus dibayar oleh startup tersebut tanpa memperhitungkan AWS Free Tier!",
    options:[
        "$ 4.37",
        "$ 0.0617",
        "$ 0.617",
        "$ 6.17",
    ],
    answer: 0,
}
];

// 1. Inisialisasi Variabel: Ambil dari localStorage JIKA ADA, jika tidak ada (baru pertama buka/reset) set ke 0
let currentQuestionIndex = parseInt(localStorage.getItem("quiz_current_index")) || 0;
let score = parseInt(localStorage.getItem("quiz_score")) || 0;
let hasAnswered = false; // Mencegah user klik opsi lain setelah terkunci

function loadQuestion() {
    // A. Simpan progres terbaru ke localStorage setiap kali soal baru dimuat
    localStorage.setItem("quiz_current_index", currentQuestionIndex);
    localStorage.setItem("quiz_score", score);

    hasAnswered = false;
    document.getElementById("btn-next").disabled = true;

    // Sembunyikan badge feedback di atas
    const feedbackBadge = document.getElementById("quiz-feedback-badge");
    feedbackBadge.className = "hidden";

    const quizBox = document.getElementById("quiz-box");
    quizBox.classList.add("opacity-0");

    setTimeout(() => {
        const currentQuiz = quizData[currentQuestionIndex];

        const progressPercent =
            ((currentQuestionIndex + 1) / quizData.length) * 100;
        document.getElementById("quiz-progress").style.width =
            `${progressPercent}%`;
        document.getElementById("quiz-number").innerText =
            `Pertanyaan ${currentQuestionIndex + 1} dari ${quizData.length}`;
        document.getElementById("quiz-question").innerText =
            currentQuiz.question;

        const optionsContainer = document.getElementById("quiz-options");
        optionsContainer.innerHTML = "";

        currentQuiz.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.className =
                "w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 transition-all duration-200 flex items-center justify-between font-medium group text-sm md:text-base transform hover:translate-x-1";
            button.innerHTML = `
                    <span>${option}</span>
                    <i class="far fa-circle text-slate-300 group-hover:text-indigo-400 transition-transform duration-200"></i>
                `;
            button.onclick = () => verifikasiJawaban(index, button);
            optionsContainer.appendChild(button);
        });

        quizBox.classList.remove("opacity-0");
    }, 250);
}

function verifikasiJawaban(selectedIndex, selectedButton) {
    if (hasAnswered) return; // Kunci jawaban jika sudah pernah diklik
    hasAnswered = true;

    const correctAnswerIndex = quizData[currentQuestionIndex].answer;
    const buttons = document.getElementById("quiz-options").children;
    const feedbackBadge = document.getElementById("quiz-feedback-badge");

    // 1. Jika JAWABAN BENAR
    if (selectedIndex === correctAnswerIndex) {
        score += 1;
        selectedButton.className =
            "w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-blue-100 font-bold flex items-center justify-between text-sm md:text-base transform scale-[1.01] transition-all";
        selectedButton.querySelector("i").className =
            "fas fa-check-circle text-emerald-600 scale-110";

        // Set badge atas jadi BENAR
        feedbackBadge.className =
            "inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800 animate-pulse";
        feedbackBadge.innerText = "Benar! 🎉";
    }
    // 2. Jika JAWABAN SALAH
    else {
        selectedButton.className =
            "w-full text-left p-4 rounded-xl border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold flex items-center justify-between text-sm md:text-base transition-all";
        selectedButton.querySelector("i").className =
            "fas fa-times-circle text-rose-600 scale-110";

        // Cari tombol jawaban yang seharusnya benar, lalu beri highlight hijau
        buttons[correctAnswerIndex].className =
            "w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold flex items-center justify-between text-sm md:text-base transition-all";
        buttons[correctAnswerIndex].querySelector("i").className =
            "fas fa-check-circle text-emerald-600";

        // Set badge atas jadi SALAH
        feedbackBadge.className =
            "inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-rose-100 text-rose-800";
        feedbackBadge.innerText = "Salah ❌";
    }

    // Nonaktifkan efek hover pada seluruh tombol setelah terjawab agar bersih
    for (let btn of buttons) {
        btn.classList.remove(
            "hover:bg-slate-50",
            "hover:border-indigo-300",
            "hover:translate-x-1",
        );
    }

    // Aktifkan tombol Lanjut
    document.getElementById("btn-next").disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        // B. Hapus progres dari localStorage saat kuis selesai
        localStorage.removeItem("quiz_current_index");
        localStorage.removeItem("quiz_score");
        showResult();
    }
}

function showResult() {
    // Sembunyikan box kuis dan progress bar atas
    document.getElementById("quiz-box").classList.add("hidden");
    document
        .getElementById("quiz-progress-container")
        .classList.add("hidden");

    const resultBox = document.getElementById("result-box");
    resultBox.classList.remove("hidden");

    // 1. Hitung Detail Metrik Skor Berdasarkan Jawaban
    const totalQuestions = quizData.length;
    const finalScore = Math.round((score / totalQuestions) * 100);
    const wrongAnswers = totalQuestions - score;
    const accuracyPercent = Math.round((score / totalQuestions) * 100);

    // 2. Tentukan Predikat Gelar Berdasarkan Skor
    let badgeTitle = "Cloud Novice ☕";
    if (finalScore === 100) badgeTitle = "AWS Lambda Master 👑";
    else if (finalScore >= 60) badgeTitle = "Serverless Architect ⚡";

    // 3. Masukkan Data ke UI Elemen secara Tepat
    document.getElementById("quiz-score").innerText = finalScore;
    document.getElementById("result-badge-text").innerText = badgeTitle;

    // MEMASTIKAN ELEMEN ANALITIK TERISI DATA RIIL
    document.getElementById("stat-correct").innerText = score;
    document.getElementById("stat-wrong").innerText = wrongAnswers;
    document.getElementById("stat-accuracy").innerText =
        `${accuracyPercent}%`;

    // 4. Memicu Animasi Pengisian Cincin Sirkular SVG (Keliling = 440)
    const ringElement = document.getElementById("result-stroke-ring");
    const strokeDashoffsetValue = 440 - (440 * finalScore) / 100;

    // Ubah warna cincin ring mengikuti kesuksesan nilai skor
    if (finalScore === 100) {
        ringElement.style.stroke = "#10b981"; // Emerald / Hijau
    } else if (finalScore >= 60) {
        ringElement.style.stroke = "#4f46e5"; // Indigo / Ungu
    } else {
        ringElement.style.stroke = "#f43f5e"; // Rose / Merah
    }

    // Jalankan animasi transisi halus kemunculan box & lingkaran
    setTimeout(() => {
        resultBox.classList.remove("opacity-0", "scale-95");
        ringElement.style.strokeDashoffset = strokeDashoffsetValue;
    }, 100);
}

// C. Ubah fungsi resetQuiz untuk membersihkan localStorage
function resetQuiz() {
    // Hapus data kuis dari penyimpanan sirkuit browser
    localStorage.removeItem("quiz_current_index");
    localStorage.removeItem("quiz_score");

    currentQuestionIndex = 0;
    score = 0;

    // Kembalikan tampilan box kuis dan progress bar atas
    document.getElementById("quiz-box").classList.remove("hidden");
    document
        .getElementById("quiz-progress-container")
        .classList.remove("hidden");

    const resultBox = document.getElementById("result-box");
    resultBox.classList.add("hidden", "opacity-0", "scale-95");

    // Reset stroke dashoffset ring SVG kembali ke kosong (440)
    document.getElementById("result-stroke-ring").style.strokeDashoffset =
        440;

    // Muat ulang dari pertanyaan pertama
    loadQuestion();
}

// Menambahkan penangan onload untuk memuat kuis berdasarkan progres
window.onload = function () {
    // Jalankan kalkulator bawaan Anda (asumsi ada fungsi hitungBiaya)
    if (typeof hitungBiaya === "function") {
        hitungBiaya();
    }

    // Jalankan kuis berdasarkan progres terakhir yang tersimpan
    loadQuestion();
};


document.getElementById("year").textContent =
    new Date().getFullYear();



// home
const heroCard = document.getElementById('hero-tilt-card');
        const parallaxElements = document.querySelectorAll('.layer-parallax');

        if (heroCard) {
            window.addEventListener('mousemove', (e) => {
                // 1. LOGIKA ELEMEN 3D SEKITAR (Parallax Effect Berlawanan Arah)
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                const mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
                const mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);

                parallaxElements.forEach(el => {
                    const depth = el.getAttribute('data-depth') || 0.2;
                    // Bergerak ke arah berlawanan dari mouse berdasarkan nilai depth-nya
                    const moveX = mouseX * (depth * -40);
                    const moveY = mouseY * (depth * -40);
                    el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                });      
            });
        }