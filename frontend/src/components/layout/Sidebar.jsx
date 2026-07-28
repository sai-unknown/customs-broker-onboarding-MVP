import { NavLink, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openSidebar = () => setIsOpen(true);

    window.addEventListener("open-sidebar", openSidebar);

    return () => {
      window.removeEventListener("open-sidebar", openSidebar);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMenu}
          role="presentation"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-white p-5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
        aria-label="Main navigation"
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Broker Portal</h1>

          <button
            type="button"
            onClick={closeMenu}
            className="text-2xl md:hidden"
            aria-label="Close navigation menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            Dashboard
          </NavLink>

          <NavLink to="/customers" className={linkClass} onClick={closeMenu}>
            Customers
          </NavLink>

          <NavLink
            to="/customers/new"
            className={linkClass}
            onClick={closeMenu}
          >
            Add Customer
          </NavLink>

          <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
            Profile
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
