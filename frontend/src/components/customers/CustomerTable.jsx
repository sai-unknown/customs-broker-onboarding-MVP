import { Link } from "react-router-dom";

export default function CustomerTable({ customers, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <h2 className="text-xl font-semibold">
          No customers found
        </h2>

        <p className="mt-2 text-gray-500">
          Add your first customer.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">GSTIN</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="px-4 py-3">{customer.name}</td>
              <td className="px-4 py-3">{customer.email}</td>
              <td className="px-4 py-3">{customer.gstin}</td>
              <td className="px-4 py-3">{customer.type}</td>

              <td className="space-x-2 px-4 py-3 text-center">
                <Link
                  to={`/customers/${customer.id}/edit`}
                  className="rounded bg-blue-600 px-3 py-1 text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={() => onDelete(customer.id)}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}