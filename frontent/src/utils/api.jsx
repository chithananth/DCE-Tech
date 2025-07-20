export const fetchNavbarData = async () => {
  const response = await fetch("http://localhost:5000/api/navbar");
  if (!response.ok) throw new Error("Failed to fetch navbar data");
  return response.json();
};
