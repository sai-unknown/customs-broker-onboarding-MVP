import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-xl font-semibold">
        Customs Broker Dashboard
      </h2>

      <div className="text-right">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>
    </header>
  );
}