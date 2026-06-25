(function () {
  const canvas = document.querySelector("[data-zany-hero-stage]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0 };
  const particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetParticles() {
    particles.length = 0;
    const rect = canvas.getBoundingClientRect();
    const count = Math.max(90, Math.floor((rect.width * rect.height) / 13000));

    for (let index = 0; index < count; index += 1) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * Math.min(rect.width, rect.height) * 0.52,
        speed: 0.0008 + Math.random() * 0.0018,
        size: 1 + Math.random() * 2.4,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(time = 0) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width * (0.68 + pointer.x * 0.04);
    const centerY = height * (0.45 + pointer.y * 0.04);

    context.clearRect(0, 0, width, height);

    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.54);
    glow.addColorStop(0, "rgba(215, 255, 63, 0.25)");
    glow.addColorStop(0.42, "rgba(32, 214, 255, 0.11)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(centerX, centerY);
    context.rotate(time * 0.00012 + pointer.x * 0.08);
    context.strokeStyle = "rgba(215, 255, 63, 0.42)";
    context.lineWidth = 1.4;

    for (let ring = 0; ring < 4; ring += 1) {
      context.beginPath();
      context.ellipse(0, 0, 120 + ring * 46, 38 + ring * 15, ring * 0.6, 0, Math.PI * 2);
      context.stroke();
    }

    context.strokeStyle = "rgba(241, 70, 104, 0.36)";
    for (let spoke = 0; spoke < 18; spoke += 1) {
      const angle = (spoke / 18) * Math.PI * 2 + time * 0.00025;
      const inner = 38;
      const outer = 220 + Math.sin(time * 0.002 + spoke) * 28;
      context.beginPath();
      context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      context.stroke();
    }
    context.restore();

    particles.forEach((particle, index) => {
      const angle = particle.angle + time * particle.speed;
      const pulse = Math.sin(time * 0.002 + particle.offset) * 0.5 + 0.5;
      const x = centerX + Math.cos(angle) * particle.radius * (0.75 + pulse * 0.2);
      const y = centerY + Math.sin(angle) * particle.radius * 0.42;
      context.fillStyle = index % 3 === 0 ? "rgba(215, 255, 63, 0.7)" : "rgba(245, 241, 234, 0.56)";
      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
  });

  window.addEventListener("resize", () => {
    resize();
    resetParticles();
  });

  resize();
  resetParticles();
  draw();
})();
