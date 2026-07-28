import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import PageContainer from "../components/layout/PageContainer";
import CustomerTable from "../components/customers/CustomerTable";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

import {
  getCustomers,
  deleteCustomer,
} from "../api/customerApi";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const ITEMS_PER_PAGE = 5;

  const loadCustomers = async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      setError(true);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = (id) => {
    setCustomerToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(customerToDelete);

      toast.success("Customer deleted");

      if (paginatedCustomers.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }

      await loadCustomers();
    } catch {
      toast.error("Unable to delete customer. Please try again.");
    } finally {
      setCustomerToDelete(null);
    }
  };

  // Search
  const filteredCustomers = customers.filter((customer) => {
    const term = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.gstin.toLowerCase().includes(term)
    );
  });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Loading
  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  // Error
  if (error) {
    return (
      <PageContainer>
        <ErrorMessage
          title="Unable to Load Customers"
          message="Please refresh the page and try again."
        />
      </PageContainer>
    );
  }

  // Empty State
  if (filteredCustomers.length === 0) {
    return (
      <PageContainer>
        <h1 className="mb-6 text-3xl font-bold">
          Customers
        </h1>

        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, email or GSTIN..."
        />

        <EmptyState
          title={
            search
              ? "No Matching Customers"
              : "No Customers Yet"
          }
          description={
            search
              ? "Try searching with a different name, email or GSTIN."
              : "You haven't added any customers yet."
          }
          buttonText={
            search ? null : "Add Customer"
          }
          buttonLink="/customers/new"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">
        Customers
      </h1>

      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        placeholder="Search by name, email or GSTIN..."
      />

      <p className="mb-4 text-sm text-gray-500">
        Showing{" "}
        {startIndex + 1}–
        {Math.min(
          startIndex + ITEMS_PER_PAGE,
          filteredCustomers.length
        )}{" "}
        of {filteredCustomers.length} customers
      </p>

      <CustomerTable
        customers={paginatedCustomers}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={customerToDelete !== null}
        title="Delete Customer"
        onClose={() => setCustomerToDelete(null)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setCustomerToDelete(null)}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this customer?
        </p>

        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone.
        </p>
      </Modal>
    </PageContainer>
  );
}