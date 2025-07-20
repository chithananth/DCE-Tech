import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import "./pageloader.css";

const Loader = ({ loop = true, size = 200 }) => {
  const [loaderData, setLoaderData] = useState(null);
  const [loaderType, setLoaderType] = useState("lottie");

  useEffect(() => {
    fetch("http://localhost:5000/api/loader")
      .then((res) => res.json())
      .then((data) => {
        setLoaderType(data.type);
        if (data.type === "lottie") {
          const decoded = JSON.parse(atob(data.data));
          setLoaderData(decoded);
        } else {
          setLoaderData(`data:image/gif;base64,${data.data}`);
        }
      })
      .catch((err) => console.error("Loader fetch error:", err));
  }, []);

  if (!loaderData) return null;

  return (
    <div className="page-loader">
      {loaderType === "lottie" ? (
        <Lottie animationData={loaderData} loop={loop} style={{ width: size, height: size }} />
      ) : (
        <img src={loaderData} alt="Loader" style={{ width: size, height: size }} />
      )}
    </div>
  );
};

export default Loader;
