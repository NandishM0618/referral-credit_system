import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <div className="">
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
}
