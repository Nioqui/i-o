import "./App.css";
import BackgroundEffect from "./components/BackgroundEffect";
import Hero from "./components/Hero";
import Playground from "./components/Playground";
import Header from "./components/Header";
import Section from "./components/Section";
import PlaygroundArrow from "./components/PlaygroundArrow";
import HowToUse from "./components/HowToUse";
import { useState, useEffect } from "react";

function App() {
  const [codeCopied, setCodeCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCopyEvent = () => {
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 3000);
  };

  return (
    <>
      <Header />
      <div id="home" className="bg-black min-h-screen reveal">
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse at top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 70%)",
            maskImage:
              "radial-gradient(ellipse at top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none" />
          <BackgroundEffect />
        </div>
        <div className="relative z-20">
          <Hero className="bg-transparent" />
        </div>
      </div>

      <div id="overview" className="bg-black reveal">
        <Section />
      </div>

      <PlaygroundArrow />

      <div id="playground">
        <Playground
          className="relative"
          onCopy={handleCopyEvent}
          onCodeGenerate={setGeneratedCode}
        />
      </div>

      <div id="how-to-use" className="reveal">
        <HowToUse isCopied={codeCopied} generatedCode={generatedCode} />
      </div>
    </>
  );
}

export default App;
