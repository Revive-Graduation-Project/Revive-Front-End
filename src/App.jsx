import { Route, Routes } from "react-router";
import { AppLayout, AuthLayout } from "./Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Define your app pages routes here */}
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}
