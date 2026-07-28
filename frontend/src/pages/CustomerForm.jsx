import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import PageContainer from "../components/layout/PageContainer";
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
      const customer = await getCustomer(id);
      reset(customer);
    }

    loadCustomer();
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
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
  };

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div>
          <label>Name</label>
          <Input
            label="Name"
            error={errors.name?.message}
            {...register("name")}
          />
          <p className="text-sm text-red-600">{errors.name?.message}</p>
        </div>

        <div>
          <label>Email</label>
          <Input
            label="Email"
            error={errors.email?.message}
            {...register("email")}
          />
          <p className="text-sm text-red-600">{errors.email?.message}</p>
        </div>

        <div>
          <label>GSTIN</label>
          <Input
            label="GSTIN"
            error={errors.gstin?.message}
            {...register("gstin")}
          />
          <p className="text-sm text-red-600">{errors.gstin?.message}</p>
        </div>

        <div>
          <label>Customer Type</label>
          <select
            {...register("type")}
            className="mt-1 w-full rounded border p-2"
          >
            <option value="EXPORTER">Exporter</option>
            <option value="IMPORTER">Importer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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