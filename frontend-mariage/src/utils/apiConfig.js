export const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search);
    const backendParam = queryParams.get("backend");
    if (backendParam === "local" || backendParam === "global") {
      localStorage.setItem("backend_mode", backendParam);
    }
  }

  const mode = localStorage.getItem("backend_mode");
  if (mode === "local") {
    return "http://localhost:8000/api/v1";
  }
  if (mode === "global") {
    return "https://mariage-2-production.up.railway.app/api/v1";
  }
  return (
    process.env.REACT_APP_API_BASE_URL ||
    "https://mariage-2-production.up.railway.app/api/v1"
  );
};

export const getBackendMode = () => {
  const mode = localStorage.getItem("backend_mode");
  if (mode === "local" || mode === "global") return mode;
  const envUrl = process.env.REACT_APP_API_BASE_URL || "";
  if (envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
    return "local";
  }
  return "global";
};

export const setBackendMode = (mode) => {
  if (mode === "local" || mode === "global") {
    localStorage.setItem("backend_mode", mode);
    window.location.reload();
  }
};
