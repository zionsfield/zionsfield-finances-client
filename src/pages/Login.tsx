import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services";
import { LinkRoutes, post } from "../utils";

interface FormData {
  email: string;
  password: string;
}

interface Props {
  dashboard: () => string;
}

function Login({ dashboard }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await login(formData);
      navigate(LinkRoutes.DASHBOARD);
      window.location.reload();
    } catch (err: any) {
      const { status, msg } = err;
      if (status !== 200) setErrorMessage(msg);
      console.log(err);
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mt-5 text-center">Login</h1>

      <form
        className="flex flex-col mt-10 p-5 max-w-2xl mx-auto"
        onSubmit={onSubmit}
      >
        <label className="p-2">
          <span>Email: </span>
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="example@gmail.com"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>
        <label className="p-2">
          <span>Password: </span>
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Enter password"
            className="block border rounded form-input shadow ring-blue-400 px-4 py-3 w-full mt-1 outline-none focus:ring"
          />
        </label>

        {(Object.keys(errors).length > 0 || errorMessage) && (
          <div className="space-y-2 p-2 text-red-500">
            {errors.email?.type === "required" && <p> - Email is required</p>}
            {errors.password?.type === "required" && (
              <p> - Password is required</p>
            )}
            {errorMessage && <p>- {errorMessage}</p>}
          </div>
        )}

        <input
          type="submit"
          value="Login"
          className="w-full border rounded py-2 mt-5 bg-blue-400 text-white cursor-pointer"
        />
      </form>
    </div>
  );
}

export default Login;
