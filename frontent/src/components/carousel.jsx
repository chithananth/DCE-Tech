import React, { useEffect, useState } from "react";
import axios from "axios";
import "./carousel.css";
import Typewriter from "./typewriter";

const Carousel = () => {
  const [carouselData, setCarouselData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [finalBackgroundSlide, setFinalBackgroundSlide] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  useEffect(() => {
  if (!carouselData || !carouselData.colors) return;
  const root = document.documentElement;

  Object.entries(carouselData.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}, [carouselData]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/carousel")
      .then((res) => setCarouselData(res.data))
      .catch((err) => console.error("Error fetching carousel data", err));
  }, []);

  const goToSlide = (nextIndex) => {
    if (!carouselData || nextIndex === currentSlide) return;
    setPreviousSlide(currentSlide);
    setCurrentSlide(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % (carouselData?.slides?.length || 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [currentSlide, carouselData]);

  useEffect(() => {
    if (!carouselData) return;

    const activeThumb = document.querySelector(
      ".carousel-thumbnails .thumbnail.active"
    );
    const container = document.querySelector(".carousel-container");

    if (!activeThumb || !container) return;

    const rect = activeThumb.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const existingOverlay = document.querySelector(".background-anim");
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement("div");
    overlay.className = "background-anim";
    overlay.style.backgroundImage = `url(http://localhost:5000${carouselData.slides[currentSlide].image})`;
    overlay.style.top = `${rect.top - containerRect.top}px`;
    overlay.style.left = `${rect.left - containerRect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    container.appendChild(overlay);
    overlay.classList.add("animate-grow-to-background");

    document.querySelectorAll(".carousel-content").forEach((el) => {
      el.classList.remove("animate-in");
    });

    overlay.addEventListener("animationend", () => {
      overlay.remove();

      // ✅ Now set final background
      setFinalBackgroundSlide(currentSlide);

      const content = document
        .querySelectorAll(".carousel-slide")
        [currentSlide]?.querySelector(".carousel-content");

      if (content) {
        content.classList.add("animate-in");
      }

      setTimeout(() => {
        setStartTyping(true);
      }, 200);
    });
  }, [currentSlide, carouselData]);

  useEffect(() => {
    setStartTyping(false);
  }, [currentSlide]);

  if (
    !carouselData ||
    !carouselData.slides ||
    carouselData.slides.length === 0
  ) {
    return <div>Loading...</div>;
  }

  const slides = carouselData.slides;
  const buttons = carouselData.buttons || [];

  return (
        <div className="color" id="home">
    <div
      className="carousel-container"
      style={{
        backgroundImage: `url(http://localhost:5000${carouselData.slides[finalBackgroundSlide].image})`,
      }}
    >
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`carousel-slide ${idx === currentSlide ? "active" : ""}`}
        >
          <div className="carousel-content">
            <h2 className="carousel-typewriter">
              <Typewriter
                text={slide.typewriter}
                slideIndex={currentSlide}
                startTyping={startTyping}
              />
            </h2>
            <p className="carousel-subheading">{slide.subheading}</p>

            <div className="carousel-buttons">
              {buttons.map((btn, i) => (
                <a key={i} href={btn.link}>
                  <button>{btn.label}</button>
                </a>
              ))}
            </div>
          </div>

          <div className="carousel-thumbnails">
            {slides.map((thumbSlide, tIdx) => (
              <img
                key={tIdx}
                src={`http://localhost:5000${thumbSlide.thumbnail}`}
                alt={`Slide ${tIdx}`}
                className={`thumbnail ${tIdx === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(tIdx)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Carousel;
