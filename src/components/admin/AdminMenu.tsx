import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPage } from "../../store/userReducer";

function AdminMenu() {
  const page = useAppSelector((state) => state.users.page);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white mx-2 sticky top-20 z-40 shadow shadow-gray-500 flex overflow-x-scroll scrollbar-hide">
      {/* sticky top-[80px] */}
      {/* sticky top-[96px] */}
      {/* sticky top-[112px] */}
      <button
        className={`sticky ${
          page === "DASHBOARD" && "text-blue-400 border-b border-blue-400"
        } mr-2 px-4 py-2 hover:text-blue-400 hover:border-b hover:border-blue-400 transform ease-in duration-300`}
        onClick={() => dispatch(setPage("DASHBOARD"))}
        // style={{ top: "5rem" }}
      >
        Dashboard
      </button>
      <button
        className={`sticky ${
          page === "ADD_STUDENT" && "text-blue-400 border-b border-blue-400"
        } mr-2 px-6 py-2 hover:text-blue-400 hover:border-b hover:border-blue-400 transform ease-in duration-300`}
        onClick={() => dispatch(setPage("ADD_STUDENT"))}
        // style={{ top: "6rem" }}
      >
        Add Student
      </button>
      <button
        className={`sticky ${
          page === "ADD_PAYMENT" && "text-blue-400 border-b border-blue-400"
        } mr-2 px-6 py-2 hover:text-blue-400 hover:border-b hover:border-blue-400 transform ease-in duration-300`}
        onClick={() => dispatch(setPage("ADD_PAYMENT"))}
        // style={{ top: "6rem" }}
      >
        Add Payment
      </button>
      {/* //COMPLETED_DELIVERIES */}
      <button
        className={`sticky ${
          page === "ADD_EXPENSE" && "text-blue-400 border-b border-blue-400"
        } mr-2 px-6 py-2 hover:text-blue-400 hover:border-b hover:border-blue-400 transform ease-in duration-300`}
        onClick={() => dispatch(setPage("ADD_EXPENSE"))}
        // style={{ top: "7rem" }}
      >
        Add Expense
      </button>
    </div>
  );
}

export default AdminMenu;
