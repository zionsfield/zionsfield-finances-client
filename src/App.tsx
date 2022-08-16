import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ErrorBoundary from "./ErrorBoundary";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Super from "./pages/super";
import Unauthorized from "./pages/Unauthorized";
import { me } from "./services";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setUser } from "./store/userReducer";
import { get, LinkRoutes } from "./utils";
// import "./App.css";

function App() {
  const user = useAppSelector((state) => state.users.user);
  const dispatch = useAppDispatch();
  const updateUser = async () => {
    try {
      // const res = await get("users/me");
      // console.log(res.data);
      // console.log(res.data.msg);
      // const { date, lastLogin, lastPayment } = res.data.user;

      dispatch(setUser(await me()));
      // console.log(isAuthenticated());
      return true;
    } catch (err: any) {
      console.log(err.message);
      console.log(err.status);
      console.log(err.msg);
      console.log(err);
      return false;
    }
  };
  useEffect(() => {
    updateUser().then().catch();
    // eslint-disable-next-line
  }, []);
  const isAuthenticated = () => {
    return user ? true : false;
  };

  const isAdmin = () => {
    return user?.roles.every((r: string) => r === "ROLE_ADMIN");
  };

  const isSuperAdmin = () => {
    return user?.roles.includes("ROLE_SUPER_ADMIN");
  };

  const dashboard = (): string => {
    if (!user) return LinkRoutes.LOGIN;
    if (isAdmin()) return LinkRoutes.ADMIN;
    else if (isSuperAdmin()) return LinkRoutes.SUPER;
    return LinkRoutes.LOGIN;
  };

  const authorize = (authorizeMethod: any, Component: any) => {
    if (isAuthenticated()) {
      if (authorizeMethod()) {
        console.log("Authorized");
        return <Component dashboard={dashboard} />;
      } else {
        return <Navigate to={LinkRoutes.UNAUTHORIZED} />;
      }
    } else {
      console.log("Login");
      return <Navigate to={LinkRoutes.LOGIN} />;
    }
  };
  return (
    <ErrorBoundary>
      <div className="App h-screen overflow-y-scroll">
        <Toaster />
        <BrowserRouter>
          <Header isAuthenticated={isAuthenticated} dashboard={dashboard} />
          <Routes>
            <Route
              path={LinkRoutes.BASE}
              element={<Navigate to={LinkRoutes.DASHBOARD} />}
            />
            <Route
              path={LinkRoutes.LOGIN}
              element={
                !isAuthenticated() ? (
                  <Login dashboard={dashboard} />
                ) : (
                  <Navigate to={dashboard()} />
                )
              }
            />
            <Route
              path={LinkRoutes.DASHBOARD}
              element={<Navigate to={dashboard()} />}
            />
            <Route
              path={LinkRoutes.ADMIN}
              element={authorize(isAdmin, Admin)}
            />
            <Route
              path={LinkRoutes.SUPER}
              element={authorize(isSuperAdmin, Super)}
            />
            <Route
              path={LinkRoutes.UNAUTHORIZED}
              element={<Unauthorized dashboard={dashboard} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
