import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChartNoAxesCombined } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api";

function today() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
export default function Reports() {
  const [date,setDate]=useState(today());
  const [type,setType]=useState("daily");
  const [report,setReport]=useState(null);
  const [monthly,setMonthly]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{ api.get(`/reports/${type}?date=${date}`).then(({data})=>{setReport(data);setError("");}).catch(err=>setError(err.response?.data?.message||"Unable to load report.")); },[date,type]);
  useEffect(()=>{ api.get("/readings?limit=100").then(({data})=>setMonthly(data.readings)).catch(()=>{}); },[]);
  const chartData=useMemo(()=>monthly.filter(r=>r.date.slice(0,7)===date.slice(0,7)).map(r=>({date:r.date.slice(8,10),slot:r.timeSlot,value:r.value,label:`${r.date.slice(8,10)} · ${r.timeSlot}`})),[monthly,date]);
  const title=type==="daily"?"Daily report":type==="month-to-date"?"Month-to-date report":"Previous month report";
  return (
    <div className="stack-lg">
      <section className="page-title-row"><div><span className="eyebrow">INSIGHTS & TRENDS</span><h2>Reports</h2><p className="muted">Review your glucose readings over time.</p></div><div className="report-date"><CalendarDays size={17}/><input aria-label="Report date" type="date" max={today()} value={date} onChange={e=>setDate(e.target.value)}/></div></section>
      <div className="report-tabs">{[["daily","Daily"],["month-to-date","Month to date"],["monthly","Previous month"]].map(([v,label])=><button key={v} className={type===v?"active":""} onClick={()=>setType(v)}>{label}</button>)}</div>
      {error&&<div className="alert-error">{error}</div>}
      {report&&<><section className="report-heading"><div><h3>{title}</h3><p className="muted">{formatDate(report.range.start)} – {formatDate(report.range.end)}</p></div><span className="count-pill">{report.summary.count} readings</span></section>
      <section className="stat-grid report-stats"><ReportStat label="Highest" value={report.summary.highest}/><ReportStat label="Lowest" value={report.summary.lowest}/><ReportStat label="Average" value={report.summary.average}/><ReportStat label="Total readings" value={report.summary.count} unit="entries"/></section>
      {report.summary.count===0?<div className="panel empty-state"><div className="empty-icon">♡</div><h3>No readings found</h3><p>There are no glucose readings in this report period.</p></div>:type==="daily"?<section className="panel"><h3>Readings for the day</h3><div className="daily-list">{report.readings.map(r=><div className="daily-item" key={r.id}><span className="slot-dot"/><span>{r.timeSlot}</span><strong>{r.value} <small>mg/dl</small></strong></div>)}</div></section>:<section className="panel"><div className="section-heading"><div><h3>Glucose trend</h3><p className="muted">Readings recorded in the selected month</p></div><ChartNoAxesCombined size={20}/></div>{chartData.length?<div className="chart-area"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label" hide/><YAxis/><Tooltip/><Line type="monotone" dataKey="value" stroke="#6e69d7" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div>:<p className="empty-inline">No chart data available for the selected month.</p>}</section>}
      </>}
      <p className="medical-note">This tracker is for record-keeping only. It does not provide medical advice or diagnose conditions. Discuss your readings with your healthcare professional.</p>
    </div>
  );
}
function ReportStat({label,value,unit="mg/dl"}){return <div className="stat-card report-stat"><span className="stat-label">{label}</span><div className="stat-value">{value??"—"}<small>{value===null?"":unit}</small></div></div>;}
function formatDate(value){return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});}
