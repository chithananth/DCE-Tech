import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import Services from "./components/services";
import Timeline from "./components/timeline";
import Loader from "./components/pageloader"; 
import About from "./components/about";
import Project from "./components/project";
import WebsiteProjects from "./components/websiteProject";
import MapSection from "./components/map";
import Footer from "./components/footer";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [forceLoop, setForceLoop] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceLoop(true); // If site not ready in 3s, loop loader
    }, 5000);

    const handleLoad = () => {
      clearTimeout(timeout);
      setTimeout(() => setLoading(false), 10000); // Delay allows loader to finish
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return loading ? <Loader loop={forceLoop} size={600} /> : (
    <>
      <Navbar />
      <Carousel />
      <About/>
      <Services />
      <Timeline />
      <WebsiteProjects/>
      <Project/>
      <MapSection/>
      <Footer/>
    </>
  );
}

export default App;
