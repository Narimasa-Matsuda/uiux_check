"use client";

import { useEffect, useState, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const OPTIONS = {
  fullScreen: { enable: false },
  detectRetina: true,
  particles: {
    number: { value: 34, density: { enable: true, area: 800 } },
    color: { value: "#c0acff" },
    shape: { type: "circle" },
    opacity: { value: 1 },
    size: { value: { min: 1, max: 3 }, random: true },
    links: {
      enable: true,
      distance: 224,
      color: "#7968f8",
      opacity: 0.125,
      width: 1.6,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none" as const,
      random: false,
      straight: false,
      outModes: "out" as const,
      bounce: false,
    },
  },
  interactivity: {
    detectsOn: "canvas" as const,
    events: {
      onHover: { enable: true, mode: "repulse" as const },
      onClick: { enable: true, mode: "push" as const },
      resize: { enable: true },
    },
    modes: {
      repulse: { distance: 200, duration: 0.4 },
      push: { quantity: 4 },
    },
  },
};

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {ready && (
        <Particles
          id="tsparticles"
          options={OPTIONS}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
