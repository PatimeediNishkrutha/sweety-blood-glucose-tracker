import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, CalendarDays, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";

function dateToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api.get(`/reports/daily?date=${dateToday()}`), api.get("/readings?limit=5")])
      .then(([r, readings]) => { setReport(r.data); setRecent(readings.data.readings); })
      .catch((err) => setError(err.response?.data?.message || "Unable to load dashboard."));
  }, []);
  const summary = report?.summary;
  return (
    <div className="stack-lg">
      <section className="welcome-row"><div><span className="eyebrow">YOUR DAILY OVERVIEW</span><h2>Hello, {user?.name?.split(" ")[0]} <span className="wave">✦</span></h2><p className="muted">A quick look at your glucose readings for today.</p></div><Link to="/readings" className="button button-primary"><Plus size={17}/> Add reading</Link></section>
      {error && <div className="alert-error">{error}</div>}
      <section className="stat-grid">
        <Stat icon={<TrendingUp/>} label="Highest reading" value={summary?.highest ?? "—"} unit="mg/dl" tone="peach"/>
        <Stat icon={<TrendingDown/>} label="Lowest reading" value={summary?.lowest ?? "—"} unit="mg/dl" tone="mint"/>
        <Stat icon={<Activity/>} label="Average reading" value={summary?.average ?? "—"} unit="mg/dl" tone="lavender"/>
        <Stat icon={<CalendarDays/>} label="Readings today" value={summary?.count ?? "—"} unit="of 4 slots" tone="blue"/>
      </section>
      <section className="panel">
        <div className="section-heading"><div><h3>Today's readings</h3><p className="muted">Your latest blood glucose entries</p></div><Link to="/readings" className="text-link">View all <ArrowUpRight size={15}/></Link></div>
        {report?.readings?.length ? <ReadingTable readings={report.readings}/> : report && <EmptyState/>}
      </section>
      <section className="tip-banner"><div className="tip-icon">♡</div><div><strong>Small steps make a difference</strong><p>Record your readings regularly to build a useful picture over time. Discuss results and treatment decisions with your healthcare professional.</p></div></section>
      <section className="panel"><div className="section-heading"><div><h3>Recent activity</h3><p className="muted">Your most recent saved readings</p></div><Link to="/readings" className="text-link">Manage readings <ArrowUpRight size={15}/></Link></div>{recent.length ? <ReadingTable readings={recent}/> : <p className="empty-inline">No readings recorded yet.</p>}</section>
    </div>
  );
}
function Stat({icon,label,value,unit,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-label">{label}</span><div className="stat-value">{value}<small>{unit}</small></div></div>; }
export function ReadingTable({readings, actions}) {
  return <div className="table-wrap"><table><thead><tr><th>Date</th><th>Time slot</th><th>Glucose</th>{actions && <th>Actions</th>}</tr></thead><tbody>{readings.map(r=><tr key={r.id}><td>{new Date(`${r.date.slice(0,10)}T00:00:00`).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td><td>{r.timeSlot}</td><td><strong>{r.value}</strong> <span className="unit">mg/dl</span></td>{actions && <td>{actions(r)}</td>}</tr>)}</tbody></table></div>;
}
export function EmptyState() { return <div className="empty-state"><div className="empty-icon">♡</div><h3>No readings yet</h3><p>Start by adding your first blood glucose reading.</p><Link to="/readings" className="button button-primary">Add your first reading</Link></div>; }
