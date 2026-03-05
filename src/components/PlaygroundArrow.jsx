const floatKeyframes = `
  @keyframes floatDown {
    0%   { transform: translateY(0px);   opacity: 0.5; }
    50%  { transform: translateY(10px);  opacity: 1;   }
    100% { transform: translateY(0px);   opacity: 0.5; }
  }
`;

export default function PlaygroundArrow() {
  const handleClick = () => {
    const target = document.getElementById("playground");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{floatKeyframes}</style>

      <section className="w-full py-6 bg-black flex items-center justify-center">
        <button
          onClick={handleClick}
          className="group flex flex-col items-center gap-5 cursor-pointer select-none focus:outline-none"
          aria-label="Scroll to Playground"
        >
          {/* Label */}
          <span
            className="
              font-display text-4xl tracking-tight
              text-neutral-400
              transition-all duration-500 ease-out
              group-hover:text-neutral-200
            "
          >
            playground time
          </span>

          {/* Arrow */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-600 group-hover:text-neutral-400 transition-colors duration-500 ease-out"
            style={{ animation: "floatDown 2.2s ease-in-out infinite" }}
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </section>
    </>
  );
}
