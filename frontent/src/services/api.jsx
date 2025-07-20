import axios from "axios";

export const fetchNavbarData = async () => {
  const res = await axios.get("http://localhost:5000/api/navbar");
  return res.data;
};
