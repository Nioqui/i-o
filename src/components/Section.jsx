import GradientText from "./ui/GradientText";
import CountUp from "./ui/CountUp";

export default function FullSectionFaq() {
  return (
    <section className="px-6 flex flex-col items-center">
      {/* ── MAIN BLOCK ── */}
      <div className="flex flex-col lg:flex-row gap-16 w-full max-w-6xl items-start py-24">
        {/* ── LEFT ── */}
        <div className="flex flex-col gap-6 lg:w-1/2 lg:sticky lg:top-32">
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            animationSpeed={8}
            showBorder={false}
            className="text-sm font-semibold tracking-widest uppercase font-display"
          >
            Vision &amp; Philosophy
          </GradientText>

          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight">
            Where visual logic becomes{" "}
            <span className="font-mono text-[#B19EEF]">living type</span>
          </h2>

          <p className="font-sans text-base text-neutral-400 leading-relaxed max-w-sm transition-all duration-500 ease-out hover:text-[#e8e8e8]">
            <span className="font-mono text-neutral-300">i:o</span> was born
            from a single question: what if typography could think? Instead of
            static glyphs on a grid, each character becomes a pixel — a unit of
            intent shaped by luminance, motion, and code. It's ASCII, but as a
            live system.
          </p>

          <p className="font-sans text-base text-neutral-400 leading-relaxed max-w-sm transition-all duration-500 ease-out hover:text-[#e8e8e8]">
            The project sits at the intersection of generative art and developer
            tooling. It's not a demo — it's infrastructure for creative
            engineers who want to push the browser's rendering capabilities
            without reaching for a game engine. GPU-accelerated, React-native,
            and fully composable.
          </p>

          <p className="font-sans text-base text-neutral-400 leading-relaxed max-w-sm transition-all duration-500 ease-out hover:text-[#e8e8e8]">
            Open-source by design. The experiment only works when it's shared.
            Fork it, break it, reshape it into something we haven't imagined —
            that's the whole point.
          </p>
        </div>

        {/* ── RIGHT ── */}
        <div className="lg:w-1/2 flex flex-col divide-y divide-neutral-800 rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
          <div className="px-8 py-7 group">
            <p className="font-display text-base font-semibold text-neutral-100 tracking-tight mb-2 transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              Implementation breakdown
            </p>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              <span className="font-mono text-neutral-300">i:o</span> samples
              each animation frame via WebGL, maps luminance values to a
              character lookup table, and writes the result into a DOM grid. All
              heavy computation stays on the GPU — the CPU only handles
              configuration and React reconciliation.
            </p>
          </div>

          <div className="px-8 py-7 group">
            <p className="font-display text-base font-semibold text-neutral-100 tracking-tight mb-2 transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              How does <span className="font-mono text-[#B19EEF]">i:o</span>{" "}
              handle performance?
            </p>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              The renderer runs inside a{" "}
              <span className="font-mono text-neutral-300">{`<canvas>`}</span>{" "}
              element with a custom WebGL shader pipeline. Frame reads are
              batched and diffed before writing to the DOM, keeping reflows
              minimal even at high character densities.
            </p>
          </div>

          <div className="px-8 py-7 group">
            <p className="font-display text-base font-semibold text-neutral-100 tracking-tight mb-2 transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              What can I build with{" "}
              <span className="font-mono text-[#B19EEF]">i:o</span>?
            </p>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              Interactive hero backgrounds, generative art canvases, data-driven
              visualizers, experimental UI layers, and anything that needs
              procedural character output tied to real-time input — cursor
              position, audio, scroll depth, or custom data streams.
            </p>
          </div>

          <div className="px-8 py-7 group">
            <p className="font-display text-base font-semibold text-neutral-100 tracking-tight mb-2 transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              Is <span className="font-mono text-[#B19EEF]">i:o</span>{" "}
              composable with my existing stack?
            </p>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed transition-all duration-500 ease-out hover:text-[#e8e8e8]">
              Yes. The engine exposes a React component API with typed props —
              drop it into any React tree, control it with{" "}
              <span className="font-mono text-neutral-300">useRef</span> or
              state, and style around it with your existing CSS system. No
              global CSS pollution, no singleton requirements.
            </p>
          </div>
        </div>
      </div>

      {/* ── COUNT UP SECTION ── */}
      <div className="w-full max-w-6xl pt-28 pb-6 flex flex-col items-center justify-center text-center border-t border-neutral-800">
        <p className="font-sans text-sm font-medium tracking-widest uppercase text-neutral-500 mb-6">
          Licensing
        </p>

        <div
          className="font-display font-bold leading-none tracking-tight"
          style={{
            fontSize: "clamp(4rem, 12vw, 9rem)",
            background:
              "linear-gradient(to right, #5227FF, #FF9FFC, #B19EEF, #5227FF)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradientShift 8s linear infinite",
          }}
        >
          <CountUp from={0} to={100} duration={2.5} delay={0.2} />
          <span>%</span>
        </div>

        <p className="font-display text-2xl lg:text-3xl font-semibold text-white mt-4 tracking-tight">
          Free &amp; Open Source
        </p>

        <p className="font-sans text-base text-neutral-500 mt-4 max-w-xs leading-relaxed">
          No license fees. No vendor lock-in. Built in public, for developers.
        </p>
      </div>
    </section>
  );
}
