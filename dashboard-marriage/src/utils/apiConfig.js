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
    return "http://127.0.0.1:8000/api/v1";
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
  // Fallback to check if default env URL points to localhost
  const envUrl = process.env.REACT_APP_API_BASE_URL || "";
  if (envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
    return "local";
  }
  return "global";
};

export const setBackendMode = (mode) => {
  if (mode === "local" || mode === "global") {
    localStorage.setItem("backend_mode", mode);
    // Reload page to apply changes and clear existing cached endpoints/state
    window.location.reload();
  }
};

export const getFrontendUrl = () => {
  const mode = getBackendMode();
  if (mode === "local") {
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      // If the dashboard is on port 3000, local frontend must be on port 3001
      if (window.location.port === "3000") {
        return "http://localhost:3001";
      }
      // If the dashboard is on port 3001, local frontend is on port 3000
      if (window.location.port === "3001") {
        return "http://localhost:3000";
      }
    }
    return "http://localhost:3000";
  }
  return (
    process.env.REACT_APP_PUBLIC_FRONTEND_URL ||
    "https://marriage-five-pi.vercel.app"
  );
};
