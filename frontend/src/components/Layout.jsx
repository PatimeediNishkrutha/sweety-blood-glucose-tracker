import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, LayoutDashboard, ClipboardList, ChartNoAxesCombined, LogOut, HeartPulse } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate("/login"); };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon"><HeartPulse size={23}/></span><span>Sweety</span></div>
        <p className="side-label">MENU</p>
        <nav>
          <NavLink to="/" end><LayoutDashboard size={18}/> Dashboard</NavLink>
          <NavLink to="/readings"><ClipboardList size={18}/> My readings</NavLink>
          <NavLink to="/reports"><ChartNoAxesCombined size={18}/> Reports</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-mini"><div className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div><div><strong>{user?.name}</strong><small>Patient account</small></div></div>
          <button className="logout-button" onClick={signOut}><LogOut size={17}/> Sign out</button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="topbar-kicker">YOUR HEALTH, YOUR JOURNEY</span><h1>Blood glucose tracker</h1></div><div className="topbar-user"><Activity size={18}/><span>{user?.name}</span></div></header>
        <div className="page-content"><Outlet/></div>
      </main>
    </div>
  );
}
