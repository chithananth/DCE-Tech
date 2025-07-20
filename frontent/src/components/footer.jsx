import React, { useEffect, useState } from "react";
import axios from "axios";
import "./footer.css";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/footer").then((res) => {
      const payload = res.data || {};
      setData(payload);

      // Apply CSS variables from payload.colors
      if (payload.colors) {
        const root = document.documentElement;
        Object.entries(payload.colors).forEach(([k, v]) => {
          const cssVar = k.startsWith("--") ? k : `--${k}`;
          root.style.setProperty(cssVar, String(v));
        });
      }
    });
  }, []);

  if (!data) return null;

  const { company, quickLinks, resources, contact, social, legal } = data;

  const SocialIcon = ({ type, url, icon }) => {
    if (!url) return null;
    return (
      <a
        href={url}
        className="footer-social-link"
        target="_blank"
        rel="noreferrer"
        aria-label={type}
      >
        <FontAwesomeIcon icon={icon} />
      </a>
    );
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        {/* Company */}
        <div className="footer-col footer-col-company">
          {company?.logo && (
            <img
              src={`http://localhost:5000${company.logo}`}
              alt={company?.name || "Company logo"}
              className="footer-logo"
            />
          )}
          {company?.name && <h3 className="footer-company-name">{company.name}</h3>}
          {company?.tagline && <p className="footer-company-tagline">{company.tagline}</p>}
        </div>

        {/* Quick Links */}
        <div className="footer-col footer-col-links">
          <h4 className="footer-col-heading">Quick Links</h4>
          <ul>
            {(quickLinks || []).map((lnk, i) => (
              <li key={i}>
                <a href={lnk.href}>{lnk.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-col footer-col-links">
          <h4 className="footer-col-heading">Resources</h4>
          <ul>
            {(resources || []).map((lnk, i) => (
              <li key={i}>
                <a href={lnk.href}>{lnk.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col footer-col-contact">
          <h4 className="footer-col-heading">Contact</h4>
          {contact?.address && <p>{contact.address}</p>}
          {contact?.phone && (
            <p>
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </p>
          )}
          {contact?.email && (
            <p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          )}

          {/* Social icons */}
          <div className="footer-social-row">
            <SocialIcon type="linkedin" url={social?.linkedin} icon={faLinkedinIn} />
            <SocialIcon type="instagram" url={social?.instagram} icon={faInstagram} />
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p className="footer-copy">
          {legal?.copyright || "© Your Company. All rights reserved."}
        </p>
        {legal?.links?.length > 0 && (
          <ul className="footer-legal-links">
            {legal.links.map((lnk, i) => (
              <li key={i}>
                <a href={lnk.href}>{lnk.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
