import React from "react";
import { useAppSelector } from "../../store/hooks";

function Dashboard() {
  const user = useAppSelector((state) => state.users.user);

  return (
    <div className="flex flex-col flex-1 items-center">
      <h1 className="font-bold text-2xl lg:text-3xl text-center py-2">
        Welcome, {user?.name}
      </h1>
      <p className="text-xl">Click the buttons to switch navigation</p>
    </div>
  );
}

export default Dashboard;
