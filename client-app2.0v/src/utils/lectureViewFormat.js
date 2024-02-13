export const kViewsLikesFormatter = (num) => (num > 999 ? `${(Math.abs(num) / 1000).toFixed(1)}k` : num);
