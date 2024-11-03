const parentElement = document.querySelector(".bubble");

if (parentElement) {
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

  for (let i = 0; i < 31; i++) {
    const bubble = document.createElement("div");
    const alpha = Math.random();
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 1201;
    const duration = Math.random() * 70001 + 35023;

    const styles = {
      background: `rgba(255, 255, 255, ${alpha})`,
      borderRadius: "50%",
      boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
      height: `${size}px`,
      left: `${x}%`,
      opacity: 0,
      position: "absolute",
      top: `${y}%`,
      width: `${size}px`,
    };

    Object.assign(bubble.style, styles);
    bubble.animate(keyframes, { ...options, delay, duration });
    df.appendChild(bubble);
  }

  parentElement.appendChild(df);
}
