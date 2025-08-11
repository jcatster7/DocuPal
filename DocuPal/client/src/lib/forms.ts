export type CourtForm = { code: string; title: string; category: string; isPetition: boolean };

export async function loadForms(): Promise<CourtForm[]> {
  const res = await fetch('/forms.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load forms');
  return res.json();
}

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
export function searchForms(q: string, forms: CourtForm[]) {
  const nq = norm(q);
  if (!nq) return [];
  return forms
    .filter(f => f.isPetition)
    .filter(f => norm(f.code).startsWith(nq) || norm(f.title).includes(nq))
    .sort((a, b) => {
      const aCode = +norm(a.code).startsWith(nq);
      const bCode = +norm(b.code).startsWith(nq);
      return bCode - aCode || a.code.localeCompare(b.code);
    })
    .slice(0, 20);
}
