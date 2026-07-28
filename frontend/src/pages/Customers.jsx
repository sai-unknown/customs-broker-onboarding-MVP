import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import CustomerTable from "../components/customers/CustomerTable";
import {
  getCustomers,
  deleteCustomer,
} from "../api/customerApi";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this customer?"
    );

    if (!confirmed) return;

    await deleteCustomer(id);

    loadCustomers();
  };

  if (loading) {
    return (
      <PageContainer>
        <h2>Loading...</h2>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">
        Customers
      </h1>

      <CustomerTable
        customers={customers}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}