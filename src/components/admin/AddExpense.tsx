import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addExpense } from "../../services";
import { useAppSelector } from "../../store/hooks";
import { LinkRoutes } from "../../utils";

interface FormData {
  details: string;
  amountPaid: number;
}

function AddExpense() {
  const user = useAppSelector((state) => state.users.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    resetField,
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
      } catch (err: any) {
        if (err === "Unauthorized") {
          navigate(LinkRoutes.LOGIN);
          window.location.reload();
        }
        const { status, msg } = err;
        if (status !== 200) setErrorMessage(msg);
        console.log(err);
      }
    })();
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    const n = toast.loading("Adding expense");
    try {
      const data = {
        details: watch("details"),
        amountPaid: watch("amountPaid"),
      };

      console.log(data);

      const res = await addExpense(data);
      console.log(res);

      toast.success("Expense added successfully!", { id: n });
      setErrorMessage("");
    } catch (err: any) {
      const { status, msg } = err;
      if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
      if (status !== 200) setErrorMessage(msg);
      console.log(err);
      toast.error(`Error adding expense: ${msg}`, { id: n });
    } finally {
      resetField("details");
      resetField("amountPaid");
    }
  });

  return (
    <div className="flex-1 md:mt-1 px-2">
      <h1 className="text-2xl font-semibold text-center mt-2">Add Expense</h1>

      <form
        className="flex flex-col mt-4 p-5 max-w-2xl mx-auto"
        onSubmit={onSubmit}
      >
        <label className="p-2">
          <span>Details: </span>
          <input
            {...register("details", { required: true })}
            type="text"
            placeholder="Enter expense details"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>

        <label className="p-2">
          <span>Amount Paid: </span>
          <input
            {...register("amountPaid", { required: true })}
            type="number"
            placeholder="Enter amount paid"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>

        {(Object.keys(errors).length > 0 || errorMessage) && (
          <div className="space-y-2 p-2 text-red-500">
            {errors.details?.type === "required" && (
              <p> - Details is required</p>
            )}
            {errors.amountPaid?.type === "required" && (
              <p> - Amount is required</p>
            )}
            {errorMessage && <p>- {errorMessage}</p>}
          </div>
        )}

        <input
          type="submit"
          value="Add Expense"
          className="w-full border rounded py-2 mt-5 bg-blue-400 text-white cursor-pointer"
        />
      </form>
    </div>
  );
}

export default AddExpense;
