import React, { SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { LinkRoutes } from "../utils";

interface Props {
  setOpen: (value: SetStateAction<boolean>) => void;
  open: boolean;
  isAuthenticated: () => boolean;
  logout: () => void;
  dashboard: () => string;
}

function Menu({ open, setOpen, isAuthenticated, dashboard, logout }: Props) {
  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } justify-center h-screen p-8 absolute 
      top-12 left-0 transition transform ease-in-out duration-300 w-full flex-col space-y-4 bg-white z-50 lg:hidden`}
    >
      <NavLink
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          isActive
            ? "text-blue-400 text-sm xl:text-base block"
            : "hover:text-blue-400 text-sm xl:text-base block"
        }
        to={LinkRoutes.LOGIN}
      >
        LOGIN
      </NavLink>
      {isAuthenticated() && (
        <NavLink
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 text-sm xl:text-base block"
              : "hover:text-blue-400 text-sm xl:text-base block"
          }
          to={dashboard()}
        >
          DASHBOARD
        </NavLink>
      )}
      {isAuthenticated() && (
        <button
          className="hover:text-blue-400 text-sm xl:text-base block"
          onClick={() => logout()}
        >
          LOGOUT
        </button>
      )}
    </div>
  );
}

export default Menu;
