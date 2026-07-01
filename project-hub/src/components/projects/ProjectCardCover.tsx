// Project card covers. When the project has a real screenshot
// (<projectDir>/cover.png, surfaced as coverUrl) it renders that; otherwise
// falls back to stock SVG covers. Each stock variant mimics a different
// product surface (chart, table, bulk-edit, form) so the grid feels varied
// without per-project screenshots. Picked deterministically by slug.

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function CoverChart() {
  return (
    <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="150" fill="#F8FAFC" />
      <rect x="0" y="0" width="320" height="20" fill="#E2E8F0" />
      <rect x="10" y="6" width="60" height="8" fill="#CBD5E1" rx="1" />
      <rect x="16" y="34" width="90" height="6" fill="#CBD5E1" rx="1" />
      <rect x="16" y="46" width="140" height="4" fill="#E2E8F0" rx="1" />
      <rect x="16" y="120" width="16" height="20" fill="#94A3B8" />
      <rect x="38" y="100" width="16" height="40" fill="#94A3B8" />
      <rect x="60" y="82" width="16" height="58" fill="#64748B" />
      <rect x="82" y="70" width="16" height="70" fill="#94A3B8" />
      <rect x="104" y="92" width="16" height="48" fill="#94A3B8" />
      <rect x="126" y="76" width="16" height="64" fill="#94A3B8" />
      <rect x="148" y="64" width="16" height="76" fill="#64748B" />
      <rect x="170" y="88" width="16" height="52" fill="#94A3B8" />
      <polyline
        points="24,120 46,104 68,90 90,76 112,96 134,82 156,70 178,94"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <rect x="212" y="58" width="92" height="82" fill="#E2E8F0" rx="3" />
      <rect x="220" y="68" width="40" height="5" fill="#CBD5E1" rx="1" />
      <rect x="220" y="78" width="70" height="3" fill="#CBD5E1" rx="1" />
      <rect x="220" y="86" width="60" height="3" fill="#CBD5E1" rx="1" />
      <rect x="220" y="100" width="50" height="5" fill="#CBD5E1" rx="1" />
      <rect x="220" y="110" width="68" height="3" fill="#CBD5E1" rx="1" />
      <rect x="220" y="118" width="56" height="3" fill="#CBD5E1" rx="1" />
    </svg>
  );
}

function CoverTable() {
  return (
    <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="150" fill="#F8FAFC" />
      <rect x="0" y="0" width="320" height="20" fill="#E2E8F0" />
      <rect x="10" y="6" width="60" height="8" fill="#CBD5E1" rx="1" />
      <rect x="16" y="34" width="288" height="18" fill="#E2E8F0" rx="2" />
      <rect x="22" y="40" width="50" height="6" fill="#CBD5E1" rx="1" />
      <rect x="80" y="40" width="40" height="6" fill="#CBD5E1" rx="1" />
      <rect x="130" y="40" width="40" height="6" fill="#CBD5E1" rx="1" />
      <rect x="180" y="40" width="40" height="6" fill="#CBD5E1" rx="1" />
      <rect x="230" y="40" width="40" height="6" fill="#CBD5E1" rx="1" />
      <rect x="16" y="56" width="288" height="16" fill="#FFFFFF" />
      <rect x="22" y="62" width="40" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="62" width="30" height="4" fill="#94A3B8" rx="1" />
      <rect x="130" y="62" width="34" height="4" fill="#CBD5E1" rx="1" />
      <rect x="16" y="74" width="288" height="16" fill="#F1F5F9" />
      <rect x="22" y="80" width="50" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="80" width="36" height="4" fill="#2563EB" rx="1" opacity="0.6" />
      <rect x="130" y="80" width="28" height="4" fill="#CBD5E1" rx="1" />
      <rect x="16" y="92" width="288" height="16" fill="#FFFFFF" />
      <rect x="22" y="98" width="44" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="98" width="30" height="4" fill="#CBD5E1" rx="1" />
      <rect x="130" y="98" width="38" height="4" fill="#CBD5E1" rx="1" />
      <rect x="16" y="110" width="288" height="16" fill="#F1F5F9" />
      <rect x="22" y="116" width="36" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="116" width="44" height="4" fill="#2563EB" rx="1" opacity="0.6" />
      <rect x="130" y="116" width="30" height="4" fill="#CBD5E1" rx="1" />
      <rect x="16" y="128" width="288" height="16" fill="#FFFFFF" />
      <rect x="22" y="134" width="40" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="134" width="34" height="4" fill="#CBD5E1" rx="1" />
    </svg>
  );
}

