import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PublicLayout from "@/layout/PublicLayout";
import PrivateLayout from "@/layout/PrivateLayout";

const LayoutSelector = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <PrivateLayout>
        <Outlet />
      </PrivateLayout>
    );
  }

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default LayoutSelector;
