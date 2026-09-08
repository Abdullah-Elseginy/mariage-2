const DATABASE_ERROR_PATTERNS = [
  /no such table/i,
  /database .* does not exist/i,
  /base table or view not found/i,
  /unknown column/i,
];

const DATABASE_SIZE_ERROR_PATTERNS = [
  /server has gone away/i,
  /packet .* too large/i,
  /max_allowed_packet/i,
];

export const formatDashboardApiError = (error, fallback = 'Request failed') => {
  const firstFieldError = error?.errors
    ? Object.values(error.errors).flat().find(Boolean)
    : null;
  if (firstFieldError) {
    return firstFieldError;
  }

  const message = error?.message || fallback;

  if (DATABASE_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    return 'The backend database is not ready. Run the Laravel migrations on the configured database, then refresh the dashboard.';
  }

  if (DATABASE_SIZE_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    return 'The saved content is too large for the database connection. Upload images as media files instead of embedding them in the form.';
  }

  return message;
};
