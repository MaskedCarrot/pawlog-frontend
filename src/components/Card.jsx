/**
 * Shared card component for consistent layout across the app.
 * @param {string} title - Optional section title
 * @param {React.ReactNode} children - Card content
 * @param {boolean} list - If true, content is full-bleed list (no top/bottom padding)
 */
export default function Card({ title, children, list = false }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <div className={list ? 'divide-y divide-gray-100' : 'p-6'}>
        {children}
      </div>
    </section>
  );
}
