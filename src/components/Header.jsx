import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const defaultSections = [
  { id: "home", label: "Home" },
  { id: "overview", label: "Overview" },
  { id: "playground", label: "Playground" },
  { id: "how-to-use", label: "How to use" },
];

export default function Header({
  sections = defaultSections,
  githubUrl = "https://github.com/your-repo/io",
  showBackgroundOnScroll = true,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (showBackgroundOnScroll) {
        setIsScrolled(window.scrollY > 20);
      }

      // Update active section based on scroll position
      const sectionElements = sections.map((s) =>
        document.getElementById(s.id),
      );
      const currentScrollPosition = window.scrollY + 100; // Offset for header

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= currentScrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, showBackgroundOnScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled || !showBackgroundOnScroll
          ? "py-3 bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a
            href="#"
            className="font-mono text-2xl font-bold tracking-tighter text-[#B19EEF]"
          >
            i:o
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center absolute left-1/2 -translate-x-1/2">
          <nav className="flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`font-sans text-sm font-medium transition-colors hover:text-white ${
                  activeSection === section.id
                    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    : "text-gray-400"
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Nioqui/i:o"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex group relative items-center gap-2 px-4 py-2 font-sans text-sm font-medium text-white transition-all duration-300 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#7C3AED]/50 shadow-[0_0_15px_rgba(109,40,217,0.15)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] backdrop-blur-md"
          >
            <span className="text-yellow-400">★</span> Star on GitHub
          </a>

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 mt-2 p-4 mx-4 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 origin-top flex flex-col gap-4 ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 font-sans text-sm font-medium rounded-xl transition-colors ${
              activeSection === section.id
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {section.label}
          </a>
        ))}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 mt-2 font-sans text-sm font-medium text-white transition-all rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
        >
          <span className="text-yellow-400">★</span> Star on GitHub
        </a>
      </div>
    </header>
  );
}
