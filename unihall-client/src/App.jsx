import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardPage from "./pages/student/DashboardPage";
import ProfilePage from "./pages/student/ProfilePage";
import DiningPage from "./pages/student/DiningPage";
import TodayTokensPage from "./pages/student/TodayTokensPage";
import DiningReviewPage from "./pages/student/DiningReviewPage";
import WalletPage from "./pages/student/WalletPage";
import RoomAllotmentPage from "./pages/student/RoomAllotmentPage";
import HallFeePage from "./pages/student/HallFeePage";
import FeedbackPage from "./pages/student/FeedbackPage";
import SupportPage from "./pages/student/SupportPage";
import HallDashboard from "./pages/admin/hall/HallDashboard";
import HallAllotments from "./pages/admin/hall/HallAllotments";
import HallStudents from "./pages/admin/hall/HallStudents";
import HallTickets from "./pages/admin/hall/HallTickets";
import HallDining from "./pages/admin/hall/HallDining";
import HallFees from "./pages/admin/hall/HallFees";
import HallRooms from "./pages/admin/hall/HallRooms";
import UniversityAdminDashboard from "./pages/admin/university/UniversityAdminDashboard";
import UniversityAdminHalls from "./pages/admin/university/UniversityAdminHalls";
import CrossHallReport from "./pages/admin/university/CrossHallReport";
import SuperAdminDashboard from "./pages/admin/super/SuperAdminDashboard";
import SuperAdminUniversities from "./pages/admin/super/SuperAdminUniversities";
import SuperAdminUsers from "./pages/admin/super/SuperAdminUsers";
import UniversityDetail from "./pages/admin/super/UniversityDetail";
import HallDetail from "./pages/admin/super/HallDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
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
            <DiningReviewPage />
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
            <HallFeePage />
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
            <HallDining />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hall/fees"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <HallFees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hall/rooms"
        element={
          <ProtectedRoute roles={["hallAdmin"]}>
            <HallRooms />
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

      {/* University Admin Routes */}
      <Route
        path="/admin/university"
        element={
          <ProtectedRoute roles={["universityAdmin"]}>
            <UniversityAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/university/halls"
        element={
          <ProtectedRoute roles={["universityAdmin"]}>
            <UniversityAdminHalls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/university/report"
        element={
          <ProtectedRoute roles={["universityAdmin"]}>
            <CrossHallReport />
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/admin/super"
        element={
          <ProtectedRoute roles={["superAdmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/super/universities"
        element={
          <ProtectedRoute roles={["superAdmin"]}>
            <SuperAdminUniversities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/super/universities/:id"
        element={
          <ProtectedRoute roles={["superAdmin"]}>
            <UniversityDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/super/halls/:id"
        element={
          <ProtectedRoute roles={["superAdmin"]}>
            <HallDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/super/users"
        element={
          <ProtectedRoute roles={["superAdmin"]}>
            <SuperAdminUsers />
          </ProtectedRoute>
        }
      />

      {/* Catch-all — must stay LAST */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
