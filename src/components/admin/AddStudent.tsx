import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addStudent, getClasses } from "../../services";
import { useAppSelector } from "../../store/hooks";
import { LinkRoutes } from "../../utils";

interface FormData {
  name: string;
  tuition: number;
  className: string;
}

function AddStudent() {
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
    const n = toast.loading("Adding student");
    try {
      const data = {
        name: watch("name"),
        tuition: watch("tuition"),
        className: watch("className"),
      };

      console.log(data);

      await addStudent(data);

      toast.success("Student created successfully!", { id: n });
      setErrorMessage("");
    } catch (err: any) {
      if (err === "Unauthorized") {
        navigate(LinkRoutes.LOGIN);
        window.location.reload();
      }
      const { status, msg } = err;
      if (status !== 200) setErrorMessage(msg);
      console.log(err);
      toast.error(`Error adding student: ${msg}`, { id: n });
    } finally {
      resetField("name");
      resetField("tuition");
    }
  });

  return (
    <div className="flex-1 md:mt-1 px-2">
      <h1 className="text-2xl font-semibold text-center mt-2">
        Create Student
      </h1>

      <form
        className="flex flex-col mt-4 p-5 max-w-2xl mx-auto"
        onSubmit={onSubmit}
      >
        <label className="p-2">
          <span>Name: </span>
          <input
            disabled={watch("className") === "Select Class"}
            {...register("name", { required: true })}
            type="text"
            placeholder="Enter name"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>

        <label className="p-2">
          <span>Class: </span>
          <select
            className="block border rounded shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
            {...register("className")}
            autoFocus
            defaultValue={`Select Class`}
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
          <span>Tuition: </span>
          <input
            disabled={watch("className") === "Select Class"}
            {...register("tuition", { required: true })}
            type="number"
            placeholder="Enter tuition"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>

        {(Object.keys(errors).length > 0 || errorMessage) && (
          <div className="space-y-2 p-2 text-red-500">
            {errors.name?.type === "required" && <p> - Name is required</p>}
            {errors.className?.type === "required" && (
              <p> - Class is required</p>
            )}
            {errors.tuition?.type === "required" && (
              <p> - Tuition is required</p>
            )}
            {errorMessage && <p>- {errorMessage}</p>}
          </div>
        )}

        <input
          type="submit"
          value="Create Student"
          className="w-full border rounded py-2 mt-5 bg-blue-400 text-white cursor-pointer"
        />
      </form>
    </div>
  );
}

export default AddStudent;
