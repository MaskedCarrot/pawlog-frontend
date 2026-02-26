export default function DeleteButton({ onClick, deleting, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deleting}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {deleting && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 block overflow-hidden">
          <span className="block h-full w-1/2 bg-current opacity-60 animate-delete-progress" />
        </span>
      )}
    </button>
  );
}
