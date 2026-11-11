import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Readings from "./pages/Readings";
import Reports from "./pages/Reports";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/" : "/login"} replace />;
}

function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<AuthPage mode="login"/>}/>
    <Route path="/register" element={<AuthPage mode="register"/>}/>
    <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/readings" element={<Readings/>}/>
      <Route path="/reports" element={<Reports/>}/>
    </Route>
    <Route path="*" element={<RootRedirect/>}/>
  </Routes>;
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes/></BrowserRouter></AuthProvider>;
}
