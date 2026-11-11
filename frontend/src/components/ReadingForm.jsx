import { useEffect, useState } from "react";

export const TIME_SLOTS = ["Morning (fasting)", "After breakfast", "After lunch", "After dinner"];
const today = new Date();
const localToday = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

export default function ReadingForm({ initialValue, onSubmit, onCancel }) {
  const [date, setDate] = useState(initialValue?.date?.slice(0,10) || localToday);
  const [timeSlot, setTimeSlot] = useState(initialValue?.timeSlot || TIME_SLOTS[0]);
  const [value, setValue] = useState(initialValue?.value ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialValue) { setDate(localToday); setTimeSlot(TIME_SLOTS[0]); setValue(""); }
  }, [initialValue]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (value === "") return setError("Please enter a glucose value.");
    if (!Number.isInteger(Number(value)) || Number(value) < 40 || Number(value) > 600) return setError("Value must be between 40 and 600 mg/dl.");
    if (!date) return setError("Please select a date.");
    if (date > localToday) return setError("Date cannot be in the future.");
    setSaving(true);
    try { await onSubmit({ date, timeSlot, value: Number(value) }); }
    catch (err) { setError(err.response?.data?.message || "Unable to save this reading."); }
    finally { setSaving(false); }
  };

  return (
    <form className="reading-form" onSubmit={submit}>
      <label>Date<input type="date" max={localToday} value={date} onChange={(e)=>setDate(e.target.value)} required/></label>
      <label>Time slot<select value={timeSlot} onChange={(e)=>setTimeSlot(e.target.value)}>{TIME_SLOTS.map((slot)=><option key={slot}>{slot}</option>)}</select></label>
      <label>Glucose value (mg/dl)<div className="input-with-unit"><input type="number" min="40" max="600" step="1" placeholder="e.g. 110" value={value} onChange={(e)=>setValue(e.target.value)} required/><span>mg/dl</span></div></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="button button-primary" disabled={saving}>{saving ? "Saving..." : initialValue ? "Update reading" : "Save reading"}</button>{onCancel && <button type="button" className="button button-light" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}
