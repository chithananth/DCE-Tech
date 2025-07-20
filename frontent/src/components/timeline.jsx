import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./timeline.css";

export default function Timeline() {
  const [data, setData] = useState({ colors: {}, events: [], heading: null });
  const lineRef = useRef();
  const sectionRef = useRef();
  const [revealedSteps, setRevealedSteps] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/timeline").then((res) => {
      const payload = res.data || {};
      setData({
        colors: payload.colors || {},
        events: payload.events || [],
        heading: payload.heading || null,
      });

      // apply theme vars
      Object.entries(payload.colors || {}).forEach(([k, v]) => {
        const cssVar = k.startsWith("--") ? k : `--${k}`;
        document.documentElement.style.setProperty(cssVar, v);
      });
    });
  }, []);

  useEffect(() => {
    if (!data.events.length) return;

    const lineSteps = [
      { height: 150, duration: 1000, pause: 700 },
      { height: 500, duration: 1200, pause: 700 },
      { height: 860, duration: 1500, pause: 700 },
      { height: 1200, duration: 1500, pause: 700 },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        (async () => {
          for (let i = 0; i < lineSteps.length; i++) {
            const { height, duration, pause } = lineSteps[i];

            lineRef.current.style.transition = `height ${duration}ms ease`;
            lineRef.current.style.height = `${height}px`;

            await new Promise((r) => setTimeout(r, duration));
            setRevealedSteps((prev) => [...prev, i]);
            await new Promise((r) => setTimeout(r, pause));
          }
        })();
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [data.events]);

  const heading = data.heading || {};
  const titleText =
    heading.title || "Excellence in Every Step";
  const subtitleText =
    heading.subtitle || "From start to finish, we deliver quality you can count on.";

  return (
    <section className="timeline-section" ref={sectionRef} id="quality">
      <div className="timeline-heading">
        <h2 className="timeline-title">{titleText}</h2>
        <p className="timeline-subtitle">{subtitleText}</p>
        <div className="timeline-divider"></div>
      </div>

      <div className="timeline-container">
        <div className="timeline-line" ref={lineRef} />
        {data.events.map((e, i) => {
          const animationClass = i % 2 === 0 ? "card-portal-left" : "card-portal-right";
          return (
            <div
              key={i}
              id={`evt-${i}`}
              className={`timeline-event ${i % 2 === 0 ? "left" : "right"} ${
                revealedSteps.includes(i) ? `revealed ${animationClass}` : ""
              }`}
            >
              <div className="event-card">
                <div
                  className="event-image"
                  style={{
                    backgroundImage: `url(http://localhost:5000${e.image})`,
                  }}
                />
                <div className="event-content">
                  <h3 className="event-title">{e.title}</h3>
                  <p className="event-desc">{e.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
