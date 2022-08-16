import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addPayment, getClasses, getStudentNamesByClass } from "../../services";
import { useAppSelector } from "../../store/hooks";
import { LinkRoutes } from "../../utils";

interface FormData {
  studentName: string;
  amountPaid: number;
  className: string;
}

function AddPayment() {
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
  const [classes, setClasses] = useState<string[]>(null!);
  const [studentNames, setStudentNames] = useState<string[]>(null!);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setClasses(await getClasses());
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
    const n = toast.loading("Adding payment");
    try {
      const data = {
        studentName: watch("studentName"),
        amountPaid: watch("amountPaid"),
        className: watch("className"),
      };

      console.log(data);

      await addPayment(data);

      toast.success("Payment added successfully!", { id: n });
      setErrorMessage("");
    } catch (err: any) {
      if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
      const { status, msg } = err;
      if (status !== 200) setErrorMessage(msg);
      console.log(err);
      toast.error(`Error adding payment: ${msg}`, { id: n });
    } finally {
      resetField("studentName");
      resetField("amountPaid");
    }
  });

  return (
    <div className="flex-1 md:mt-1 px-2">
      <h1 className="text-2xl font-semibold text-center mt-2">Add Payment</h1>

      <form
        className="flex flex-col mt-4 p-5 max-w-2xl mx-auto"
        onSubmit={onSubmit}
      >
        <label className="p-2">
          <span>Name: </span>
          <select
            {...register("studentName")}
            defaultValue={`Select Name`}
            className="block border rounded shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          >
            <option>Select Name</option>
            {studentNames?.map((studentName) => (
              <option value={`${studentName}`} key={studentName}>
                {studentName}
              </option>
            ))}
          </select>
        </label>

        <label className="p-2">
          <span>Class: </span>
          <select
            className="block border rounded shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
            {...register("className")}
            autoFocus
            defaultValue={`Select Class`}
            onChange={async (e) =>
              setStudentNames(await getStudentNamesByClass(e.target.value))
            }
          >
            <option>Select Class</option>
            {classes?.map((className) => (
              <option value={`${className}`} key={className}>
                {className}
              </option>
            ))}
          </select>
        </label>

        <label className="p-2">
          <span>Amount Paid: </span>
          <input
            disabled={watch("className") === "Select Class"}
            {...register("amountPaid", { required: true })}
            type="number"
            placeholder="Enter amount paid"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>

        {(Object.keys(errors).length > 0 || errorMessage) && (
          <div className="space-y-2 p-2 text-red-500">
            {errors.studentName?.type === "required" && (
              <p> - Name is required</p>
            )}
            {errors.className?.type === "required" && (
              <p> - Class is required</p>
            )}
            {errors.amountPaid?.type === "required" && (
              <p> - Amount is required</p>
            )}
            {errorMessage && <p>- {errorMessage}</p>}
          </div>
        )}

        <input
          type="submit"
          value="Add Payment"
          disabled={
            watch("className") === "Select Class" ||
            watch("studentName") === "Select Name"
          }
          className="disabled:bg-gray-200 w-full border rounded py-2 mt-5 bg-blue-400 text-white cursor-pointer"
        />
      </form>
    </div>
  );
}

export default AddPayment;
