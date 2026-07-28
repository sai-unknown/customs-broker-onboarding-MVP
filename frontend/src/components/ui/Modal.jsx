export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  footer,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="px-6 py-4">
          {children}
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}