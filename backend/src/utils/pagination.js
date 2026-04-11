export const getPagination = (page = 1, limit = 12) => {
  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) > 0
      ? Math.min(Number(limit), 50)
      : 12;

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  };
};

export const buildPaginatedResponse = ({ items, page, limit, totalItems }) => ({
  items,
  page,
  limit,
  totalItems,
  totalPages: Math.max(Math.ceil(totalItems / limit), 1)
});
