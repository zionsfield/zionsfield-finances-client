import React from "react";
import AddExpense from "../../components/admin/AddExpense";
import AddPayment from "../../components/admin/AddPayment";
import AddStudent from "../../components/admin/AddStudent";
import AdminMenu from "../../components/admin/AdminMenu";
import Dashboard from "../../components/admin/Dashboard";
import { useAppSelector } from "../../store/hooks";

function Admin() {
  const page = useAppSelector((state) => state.users.page);

  const loadPage = () => {
    switch (page) {
      case "DASHBOARD":
        return <Dashboard />;
      case "ADD_STUDENT":
        return <AddStudent />;
      case "ADD_PAYMENT":
        return <AddPayment />;
      case "ADD_EXPENSE":
        return <AddExpense />;
    }
  };
  return (
    <div className="flex flex-col space-y-7 max-w-5xl mx-auto">
      <AdminMenu />

      {loadPage()}
    </div>
  );
}

export default Admin;
