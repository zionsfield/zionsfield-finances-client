import React, { useEffect } from "react";
// import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Props {
  dashboard: () => string;
}

function Unauthorized({ dashboard }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(dashboard());
  });

  return (
    <div>
      <Header isAuthenticated={() => true} dashboard={dashboard} />
    </div>
  );
}

export default Unauthorized;
