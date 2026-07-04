import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/student/DashboardPage";
import ProfilePage from "./pages/student/ProfilePage";
import DiningPage from "./pages/student/DiningPage";
import TodayTokensPage from "./pages/student/TodayTokensPage";
import WalletPage from "./pages/student/WalletPage";
import RoomAllotmentPage from "./pages/student/RoomAllotmentPage";
import FeedbackPage from "./pages/student/FeedbackPage";
import SupportPage from "./pages/student/SupportPage";
import HallDashboard from "./pages/admin/hall/HallDashboard";
import HallAllotments from "./pages/admin/hall/HallAllotments";
import HallStudents from "./pages/admin/hall/HallStudents";
import HallTickets from "./pages/admin/hall/HallTickets";
// Placeholder for upcoming pages
const Placeholder = ({ title }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f1f5f9",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚧</div>
      <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
        {title}
      </div>
      <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
        Coming soon...
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["student"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["student"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dining"
        element={
          <ProtectedRoute roles={["student"]}>
            <DiningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dining/today"
        element={
          <ProtectedRoute roles={["student"]}>
            <TodayTokensPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dining/review"
        element={
          <ProtectedRoute roles={["student"]}>
            <Placeholder title="Dining Review" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute roles={["student"]}>
            <WalletPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room"
        element={
          <ProtectedRoute roles={["student"]}>
            <RoomAllotmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hall-fee"
        element={
          <ProtectedRoute roles={["student"]}>
            <Placeholder title="Hall Fee" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute roles={["student"]}>
            <FeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute roles={["student"]}>
            <SupportPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      {/* Hall Admin Routes */}
      <Route
        path="/admin/hall"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <HallDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hall/allotments"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <HallAllotments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hall/students"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <HallStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hall/dining"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <Placeholder title="Dining Management" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hall/tickets"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <HallTickets />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
