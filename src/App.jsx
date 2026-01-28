import { Route, Routes } from "react-router";
import { AppLayout, AuthLayout } from "./Layout";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useAuthInit } from "./hooks/useAuthInit";

export default function App() {
  useAuthInit();

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Define your app pages routes here */}
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        {/* Define your auth pages routes here */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}
