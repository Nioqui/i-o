import React from "react";

const CodeBlock = ({
  title,
  children,
  showCopy = true,
  externalCopied = false,
  copyValue,
}) => {
  const [localCopied, setLocalCopied] = React.useState(false);
  const copied = localCopied || externalCopied;

  const handleCopy = () => {
    const text = React.Children.toArray(children)
      .map((child) =>
        typeof child === "string" ? child : child.props?.children,
      )
      .join("\n");
    navigator.clipboard.writeText(copyValue || text);
    setLocalCopied(true);
    setTimeout(() => setLocalCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20">
      <div className="flex items-center justify-between px-4 py-3 bg-[#161616] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
          </div>
          <span className="ml-2 text-[11px] font-mono text-neutral-400 tracking-tight">
            {title}
          </span>
        </div>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="text-[10px] font-mono text-neutral-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        )}
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto text-neutral-300 custom-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default function HowToUse({ isCopied, generatedCode }) {
  return (
    <section className="bg-black text-white py-24 px-6 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight inline-flex items-center flex justify-center align-center text-center">
            How to use
            <span className="font-mono text-[#B19EEF] px-3 py-1 text-2xl md:text-5xl">
              i:o
            </span>
          </h2>
          <p className="font-sans text-neutral-500 text-lg mt-6 max-w-2xl leading-relaxed">
            Follow these three simple steps to integrate your custom ASCII
            effect into any React project.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          {/* Connector Lines (Desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 -z-10" />

          {/* Step 1 */}
          <div className="group flex flex-col space-y-6">
            <div className="space-y-2">
              <h3 className="font-sans text-xl font-medium text-white group-hover:text-[#a855f7] transition-colors duration-300">
                1. Create the component file
              </h3>
              <p className="font-sans text-neutral-500 text-sm leading-relaxed">
                Create a new file inside your components folder to house the
                effect.
              </p>
            </div>
            <CodeBlock title="Project Structure" showCopy={false}>
              <div className="text-neutral-500">
                <span className="text-neutral-300 uppercase text-[10px] tracking-widest mb-2 block opacity-50">
                  Explorer
                </span>
                <div className="flex items-center gap-2">
                  <span className="opacity-20">src/</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="opacity-20 text-[#a855f7]">└─</span>
                  <span className="opacity-20">components/</span>
                </div>
                <div className="flex items-center gap-2 ml-8">
                  <span className="text-[#a855f7] opacity-60">└─</span>
                  <span className="text-white font-medium border-b border-white/20">
                    BackgroundEffect.jsx
                  </span>
                </div>
              </div>
            </CodeBlock>
          </div>

          {/* Step 2 */}
          <div className="group flex flex-col space-y-6">
            <div className="space-y-2">
              <h3 className="font-sans text-xl font-medium text-white group-hover:text-[#a855f7] transition-colors duration-300">
                2. Paste the playground code
              </h3>
              <p className="font-sans text-sm text-neutral-500 leading-relaxed">
                Copy the generated component from the playground and paste it
                inside the file.
              </p>
            </div>
            <div
              className={`transition-all duration-500 rounded-xl ${
                isCopied
                  ? "ring-2 ring-[#a855f7]/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                  : ""
              }`}
            >
              <CodeBlock
                title="BackgroundEffect.jsx"
                externalCopied={isCopied}
                copyValue={generatedCode}
              >
                <div>
                  <div className="pl-4 opacity-40 italic my-2">
                    // paste the generated code here
                  </div>
                  <span className="text-[#a855f7]">
                    export default function
                  </span>{" "}
                  <span className="text-[#60a5fa]">BackgroundEffect</span>(){" "}
                  {"{"}
                  <div className="pl-4">
                    <span className="text-[#a855f7]">return</span> (
                    <div className="pl-4">
                      &lt;<span className="text-[#60a5fa]">canvas</span>{" "}
                      <span className="text-[#fde047]">className</span>=
                      <span className="text-[#a7f3d0]">
                        "absolute inset-0 w-full h-full"
                      </span>{" "}
                      /&gt;
                    </div>
                    );
                  </div>
                  {"}"}
                </div>
              </CodeBlock>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group flex flex-col space-y-6">
            <div className="space-y-2">
              <h3 className="font-sans text-xl font-medium text-white group-hover:text-[#a855f7] transition-colors duration-300">
                3. Import and use
              </h3>
              <p className="font-sans text-sm text-neutral-500 leading-relaxed">
                Finally, import your brand new component and drop it into your
                App.
              </p>
            </div>
            <CodeBlock title="App.jsx" showCopy={false}>
              <div>
                <span className="text-[#a855f7]">import</span>{" "}
                <span className="text-white">BackgroundEffect</span>{" "}
                <span className="text-[#a855f7]">from</span>{" "}
                <span className="text-[#a7f3d0]">
                  "./components/BackgroundEffect"
                </span>
                ;
                <br />
                <br />
                <span className="text-[#a855f7]">function</span>{" "}
                <span className="text-[#60a5fa]">App</span>() {"{"}
                <div className="pl-4">
                  <span className="text-[#a855f7]">return</span> &lt;
                  <span className="text-[#60a5fa]">BackgroundEffect</span>{" "}
                  /&gt;;
                </div>
                {"}"}
                <br />
                <br />
                <span className="text-[#a855f7]">export default</span>{" "}
                <span className="text-white">App</span>;
              </div>
            </CodeBlock>
          </div>
        </div>

        {/* Brand Footer Divider */}
        <div className="mt-32 pt-16 border-t border-white/5 text-center flex flex-col items-center">
          <div className="text-sm text-neutral-500 font-sans tracking-tight">
            <p>Created by </p>
            <a
              href="https://github.com/Nioqui"
              className="text-white font-medium hover:text-[#a855f7] transition-colors cursor-pointer"
            >
              Nioqui
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
