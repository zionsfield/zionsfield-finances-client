import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/userReducer";
import { LinkRoutes, post } from "../utils";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import Menu from "./Menu";
import zionsfield from "../assets/images/ZionsfieldLogo.jpeg";

interface Props {
  isAuthenticated: () => boolean;
  dashboard: () => string;
}

function Header({ isAuthenticated, dashboard }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logout = async () => {
    await post("auth/logout");
    console.log("Logging out");
    dispatch(setUser(undefined));
    navigate(LinkRoutes.LOGIN);
    window.location.reload();
  };
  return (
    <div className="sticky max-w-7xl top-0 flex bg-slate-100 mx-auto justify-evenly items-center px-2 shadow-md  z-50">
      <Link to="/">
        <img
          className="w-10 lex-shrink-0 cursor-pointer"
          src={zionsfield}
          alt={"Company logo"}
        />
      </Link>
      <h1 className="text-2xl font-semibold">ZFI</h1>
      <div className="lg:flex space-x-8 hidden">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 text-sm xl:text-base"
              : "hover:text-blue-400 text-sm xl:text-base"
          }
          to={LinkRoutes.LOGIN}
        >
          LOGIN
        </NavLink>
        {isAuthenticated() && (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 text-sm xl:text-base"
                : "hover:text-blue-400 text-sm xl:text-base"
            }
            to={dashboard()}
          >
            DASHBOARD
          </NavLink>
        )}
        {isAuthenticated() && (
          <button
            className="hover:text-blue-400 text-sm xl:text-base"
            onClick={() => logout()}
          >
            LOGOUT
          </button>
        )}
      </div>
      <Menu
        open={open}
        setOpen={setOpen}
        isAuthenticated={isAuthenticated}
        logout={logout}
        dashboard={dashboard}
      />
      <div className="flex items-center lg:hidden">
        {open ? (
          <XIcon className="icon" onClick={() => setOpen(false)} />
        ) : (
          <MenuIcon className="icon" onClick={() => setOpen(true)} />
        )}
      </div>
    </div>
  );
}

export default Header;
