
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password length before login or registration.
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({
          email: form.email,
          password: form.password
        });
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-logo">
          <HeartPulse size={25} /> Sweety
        </div>

        <div className="auth-message">
          <span className="eyebrow">A LITTLE CARE, EVERY DAY</span>
          <h1>Stay connected to your health.</h1>
          <p>
            Keep your blood glucose readings in one simple, secure place.
          </p>

          <div className="auth-art">
            <div className="pulse-circle">
              <HeartPulse size={76} />
            </div>

            <div className="floating-stat">
              <span>Today's reminder</span>
              <strong>One step at a time ♥</strong>
            </div>
          </div>
        </div>

        <small className="auth-foot">
          Your personal glucose diary
        </small>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <span className="eyebrow">
            {isRegister ? "GET STARTED" : "WELCOME BACK"}
          </span>

          <h2>
            {isRegister ? "Create your account" : "Sign in to Sweety"}
          </h2>

          <p className="muted">
            {isRegister
              ? "Start keeping track of your daily readings."
              : "Enter your details to view your health dashboard."}
          </p>

          <form onSubmit={submit}>
            {isRegister && (
              <label>
                Full name
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                placeholder="At least 8 characters"
                required
              />
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="button button-primary button-wide"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "New to Sweety?"}

            {" "}

            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
