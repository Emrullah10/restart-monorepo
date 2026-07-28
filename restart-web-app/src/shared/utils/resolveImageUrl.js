export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `/api${path.startsWith('/') ? path : `/${path}`}`;
};

export default resolveImageUrl;
