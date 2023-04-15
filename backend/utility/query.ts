export const getQuerySkip = (page?: number, take?: number) => {
  if (page === undefined || take === undefined) return undefined;
  return page! === 1 ? 0 : take! * (page! - 1);
};

export const getPages = (total: number, take?: number) => {
  if (total === undefined || take === undefined) return undefined;
  return Math.ceil(total / take!);
};
