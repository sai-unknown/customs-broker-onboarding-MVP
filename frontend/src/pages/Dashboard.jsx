import PageContainer from "../components/layout/PageContainer";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <h1 className="mb-2 text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p className="text-gray-600">
        Manage your customs broker customers from this dashboard.
      </p>
    </PageContainer>
  );
}