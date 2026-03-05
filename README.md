# i:o — Generative ASCII Backgrounds

**i:o** is an open-source generative art engine that merges the nostalgic aesthetic of **ASCII** with the raw power of modern **WebGL**. Designed for developers and designers who want to integrate dynamic, organic, and high-performance backgrounds into any web project.

> [!IMPORTANT]
> **Try the Live Editor:** > Experiment with noise patterns, tweak parameters, and generate your custom configuration in real-time at:  
> **🚀 [https://nioqui.github.io/i-o/](#)**

---

## ⚡️ High Performance: GPU Accelerated

Unlike traditional ASCII generators that rely on heavy DOM manipulation or standard 2D Canvas contexts, **i:o** is fully **GPU-accelerated**.

By offloading the calculation of every single character to **GLSL Shaders**, we achieve a consistent **60 FPS** even with extreme character densities. This allows for complex post-processing effects—like liquefaction and chromatic aberration—without taxing the CPU.

### Technical Highlights

- **WebGL Pipeline:** Ultra-efficient rendering that processes thousands of cells in milliseconds.
- **2D Simplex Noise:** Procedural generation of fluid, organic patterns that feel "alive."
- **Real-time Post-processing:** Built-in _Liquify_ and _Chromatic Aberration_ algorithms calculated per-frame.
- **Live Interactivity:** Modify density, speed, and scale parameters directly from the web interface and integrate them instantly.

## 🛠️ The Concept

The core engine uses a procedural noise function to determine the luminance of each cell:

$$L(x, y, t) = \text{Simplex}(x \cdot \text{scale}, y \cdot \text{scale}, t \cdot \text{speed})$$

This value $L$ is dynamically mapped to a specific ASCII character set, creating a rich, ever-changing visual texture that responds to parameter shifts in real-time.

## 🤝 Open Source & Contributions

This project is **100% open-source**. The goal is for the community to extend shader functions, add new character sets, or refine the distortion algorithms.

**Have an idea or a fix?** Contributions are highly encouraged. Feel free to open an _Issue_ or submit a _Pull Request_ to help evolve this ASCII engine.

---

_Built with technical precision and a passion for procedural design._
