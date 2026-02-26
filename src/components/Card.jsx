/**
 * Shared card component for consistent layout across the app.
 * @param {string} title - Optional section title
 * @param {React.ReactNode} children - Card content
 * @param {boolean} list - If true, content is full-bleed list (no top/bottom padding)
 * @param {React.ReactNode} headerAction - Optional content to show in header (e.g. Add button)
 * @param {React.ReactNode} headerSubtitle - Optional subtitle below title (e.g. progress)
 */
export default function Card({ title, children, list = false, headerAction, headerSubtitle }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200/60 overflow-hidden mb-6 shadow-card">
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900 tracking-tight">{title}</h2>
              {headerSubtitle && <p className="text-sm text-slate-500 mt-0.5">{headerSubtitle}</p>}
            </div>
            {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={list ? 'divide-y divide-slate-100' : 'p-6'}>
        {children}
      </div>
    </section>
  );
}
