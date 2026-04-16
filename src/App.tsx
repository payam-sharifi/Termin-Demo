import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ToastProvider } from "./components/ui/ToastProvider";
import { Home } from "./pages/Home";
import { BookingConfirm } from "./pages/BookingConfirm";
import { BookingSuccess } from "./pages/BookingSuccess";
import { Legal } from "./pages/Legal";
import { Register } from "./pages/Register";
import { SignIn } from "./pages/SignIn";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route
          path="/"
          element={
            <AppShell>
              <Home />
            </AppShell>
          }
        />
        <Route
          path="/confirm"
          element={
            <AppShell>
              <BookingConfirm />
            </AppShell>
          }
        />
        <Route
          path="/booking/success"
          element={
            <AppShell>
              <BookingSuccess />
            </AppShell>
          }
        />
        <Route
          path="/legal"
          element={
            <AppShell>
              <Legal />
            </AppShell>
          }
        />
        <Route
          path="/signin"
          element={
            <AppShell>
              <SignIn />
            </AppShell>
          }
        />
        <Route
          path="/register"
          element={
            <AppShell>
              <Register />
            </AppShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
