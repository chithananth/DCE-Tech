import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./about.css";

const About = () => {
  const [data, setData] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/about").then((res) => {
      setData(res.data);

      // Apply dynamic CSS variables
      if (res.data.colors) {
        const root = document.documentElement;
        Object.entries(res.data.colors).forEach(([key, value]) => {
          const cssVar = key.startsWith("--") ? key : `--${key}`;
          root.style.setProperty(cssVar, value);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imageRef.current.classList.add("animate-left");
            contentRef.current.classList.add("animate-right");
            observer.disconnect(); // Run only once
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
  }, [data]);

  if (!data) return null;

  const { heading, about } = data; // ✅ Now we have heading data from DB
  const { image, title, highlight, description, buttonText } = about;

  return (
    <section className="about-section" id="about">
      <div className="about-heading">
        <h2 className="about-title">{heading?.title}</h2>
        <p className="about-subtitle">{heading?.subtitle}</p>
        <div className="about-divider"></div>
      </div>

      <div className="about-container" ref={containerRef}>
        <div className="about-image" ref={imageRef}>
          <img src={`http://localhost:5000${image}`} alt="About" />
        </div>
        <div className="about-content" ref={contentRef}>
          <h2>{title}</h2>
          <h3>{highlight}</h3>
          <p>{description}</p>
          <button>{buttonText}</button>
        </div>
      </div>
    </section>
  );
};

export default About;
