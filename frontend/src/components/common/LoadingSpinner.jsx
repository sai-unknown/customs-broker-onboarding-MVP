export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
