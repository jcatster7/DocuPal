import { useMemo, useState } from 'react';
import { COURT_FORMS } from '@/data/forms';
import { formMatches } from '@/lib/search';

export default function FormPicker({ onSelect }: { onSelect: (code: string) => void }) {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const n = q.trim();
    if (!n) return [];
    return COURT_FORMS
      .filter(f => formMatches(n, f.code, f.title))
      .sort((a, b) => {
        // prioritize code prefix matches (e.g., "FL", "FL1")
        const aCode = +norm(a.code).startsWith(norm(n));
        const bCode = +norm(b.code).startsWith(norm(n));
        return bCode - aCode || a.code.localeCompare(b.code);
      })
      .slice(0, 10);
  }, [q]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length) {
      onSelect(results[0].code);
    }
  };

  return (
    <div className="relative">
      <input
        className="w-full rounded-xl border px-4 py-3"
        placeholder="Search and Select Your Petition Form"
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={handleEnter}
      />

      {q && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border bg-white shadow-lg">
          {results.length ? results.map(f => (
            <button
              key={f.code}
              className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-gray-50"
              onClick={() => onSelect(f.code)}
            >
              <span className="font-medium">{f.code}</span>
              <span className="text-gray-600">{f.title}</span>
            </button>
          )) : (
            <div className="px-4 py-3 text-gray-500">No forms match “{q}”</div>
          )}
        </div>
      )}
    </div>
  );
}
