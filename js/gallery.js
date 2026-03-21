import { galleryImages } from "./config.js";

const galleryGrid = document.querySelector(".gallery-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const btnClose = lightbox.querySelector(".lightbox-close");
const btnPrev = lightbox.querySelector(".lightbox-prev");
const btnNext = lightbox.querySelector(".lightbox-next");

let currentIndex = 0;

// ---- Build gallery grid ----
galleryImages.forEach((img, i) => {
  const item = document.createElement("div");
  item.className = "gallery-item fade-in";

  const imgEl = document.createElement("img");
  imgEl.src = img.small || img.src;
  imgEl.alt = img.alt;
  imgEl.loading = "lazy";
  imgEl.decoding = "async";

  item.appendChild(imgEl);
  item.addEventListener("click", () => openLightbox(i));
  galleryGrid.appendChild(item);
});

// ---- Lightbox ----
function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.remove("hidden");
  lightbox.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("visible");
  lightbox.classList.add("hidden");
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  const img = galleryImages[currentIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
}

btnClose.addEventListener("click", closeLightbox);
btnPrev.addEventListener("click", () => navigate(-1));
btnNext.addEventListener("click", () => navigate(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("visible")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navigate(-1);
  if (e.key === "ArrowRight") navigate(1);
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});

lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    navigate(dx > 0 ? -1 : 1);
  }
});

// ---- Fade-in observer for gallery items ----
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".gallery-item.fade-in").forEach((el) => observer.observe(el));
