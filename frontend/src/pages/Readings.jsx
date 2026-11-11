import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../api";
import ReadingForm from "../components/ReadingForm";
import { ReadingTable, EmptyState } from "./Dashboard";

export default function Readings() {
  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const load = async () => {
    try { const {data} = await api.get("/readings?limit=100"); setReadings(data.readings); setError(""); }
    catch (err) { setError(err.response?.data?.message || "Unable to load readings."); }
  };
  useEffect(() => { load(); }, []);
  const save = async (payload) => {
    if (editing) await api.put(`/readings/${editing.id}`, payload);
    else await api.post("/readings", payload);
    setShowForm(false); setEditing(null); setNotice(editing ? "Reading updated." : "Reading added."); await load();
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this reading? This action cannot be undone.")) return;
    try { await api.delete(`/readings/${id}`); setNotice("Reading deleted."); await load(); }
    catch (err) { setError(err.response?.data?.message || "Unable to delete reading."); }
  };
  const startEdit = (reading) => { setEditing(reading); setShowForm(true); setNotice(""); };
  return (
    <div className="stack-lg">
      <section className="page-title-row"><div><span className="eyebrow">YOUR GLUCOSE LOG</span><h2>My readings</h2><p className="muted">Add and manage up to four readings each day.</p></div><button className="button button-primary" onClick={()=>{setEditing(null);setShowForm(!showForm);}}><Plus size={17}/> Add reading</button></section>
      {notice && <div className="alert-success">{notice}</div>}{error && <div className="alert-error">{error}</div>}
      {showForm && <section className="panel form-panel"><div className="section-heading"><div><h3>{editing ? "Edit reading" : "Add a reading"}</h3><p className="muted">Enter your date, time slot and glucose value.</p></div><button className="icon-button" onClick={()=>{setShowForm(false);setEditing(null);}} aria-label="Close form"><X size={18}/></button></div><ReadingForm key={editing?.id || "new"} initialValue={editing} onSubmit={save} onCancel={()=>{setShowForm(false);setEditing(null);}}/></section>}
      <section className="panel"><div className="section-heading"><div><h3>All readings</h3><p className="muted">{readings.length} saved {readings.length === 1 ? "reading" : "readings"}</p></div></div>
        {readings.length ? <ReadingTable readings={readings} actions={(r)=><div className="table-actions"><button className="icon-button" aria-label="Edit reading" onClick={()=>startEdit(r)}><Pencil size={16}/></button><button className="icon-button danger" aria-label="Delete reading" onClick={()=>remove(r.id)}><Trash2 size={16}/></button></div>}/>:<EmptyState/>}
      </section>
    </div>
  );
}
