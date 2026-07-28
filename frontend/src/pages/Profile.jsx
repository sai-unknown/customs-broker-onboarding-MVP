import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import { getProfile } from "../api/userApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(false);
        const data = await getProfile();
        setUser(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading profile..." />
      </PageContainer>
    );
  }

  if (error || !user) {
    return (
      <PageContainer>
        <ErrorMessage
          title="Profile Unavailable"
          message="Unable to load your profile. Please refresh and try again."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="text-lg font-medium">{user.name}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="text-lg font-medium">{user.email}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="text-lg font-medium">{user.role}</dd>
          </div>
        </dl>
      </div>
    </PageContainer>
  );
}
