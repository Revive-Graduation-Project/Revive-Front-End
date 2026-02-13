import { Route, Routes, Navigate } from "react-router";
import { AppLayout, AuthLayout } from "./Layout";
import { Login, Signup } from "./pages";
import { useAuthInit } from "./hooks/useAuthInit";
// import { useAuthStore } from "./store";
// import { LoadingSpinner } from "./components";
import Customization from "./pages/customization/Customization";

export default function App() {
  useAuthInit();

  // const { isAuthenticated, loading } = useAuthStore();

  // if (loading) {
  //   return (
  //      <div className="min-h-screen flex items-center justify-center">
  //       <LoadingSpinner />
  //      </div>
  //   )
  // }

  return (
    <Routes>
      {/* App Routes - Protected */}
      {/* <Route path="/" element={
        isAuthenticated ? <AppLayout /> : <Navigate to="/auth/login" replace />
      }>
        <Route index element={<Home />} />
      </Route> */}
      <Route path="/customize" element={<AppLayout />}>
        <Route index element={<Customization />} />
      </Route>

      {/* Auth Routes - Always accessible */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      {/*  If user types /random-page-that-doesnt-exist this route below catches it 
       If authenticated → Redirects to / (home) 
      If NOT authenticated → Redirects to /auth/login */}
      {/* <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/" : "/auth/login"} replace />
        }
      /> */}
    </Routes>
  );
}
