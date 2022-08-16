import React from "react";
import Dashboard from "../../components/super/Dashboard";
import SuperMenu from "../../components/super/SuperMenu";
import ViewExpenses from "../../components/super/ViewExpenses";
import ViewPayments from "../../components/super/ViewPayments";
import ViewStudents from "../../components/super/ViewStudents";
import { useAppSelector } from "../../store/hooks";

function Super() {
  const page = useAppSelector((state) => state.users.page);

  const loadPage = () => {
    switch (page) {
      case "DASHBOARD":
        return <Dashboard />;
      case "VIEW_STUDENTS":
        return <ViewStudents />;
      case "VIEW_PAYMENTS":
        return <ViewPayments />;
      case "VIEW_EXPENSES":
        return <ViewExpenses />;
    }
  };
  return (
    <div className="flex flex-col space-y-7 max-w-5xl mx-auto">
      <SuperMenu />

      {loadPage()}
    </div>
  );
}

export default Super;
