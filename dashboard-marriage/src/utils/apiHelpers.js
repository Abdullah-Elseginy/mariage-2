export const extractApiData = (response) => response?.data?.data ?? response?.data ?? null;

export const extractApiMessage = (response, fallback = "") =>
  response?.data?.message || fallback;

export const extractApiMeta = (response) => response?.data?.meta ?? {};

export const extractApiError = (error, fallback = "Request failed") => {
  const responseData = error?.response?.data;
  const validationErrors = responseData?.errors;

  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors).flat().find(Boolean);
    if (firstError) {
      return firstError;
    }
  }

  return responseData?.message || error?.message || fallback;
};
