import { FiMenu } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-2xl md:hidden"
          aria-label="Open navigation menu"
          onClick={() =>
            window.dispatchEvent(new Event("open-sidebar"))
          }
        >
          <FiMenu />
        </button>

        <h2 className="text-lg font-semibold md:text-xl">
          Customs Broker Dashboard
        </h2>
      </div>

      <div className="text-right">
        <p className="font-semibold">{user?.name}</p>

        <p className="hidden text-sm text-gray-500 md:block">
          {user?.email}
        </p>
      </div>
    </header>
  );
}