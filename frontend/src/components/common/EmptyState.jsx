import { Link } from "react-router-dom";

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 text-center">
      <div className="text-6xl">📂</div>

      <h2 className="mt-4 text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-2 text-gray-500">
        {description}
      </p>

      {buttonText && (
        <Link
          to={buttonLink}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}