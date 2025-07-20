import React, { useEffect, useState } from "react";
import { fetchNavbarData } from "../utils/api";
import "./Navbarstyle.css";
import { FaSearch, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const [navbarData, setNavbarData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    fetchNavbarData().then(setNavbarData);
  }, []);

  useEffect(() => {
    const config = navbarData?.config;
    if (!config) return;
    const hoverColor = darkMode
      ? config.hover_color_dark
      : config.hover_color_light;
    if (hoverColor) {
      document.documentElement.style.setProperty("--menu-hover-color", hoverColor);
    }
    if (config.entirewebbackground) {
    document.documentElement.style.setProperty("--entirewebbackground", config.entirewebbackground);
  }
  }, [darkMode, navbarData]);

  if (!navbarData) return null;

  const { config, menu } = navbarData;
  const nav_bg = darkMode ? config.nav_bg_dark : config.nav_bg_light;
  const textColor = darkMode ? config.text_color_light : config.text_color_dark;
  const searchBgColor = darkMode ? config.search_bg_light : config.search_bg_dark;
  const searchTextColor = darkMode ? config.search_text_dark : config.search_text_light;
  const iconColor = darkMode ? config.icon_color_light : config.icon_color_dark;

  return (
    <div className="navbar-wrapper">
      <nav
        className="navbar"
        style={{ backgroundColor: nav_bg, color: textColor }}
      >
        <div className="navbar-logo">
          <img src={`http://localhost:5000${config.logo_url}`} alt="Logo" />
        </div>

        <div className="navbar-center">
          {menu.map((item) => (
            <a key={item.name} href={item.path} style={{ color: textColor }}>
              {item.name}
            </a>
          ))}
        </div>

        <div className="navbar-right">
          <div
            className="navbar-search"
            style={{ backgroundColor: searchBgColor }}
          >
            <FaSearch color={searchTextColor} />
            <input
              type="text"
              placeholder="Search..."
              style={{ color: searchTextColor }}
            />
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FaSun color={iconColor} /> : <FaMoon color={iconColor} />}
          </button>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </nav>

      <div
        className={`mobile-menu ${menuOpen ? "show" : ""}`}
        style={{ backgroundColor: nav_bg, color: textColor }}
      >
        {menu.map((item) => (
          <a
            key={item.name}
            href={item.path}
            style={{ color: textColor }}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </a>
        ))}

        <div className="navbar-search" style={{ backgroundColor: searchBgColor }}>
          <FaSearch color={searchTextColor} />
          <input
            type="text"
            placeholder="Search..."
            style={{ color: searchTextColor }}
          />
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun color={iconColor} /> : <FaMoon color={iconColor} />}
        </button>
      </div>
    </div>
  );
}
