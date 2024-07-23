/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

const ProtectedRoute = (props: any) => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/signin");
    }
  }, [isLoggedIn, navigate]);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default ProtectedRoute;
