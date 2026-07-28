import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white p-5">
      <h1 className="mb-8 text-2xl font-bold text-blue-600">
        Broker Portal
      </h1>

      <nav className="space-y-2">
        <NavLink to="/" end className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/customers" className={linkClass}>
          👥 Customers
        </NavLink>

        <NavLink to="/customers/new" className={linkClass}>
          ➕ Add Customer
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          👤 Profile
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="mt-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}