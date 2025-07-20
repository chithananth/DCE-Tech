import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./project.css";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnim, setShowAnim] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const rotationRef = useRef(null); // track interval so we can clear/restart

  /* ---------------------------
   * Fetch data (projects + colors)
   * -------------------------- */
  useEffect(() => {
    let cancelled = false;

    axios
      .get("http://localhost:5000/api/project")
      .then((res) => {
        if (cancelled) return;
        const data = res.data || {};
        const proj = Array.isArray(data.projects) ? data.projects : [];
        setProjects(proj);

        // Apply theme colors from API (optional)
        if (data.colors && typeof data.colors === "object") {
          const root = document.documentElement;
          Object.entries(data.colors).forEach(([k, v]) => {
            const cssVar = k.startsWith("--") ? k : `--${k}`;
            root.style.setProperty(cssVar, String(v));
          });
        }

        // Start first animation after data present
        // (give browser a tick so CSS can update)
        setTimeout(() => setShowAnim(true), 50);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Project API error:", err);
        setLoadError("Unable to load projects.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------
   * Auto-rotate slider
   * -------------------------- */
  useEffect(() => {
    // clear any existing interval
    if (rotationRef.current) {
      clearInterval(rotationRef.current);
    }

    // if fewer than 2 projects, no rotation
    if (projects.length < 2) return;

    rotationRef.current = setInterval(() => {
      setShowAnim(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % projects.length);
        setShowAnim(true);
      }, 100);
    }, 10000);

    return () => {
      if (rotationRef.current) clearInterval(rotationRef.current);
    };
  }, [projects.length]); // restart if project count changes

  /* ---------------------------
   * When activeIndex changes (user click or auto-rotate),
   * trigger animation cycle.
   * -------------------------- */
  useEffect(() => {
    if (!projects.length) return;
    setShowAnim(false);
    const t = setTimeout(() => setShowAnim(true), 50);
    return () => clearTimeout(t);
  }, [activeIndex, projects.length]);

  /* ---------------------------
   * User dot navigation
   * -------------------------- */
  const handleDotClick = (idx) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
  };

  /* ---------------------------
   * Safe relative index utility
   * -------------------------- */
  const getRelativeIndex = (offset) => {
    const len = projects.length;
    if (!len) return 0;
    return (activeIndex + offset + len) % len;
  };

  const active = projects[activeIndex] || {};

  /* ---------------------------
   * Loading / error UI
   * -------------------------- */
  if (loading) {
    return (
      <div className="portfolio-wrapper">
        <p>Loading projects…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="portfolio-wrapper">
        <p>{loadError}</p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="portfolio-wrapper">
        <p>No projects found.</p>
      </div>
    );
  }

  /* ---------------------------
   * Main render
   * -------------------------- */
  return (
    <div className="portfolio-wrapper">
      <div className="logo-row">
        {/* Left logos */}
        {[-2, -1].map((offset) => {
          const idx = getRelativeIndex(offset);
          const item = projects[idx];
          if (!item) return null;
          return (
            <div
              className={`logo-box ${
                idx === activeIndex ? "hidden-logo" : ""
              }`}
              key={`left-${offset}`}
            >
              <img
                src={`http://localhost:5000${item.logo}`}
                alt={item.name || "logo"}
              />
            </div>
          );
        })}

        {/* Mobile device preview */}
        <div className="mobile-box">
          <div className={`mobile-screen ${showAnim ? "slide-in-image" : ""}`}>
            <img
              src={`http://localhost:5000${active.image || ""}`}
              alt={active.name || "project"}
              className="mobile-image"
            />
          </div>

          <div
            className={`line-description ${showAnim ? "desc-anim" : ""}`}
            aria-hidden={!showAnim}
          >
            <div className="line"></div>
            <div className="desc">{active.description || ""}</div>
          </div>

          <div
            className={`line-link ${showAnim ? "link-anim" : ""}`}
            aria-hidden={!showAnim}
          >
            <div className="line"></div>
            <a
              href={active.link || "#"}
              className="link"
              target="_blank"
              rel="noreferrer"
            >
              Visit Website
            </a>
          </div>
        </div>

        {/* Right logos */}
        {[1, 2].map((offset) => {
          const idx = getRelativeIndex(offset);
          const item = projects[idx];
          if (!item) return null;
          return (
            <div
              className={`logo-box ${
                idx === activeIndex ? "hidden-logo" : ""
              }`}
              key={`right-${offset}`}
            >
              <img
                src={`http://localhost:5000${item.logo}`}
                alt={item.name || "logo"}
              />
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="dots">
        {projects.map((p, idx) => (
          <span
            key={p.name || idx}
            className={`dot ${idx === activeIndex ? "active" : ""}`}
            onClick={() => handleDotClick(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleDotClick(idx);
            }}
            aria-label={`Go to ${p.name || `project ${idx + 1}`}`}
          ></span>
        ))}
      </div>
    </div>
  );
}
