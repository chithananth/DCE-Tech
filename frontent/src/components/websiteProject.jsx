import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./websiteProject.css";

export default function WebsiteProjects() {
  const [payload, setPayload] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnim, setShowAnim] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const rotationRef = useRef(null);

  /* Fetch projects + colors */
  useEffect(() => {
    let cancelled = false;

    axios
      .get("http://localhost:5000/api/websiteproject")
      .then((res) => {
        if (cancelled) return;
        const data = res.data || {};
        setPayload(data);

        const proj = Array.isArray(data.projects) ? data.projects : [];
        setProjects(proj);

        // Apply dynamic theme colors from API
        if (data.colors && typeof data.colors === "object") {
          const root = document.documentElement;
          Object.entries(data.colors).forEach(([key, value]) => {
            const cssVar = key.startsWith("--") ? key : `--${key}`;
            root.style.setProperty(cssVar, String(value));
          });
        }

        // Initial animation trigger
        setTimeout(() => setShowAnim(true), 100);
      })
      .catch((err) => {
        console.error("WebsiteProjects API error:", err);
        setLoadError("Failed to load website projects.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Auto rotate */
  useEffect(() => {
    if (rotationRef.current) clearInterval(rotationRef.current);
    if (projects.length < 2) return; // no rotation if only one project

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
  }, [projects.length]);

  /* Reset animation when index changes */
  useEffect(() => {
    if (!projects.length) return;
    setShowAnim(false);
    const t = setTimeout(() => setShowAnim(true), 50);
    return () => clearTimeout(t);
  }, [activeIndex, projects.length]);

  /* Dot click handler */
  const handleDotClick = (idx) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
  };

  /* Calculate relative index safely */
  const getRelativeIndex = (offset) => {
    const len = projects.length;
    if (!len) return 0;
    return (activeIndex + offset + len) % len;
  };

  const active = projects[activeIndex] || {};

  /* Loading / Error UI */
  if (loading) {
    return (
      <div className="lapportfolio-wrapper">
        <p>Loading website projects…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="lapportfolio-wrapper">
        <p>{loadError}</p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="lapportfolio-wrapper">
        <p>No website projects available.</p>
      </div>
    );
  }

  const heading = payload?.heading || {};

  return (
    <div className="lapportfolio-wrapper" id="projects">
      <div className="portfolio-heading">
        <h2 className="project-title">{heading.title || "Crafting Digital Excellence"}</h2>
        <p className="project-subtitle">
          {heading.subtitle || "Our projects are more than code — they’re experiences that connect."}
        </p>
        <div className="project-divider"></div>
      </div>

      <div className="laplogo-row">
        {/* Left logos */}
        {[1, 2].map((offset) => {
          const idx = getRelativeIndex(-offset);
          const item = projects[idx];
          if (!item) return null;
          return (
            <div
              className={`laplogo-box ${
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

        {/* Laptop preview */}
        <div className="laptop-box">
          <div
            className={`laptop-screen ${
              showAnim ? "slide-in-laptop-image" : ""
            }`}
          >
            <img
              src={`http://localhost:5000${active.image || ""}`}
              alt={active.name || "project"}
              className="laptop-image"
            />
          </div>

          <div
            className={`lapline-description ${showAnim ? "lapdesc-anim" : ""}`}
          >
            <div className="lapline"></div>
            <div className="lapdesc">{active.description || ""}</div>
          </div>

          <div
            className={`lapline-link ${showAnim ? "laplink-anim" : ""}`}
          >
            <div className="lapline"></div>
            <a
              href={active.link || "#"}
              className="laplink"
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
              className={`laplogo-box ${
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
      <div className="lapdots">
        {projects.map((p, idx) => (
          <span
            key={p.name || idx}
            className={`lapdot ${idx === activeIndex ? "active" : ""}`}
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
