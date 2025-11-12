import { Outlet } from "react-router-dom";

function AuthLayout() {
<<<<<<< HEAD
  return <div>{/* login / signup pages layout */}</div>;
=======
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Outlet />
    </div>
  );
>>>>>>> feature/login-signup
}

export default AuthLayout;
