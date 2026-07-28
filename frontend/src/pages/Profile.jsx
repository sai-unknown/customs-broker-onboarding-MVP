import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import { getProfile } from "../api/userApi";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();
      setUser(data);
    }

    loadProfile();
  }, []);

  if (!user) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">
          My Profile
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium">{user.role}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}