function CoverBulkEdit() {
  return (
    <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="150" fill="#F8FAFC" />
      <rect x="0" y="0" width="320" height="20" fill="#E2E8F0" />
      <rect x="10" y="6" width="60" height="8" fill="#CBD5E1" rx="1" />
      <rect x="16" y="32" width="100" height="18" fill="#DBEAFE" rx="3" />
      <rect x="24" y="38" width="12" height="6" fill="#2563EB" rx="1" />
      <rect x="40" y="39" width="60" height="4" fill="#2563EB" rx="1" opacity="0.7" />
      <rect x="16" y="56" width="288" height="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <rect x="22" y="61" width="8" height="4" fill="#94A3B8" rx="1" />
      <rect x="36" y="61" width="80" height="4" fill="#CBD5E1" rx="1" />
      <rect x="200" y="61" width="50" height="4" fill="#CBD5E1" rx="1" />
      <rect x="16" y="70" width="288" height="14" fill="#DBEAFE" stroke="#2563EB" opacity="0.5" />
      <rect x="22" y="75" width="8" height="4" fill="#2563EB" rx="1" />
      <rect x="36" y="75" width="90" height="4" fill="#1E40AF" rx="1" />
      <rect x="200" y="75" width="48" height="4" fill="#1E40AF" rx="1" />
      <rect x="16" y="84" width="288" height="14" fill="#DBEAFE" stroke="#2563EB" opacity="0.5" />
      <rect x="22" y="89" width="8" height="4" fill="#2563EB" rx="1" />
      <rect x="36" y="89" width="76" height="4" fill="#1E40AF" rx="1" />
      <rect x="200" y="89" width="52" height="4" fill="#1E40AF" rx="1" />
      <rect x="16" y="98" width="288" height="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <rect x="22" y="103" width="8" height="4" fill="#94A3B8" rx="1" />
      <rect x="36" y="103" width="86" height="4" fill="#CBD5E1" rx="1" />
      <rect x="16" y="112" width="288" height="14" fill="#DBEAFE" stroke="#2563EB" opacity="0.5" />
      <rect x="22" y="117" width="8" height="4" fill="#2563EB" rx="1" />
      <rect x="36" y="117" width="82" height="4" fill="#1E40AF" rx="1" />
      <rect x="16" y="130" width="288" height="14" fill="#0F172A" rx="3" />
      <rect x="24" y="135" width="50" height="4" fill="#FFFFFF" rx="1" opacity="0.9" />
      <rect x="84" y="135" width="30" height="4" fill="#FFFFFF" rx="1" opacity="0.5" />
    </svg>
  );
}

function CoverForm() {
  return (
    <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="150" fill="#F8FAFC" />
      <rect x="0" y="0" width="320" height="20" fill="#E2E8F0" />
      <rect x="10" y="6" width="60" height="8" fill="#CBD5E1" rx="1" />
      <circle cx="40" cy="50" r="12" fill="#2563EB" />
      <circle cx="120" cy="50" r="12" fill="#2563EB" />
      <circle cx="200" cy="50" r="12" fill="#CBD5E1" />
      <circle cx="280" cy="50" r="12" fill="#CBD5E1" />
      <line x1="52" y1="50" x2="108" y2="50" stroke="#2563EB" strokeWidth="2" />
      <line x1="132" y1="50" x2="188" y2="50" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="212" y1="50" x2="268" y2="50" stroke="#CBD5E1" strokeWidth="2" />
      <rect x="20" y="72" width="40" height="4" fill="#CBD5E1" rx="1" />
      <rect x="100" y="72" width="40" height="4" fill="#CBD5E1" rx="1" />
      <rect x="180" y="72" width="40" height="4" fill="#CBD5E1" rx="1" />
      <rect x="260" y="72" width="40" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="90" width="160" height="10" fill="#E2E8F0" rx="2" />
      <rect x="86" y="93" width="80" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="104" width="160" height="10" fill="#E2E8F0" rx="2" />
      <rect x="86" y="107" width="100" height="4" fill="#CBD5E1" rx="1" />
      <rect x="80" y="118" width="160" height="10" fill="#E2E8F0" rx="2" />
      <rect x="86" y="121" width="70" height="4" fill="#CBD5E1" rx="1" />
      <rect x="196" y="134" width="44" height="10" fill="#2563EB" rx="3" />
      <rect x="204" y="138" width="28" height="3" fill="#FFFFFF" rx="1" opacity="0.9" />
    </svg>
  );
}

const COVERS = [CoverChart, CoverTable, CoverBulkEdit, CoverForm] as const;

export function ProjectCardCover({
  slug,
  coverUrl,
}: {
  slug: string;
  coverUrl?: string;
}) {
  const Cover = COVERS[hash(slug) % COVERS.length];
  return (
    <div className="h-[150px] w-full overflow-hidden border-b bg-slate-100 [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
      {coverUrl ? (
        <img src={coverUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <Cover />
      )}
    </div>
  );
}
