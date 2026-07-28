export default function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-xl font-bold text-red-600">
        {title}
      </h2>

      <p className="mt-2 text-gray-600">
        {message}
      </p>
    </div>
  );
}