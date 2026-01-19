const parentElement = document.querySelector(".bubble");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (parentElement && !prefersReducedMotion) {
  const bubbleCount = 71;
  const df = document.createDocumentFragment();
  const keyframes = [
    { opacity: 0, transform: "translate(-25vw, 25vh)" },
    { opacity: 0.5 },
    { opacity: 0 },
    { opacity: 0.5 },
    { opacity: 0 },
    { opacity: 0.5 },
    { opacity: 0, transform: "translate(50vw, -25vh)" },
  ];
  const options = {
    easing: "linear",
    iterations: Infinity,
  };

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    const r = Math.floor(Math.random() * 128) + 64;
    const g = Math.floor(Math.random() * 128) + 64;
    const b = Math.floor(Math.random() * 128) + 64;
    const a = Math.floor(Math.random() * 50) + 25;
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 70001 + 10007;

    const styles = {
      background: `rgba(${r} ${g} ${b} / ${a}%)`,
      borderRadius: "50%",
      boxShadow: `0 0 ${size}px rgba(${r} ${g} ${b} / 50%)`,
      height: `${size}px`,
      left: `${x}%`,
      opacity: 0,
      position: "absolute",
      top: `${y}%`,
      width: `${size}px`,
      zIndex: 0,
    };

    Object.assign(bubble.style, styles);
    bubble.animate(keyframes, { ...options, duration });
    df.appendChild(bubble);
  }

  parentElement.appendChild(df);
}
