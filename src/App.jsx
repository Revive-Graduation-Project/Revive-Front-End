import { Route, Routes } from "react-router";
import { AppLayout , AuthLayout } from "./Layout";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Define your app pages routes here */}
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          {/* Define your auth pages routes here */}
        </Route>
      </Routes>
  );
}
