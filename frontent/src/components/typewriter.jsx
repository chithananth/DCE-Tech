import React from "react";
import { ReactTyped } from "react-typed";

const Typewriter = ({ text, slideIndex,startTyping }) => {
    if (!startTyping) return null;
  return (
    <ReactTyped
      key={slideIndex} // 🔁 Ensures re-render on every new slide
      strings={[text]}
      typeSpeed={90}
      backSpeed={50}
      showCursor={true}
      loop={false} // 👈 only once
      cursorChar="|" // optional
    />
  );
};

export default Typewriter;
