import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";
import useAuth from "../hooks/useAuth";
import { getDashboardStats } from "../api/dashboardApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Card from "../components/ui/Card";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalCustomers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your customs broker customers from your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <p className="text-gray-500">👥 Total Customers</p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {stats.totalCustomers}
          </h2>
        </Card>

        <Card>
          <p className="text-gray-500">👤 Logged In As</p>

          <h2 className="mt-3 text-2xl font-semibold">
            {user?.name}
          </h2>

          <p className="text-gray-500">
            {user?.email}
          </p>
        </Card>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          🚀 Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/customers/new"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            ➕ Add Customer
          </Link>

          <Link
            to="/customers"
            className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >
            👥 View Customers
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          📈 Recent Activity
        </h2>

        <p className="text-gray-500">
          Customer activity and analytics will appear here in a future update.
        </p>
      </div>
    </PageContainer>
  );
}