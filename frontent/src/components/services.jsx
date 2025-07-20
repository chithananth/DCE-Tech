import React, { useState, useEffect, useRef } from "react";
import "./services.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ServiceSlider = () => {
  const [servicesData, setServicesData] = useState(null);  // full payload
  const [services, setServices] = useState([]);            // convenience
  const [activeIndex, setActiveIndex] = useState(0);
  const rotationRef = useRef(null);

  /* Fetch services + colors */
  useEffect(() => {
    let cancelled = false;
    axios
      .get("http://localhost:5000/api/services")
      .then((response) => {
        if (cancelled) return;
        const data = response.data || {};
        setServicesData(data);
        setServices(Array.isArray(data.services) ? data.services : []);

        // apply CSS variables
        if (data.colors) {
          const root = document.documentElement;
          Object.entries(data.colors).forEach(([key, value]) => {
            const cssVar = key.startsWith("--") ? key : `--${key}`;
            root.style.setProperty(cssVar, String(value));
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch services:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Auto-rotate */
  useEffect(() => {
    if (rotationRef.current) clearInterval(rotationRef.current);
    if (services.length < 2) return;

    rotationRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => {
      if (rotationRef.current) clearInterval(rotationRef.current);
    };
  }, [services.length]);

  const prevSlide = () => {
    if (!services.length) return;
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? services.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    if (!services.length) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const getCardClass = (index) => {
    const total = services.length;
    if (!total) return "card hidden";
    const diff = (index - activeIndex + total) % total;

    switch (diff) {
      case 0:
        return "card center";
      case 1:
        return "card right";
      case 2:
        return "card far-right";
      case total - 1:
        return "card left";
      case total - 2:
        return "card far-left";
      default:
        return "card hidden";
    }
  };

  /* Loading / empty */
  if (!servicesData) {
    return (
      <div className="services-section">
        <p>Loading services…</p>
      </div>
    );
  }

  const heading = servicesData.heading || {};
  const hasServices = services.length > 0;

  return (
    <div className="services-section" id="services">
      <div className="services-heading">
        <h2 className="services-title">{heading.title || "Our Expertise"}</h2>
        <p className="services-subtitle">
          {heading.subtitle || "Innovative solutions tailored to elevate your business success."}
        </p>
        <div className="services-divider"></div>
      </div>

      {hasServices ? (
        <div className="services-slider">
          <button
            className="nav left"
            onClick={prevSlide}
            aria-label="Previous service"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className="slider-3d">
            {services.map((service, index) => {
              const cardClass = getCardClass(index);
              if (cardClass === "card center") {
                return (
                  <div key={index} className={cardClass}>
                    <div className="card-content full">
                      <div
                        className="card-top"
                        style={{
                          backgroundImage: `url(http://localhost:5000${service.image})`,
                        }}
                      />
                      <div className="card-bottom">
                        <h2>{service.name}</h2>
                        <p>{service.description}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={index} className={cardClass}>
                  <div
                    className="card-image"
                    style={{
                      backgroundImage: `url(http://localhost:5000${service.image})`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <button
            className="nav right"
            onClick={nextSlide}
            aria-label="Next service"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      ) : (
        <p>No services available.</p>
      )}
    </div>
  );
};

export default ServiceSlider;
