import React from "react";
import { Sparkles } from "lucide-react";
import ShinyTextParams from "./ui/ShinyTextParams";

function Hero({ className = "" }) {
  return (
    <section
      className={`${className} h-[100vh] py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 flex flex-col justify-center items-center`}
    >
      <a
        href="#"
        className="group relative inline-flex items-center justify-between gap-3 px-1.5 py-1.5 pr-4 mb-8 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#7C3AED]/50 transition-all duration-300 shadow-[0_0_15px_rgba(109,40,217,0.15)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] backdrop-blur-md"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6D28D9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <span className="relative z-10 flex items-center justify-center gap-1.5 px-3 py-1 font-sans text-xs font-semibold text-white bg-[#6D28D9] rounded-full shadow-[0_0_10px_rgba(109,40,217,0.5)]">
          <Sparkles className="w-3.5 h-3.5" />
          New
        </span>
        <span className="relative z-10 font-sans font-medium text-white/90">
          View on GitHub
        </span>
        <svg
          className="relative z-10 w-4 h-4 ml-1 text-gray-400 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
      <h1 className="mb-6 text-4xl font-display font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl">
        Programmable ASCII Engine
      </h1>
      <p className="mb-10 text-lg md:text-xl font-sans font-normal text-gray-400 leading-relaxed max-w-4xl mx-auto px-4">
        A lightweight WebGL engine that transforms luminance into animated ASCII
        backgrounds fully customizable and GPU accelerated.
      </p>
      <div className="mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <a
          href="#"
          className="inline-flex justify-center items-center py-3 px-6 bg-[#6D28D9] font-sans text-base font-medium text-white text-center rounded-xl border border-transparent hover:bg-[#7C3AED] transition-all duration-300 shadow-[0_0_15px_rgba(109,40,217,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
        >
          <ShinyTextParams />
          <p className="ml-2"> 🚀</p>
        </a>
      </div>
    </section>
  );
}

export default Hero;
