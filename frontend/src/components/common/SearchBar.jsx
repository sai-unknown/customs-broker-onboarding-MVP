export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="mb-6">
      <label htmlFor="customer-search" className="sr-only">
        Search customers
      </label>
      <input
        id="customer-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}
