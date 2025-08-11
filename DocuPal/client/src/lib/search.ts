export const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
export const formMatches = (q: string, code: string, title: string) => {
  const nq = norm(q);
  if (!nq) return false;
  return norm(code).startsWith(nq) || norm(title).includes(nq);
};
