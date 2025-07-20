import React, { useEffect, useState } from "react";
import axios from "axios";
import "./map.css";

export default function MapSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/map").then((res) => {
      setData(res.data);

      if (res.data.colors) {
        const root = document.documentElement;
        Object.entries(res.data.colors).forEach(([key, value]) => {
          const cssVar = key.startsWith("--") ? key : `--${key}`;
          root.style.setProperty(cssVar, value);
        });
      }
    });
  }, []);

  if (!data) return <p>Loading map...</p>;

  return (
    <div className="map-section">
      <div className="map-header">
        <h2 className="map-title">{data.content?.title}</h2>
        <p className="map-subtitle">{data.content?.subtitle}</p>
        <div className="map-divider"></div>
      </div>

      <div className="map-wrapper">
        <iframe
          src={data.mapEmbedURL}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Location"
        ></iframe>
      </div>
    </div>
  );
}
