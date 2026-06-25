const tracks = [
  {
    title: "Numbe Ras",
    tag: "Collab",
    category: ["collab", "popular"],
    copy: "Zany Inzane and Dilo official music video from the Zany Inzane channel.",
    image: "https://i.ytimg.com/vi/uEQanSjqJVk/hqdefault.jpg",
    href: "https://www.youtube.com/watch?v=uEQanSjqJVk",
    cta: "Play video",
    colors: ["rgba(215, 255, 63, 0.34)", "rgba(32, 214, 255, 0.28)"],
  },
  {
    title: "Rawatavi As",
    tag: "Solo",
    category: ["solo", "popular"],
    copy: "Official music video of Zany Inzane performing Rawatavi As.",
    image: "https://i.ytimg.com/vi/YpL0Huqj0fc/hqdefault.jpg",
    href: "https://www.youtube.com/watch?v=YpL0Huqj0fc",
    cta: "Play video",
    colors: ["rgba(241, 70, 104, 0.32)", "rgba(255, 189, 56, 0.26)"],
  },
  {
    title: "Thiyariya",
    tag: "Collab",
    category: ["collab", "popular"],
    copy: "Zany Inzane with Leo Leopard and Pridy Boy in an official music video.",
    image: "https://i.ytimg.com/vi/Gqx8DSZhLw0/hqdefault.jpg",
    href: "https://www.youtube.com/watch?v=Gqx8DSZhLw0",
    cta: "Play video",
    colors: ["rgba(32, 214, 255, 0.32)", "rgba(241, 70, 104, 0.24)"],
  },
  {
    title: "Madira",
    tag: "Collab",
    category: ["collab"],
    copy: "Zany Inzane and Shushii official music video from the channel catalog.",
    image: "https://i.ytimg.com/vi/EdnNo_objic/hqdefault.jpg",
    href: "https://www.youtube.com/watch?v=EdnNo_objic",
    cta: "Play video",
    colors: ["rgba(255, 189, 56, 0.34)", "rgba(32, 214, 255, 0.22)"],
  },
  {
    title: "Pubudu",
    tag: "Solo",
    category: ["solo"],
    copy: "Official Zany Inzane upload from the artist's YouTube channel.",
    image: "https://i.ytimg.com/vi/C3yWTuOKlrg/hqdefault.jpg",
    href: "https://www.youtube.com/watch?v=C3yWTuOKlrg",
    cta: "Play video",
    colors: ["rgba(215, 255, 63, 0.28)", "rgba(241, 70, 104, 0.3)"],
  },
  {
    title: "Dhoomakethu",
    tag: "Solo",
    category: ["solo"],
    copy: "Solo music video from the official Zany Inzane YouTube channel.",
    image: "https://i.ytimg.com/vi/ktQzSj0RgqQ/hqdefault.jpg",
    href: "https://www.youtube.com/watch?v=ktQzSj0RgqQ",
    cta: "Play video",
    colors: ["rgba(32, 214, 255, 0.26)", "rgba(215, 255, 63, 0.22)"],
  },
];

function renderTracks(filter = "all") {
  const grid = document.querySelector("#track-grid");
  const visibleTracks = tracks.filter((track) => filter === "all" || track.category.includes(filter));

  grid.innerHTML = visibleTracks
    .map(
      (track) => `
        <article class="track-card" data-category="${track.category.join(" ")}">
          ${
            track.image
              ? `<img src="${track.image}" alt="${track.title} thumbnail" />`
              : `<div class="track-art" style="--art-a: ${track.colors[0]}; --art-b: ${track.colors[1]}">
                  <span>${track.tag}</span>
                  <strong>${track.title}</strong>
                </div>`
          }
          <div>
            <span>${track.tag}</span>
            <h3>${track.title}</h3>
            <p>${track.copy}</p>
            <a href="${track.href}" target="_blank" rel="noreferrer">${track.cta}</a>
          </div>
        </article>
      `,
    )
    .join("");

  requestAnimationFrame(() => {
    document.querySelectorAll(".track-card").forEach((card, index) => {
      window.setTimeout(() => card.classList.add("is-visible"), index * 85);
    });
    bindAnimatedButtons();
  });
}

function addRipple(element, event) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.7;
  const ripple = document.createElement("span");
  ripple.className = "button-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  element.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 680);
}

function bindAnimatedButtons() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const selector = [".nav-links a", ".header-button", ".button", ".filter", ".social-row a", ".track-card a"].join(",");

  document.querySelectorAll(selector).forEach((element) => {
    if (element.dataset.motionReady === "true") return;
    element.dataset.motionReady = "true";
    element.classList.add("animated-button");

    element.addEventListener("pointermove", (event) => {
      if (reduceMotion) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--move-x", `${x * 8}px`);
      element.style.setProperty("--move-y", `${y * 6}px`);
      element.style.setProperty("--tilt-x", `${y * -5}deg`);
      element.style.setProperty("--tilt-y", `${x * 7}deg`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--move-x", "0px");
      element.style.setProperty("--move-y", "0px");
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.classList.remove("is-pressing");
    });

    element.addEventListener("pointerdown", (event) => {
      element.classList.add("is-pressing");
      if (!reduceMotion) addRipple(element, event);
    });

    element.addEventListener("pointerup", () => {
      element.classList.remove("is-pressing");
    });
  });
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTracks(button.dataset.filter);
  });
});

renderTracks();
bindAnimatedButtons();
