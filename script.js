const book = document.getElementById("book");
const heartBtn = document.getElementById("heartBtn");
const loveSong = document.getElementById("loveSong");
const heartsContainer = document.getElementById("hearts");
const carousel = document.querySelector(".memory-carousel");
const carouselButtons = document.querySelectorAll(".carousel-btn");
const pages = document.querySelectorAll(".memory-page");
const pageIndexLabel = document.getElementById("pageIndex");
const pageTotalLabel = document.getElementById("pageTotal");

let isOpening = false;

function openCard() {
  if (book.classList.contains("open") || isOpening) {
    return;
  }

  isOpening = true;
  book.classList.add("unlocking");

  setTimeout(() => {
    book.classList.remove("unlocking");
    book.classList.add("open");

    isOpening = false;
  }, 700);
}

function explodeHearts(x, y, burst = 18) {
  for (let i = 0; i < burst; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-burst";
    heart.textContent = ["💖", "💗", "💕", "💘", "💞"][Math.floor(Math.random() * 5)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--tx", `${Math.random() * 180 - 90}px`);
    heart.style.setProperty("--ty", `${Math.random() * 180 - 90}px`);
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 1400);
  }
}

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = ["💖", "💗", "💕", "💘", "💞"][Math.floor(Math.random() * 5)];
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${4 + Math.random() * 4}s`;
  heart.style.fontSize = `${14 + Math.random() * 20}px`;
  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 9000);
}

function heartRain(burst = 25) {
  for (let i = 0; i < burst; i += 1) {
    setTimeout(createHeart, i * 120);
  }
}

heartBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  openCard();
  explodeHearts(event.clientX, event.clientY);
  if (loveSong) {
    loveSong.currentTime = 0;
    loveSong.play().catch(() => {});
  }
});

setInterval(createHeart, 700);

let currentPage = 0;

function updateControls() {
  if (!pageIndexLabel || !pageTotalLabel) {
    return;
  }
  pageIndexLabel.textContent = String(currentPage + 1);
  pageTotalLabel.textContent = String(pages.length);
  carouselButtons.forEach((button) => {
    const dir = button.dataset.dir;
    const isPrev = dir === "prev";
    button.disabled =
      (isPrev && currentPage === 0) ||
      (!isPrev && currentPage === pages.length - 1);
  });
}

function goToPage(nextIndex, direction) {
  if (!carousel || nextIndex === currentPage) {
    return;
  }
  if (nextIndex < 0 || nextIndex >= pages.length) {
    return;
  }

  const outgoing = pages[currentPage];
  const incoming = pages[nextIndex];

  outgoing.classList.remove("turn-in-next", "turn-in-prev");
  incoming.classList.add("is-active");

  if (direction === "next") {
    outgoing.classList.add("turn-out-next");
    incoming.classList.add("turn-in-next");
  } else {
    outgoing.classList.add("turn-out-prev");
    incoming.classList.add("turn-in-prev");
  }

  setTimeout(() => {
    outgoing.classList.remove("is-active", "turn-out-next", "turn-out-prev");
    incoming.classList.remove("turn-in-next", "turn-in-prev");
  }, 620);

  currentPage = nextIndex;
  updateControls();
}

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dir = button.dataset.dir;
    const nextIndex = dir === "next" ? currentPage + 1 : currentPage - 1;
    goToPage(nextIndex, dir);
  });
});

if (pages.length > 0) {
  pages.forEach((page) => page.classList.remove("is-active"));
  pages[0].classList.add("is-active");
  updateControls();
}

const canvas = document.getElementById("sparkles");
const ctx = canvas.getContext("2d");

let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars(count = 90) {
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.7,
    o: 0.2 + Math.random() * 0.8,
    s: Math.random() * 0.02 + 0.003,
  }));
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.o += star.s;
    if (star.o >= 1 || star.o <= 0.15) {
      star.s *= -1;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 230, 245, ${star.o})`;
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initStars();
});

resizeCanvas();
initStars();
animateStars();
