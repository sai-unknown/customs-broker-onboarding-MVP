import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import PageContainer from "../components/layout/PageContainer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { customerSchema } from "../validators/customerSchema";
import Input from "../components/ui/Input";

import {
  createCustomer,
  getCustomer,
  updateCustomer,
} from "../api/customerApi";

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loadingCustomer, setLoadingCustomer] = useState(isEdit);
  const [loadError, setLoadError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      gstin: "",
      type: "EXPORTER",
    },
  });

  useEffect(() => {
    if (!isEdit) return;

    async function loadCustomer() {
      try {
        setLoadingCustomer(true);
        setLoadError(false);
        const customer = await getCustomer(id);
        reset(customer);
      } catch {
        setLoadError(true);
        toast.error("Failed to load customer");
      } finally {
        setLoadingCustomer(false);
      }
    }

    loadCustomer();
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateCustomer(id, data);
      } else {
        await createCustomer(data);
      }

      toast.success(
        isEdit
          ? "Customer updated successfully"
          : "Customer created successfully"
      );

      navigate("/customers");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to save customer. Please try again."
      );
    }
  };

  if (loadingCustomer) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading customer..." />
      </PageContainer>
    );
  }

  if (loadError) {
    return (
      <PageContainer>
        <ErrorMessage
          title="Customer Not Found"
          message="The customer could not be loaded. It may have been deleted."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <Input
          label="Name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="GSTIN"
          error={errors.gstin?.message}
          {...register("gstin", {
            setValueAs: (value) => value.toUpperCase(),
          })}
        />

        <div>
          <label htmlFor="customer-type" className="block text-sm font-medium">
            Customer Type
          </label>
          <select
            id="customer-type"
            {...register("type")}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="EXPORTER">Exporter</option>
            <option value="IMPORTER">Importer</option>
          </select>
          {errors.type?.message && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.type.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Customer"
            : "Create Customer"}
        </button>
      </form>
    </PageContainer>
  );
}
