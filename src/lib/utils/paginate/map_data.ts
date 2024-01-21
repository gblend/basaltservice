export const mapPaginatedData = (
  data: any[],
  pageSize: number,
  pageNumber: number,
) => {
  const total: number = data.length;
  pageNumber = Number(pageNumber);
  pageSize = Number(pageSize);
  const pages: number = Math.ceil(total / pageSize);
  const previous: number = pageNumber > 1 ? pageNumber - 1 : pageNumber;
  const next: number = pages > pageNumber ? pageNumber + 1 : pageNumber;

  return {
    result: data,
    total,
    pages,
    previous,
    next,
  };
};
