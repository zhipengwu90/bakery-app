"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../../../public/image/BrazenPoppy.png";
import { inputClass } from "../../manager/_components/ui";
import { createClient } from "../../utils/supabase/client";
import { login } from "./actions";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const sendReset = async () => {
    if (!email.trim()) {
      setError("Enter your email above first.");
      return;
    }
    setError("");
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    if (error) setError(error.message);
    else setNotice("Check your email for a link to set a new password.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        router.push("/manager");
        router.refresh();
        return;
      }
      setError(result.message || "Something went wrong. Please try again.");
    } catch {
      setError("Invalid login credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl shadow-ink/5">
          <Image src={logo} alt="Brazen Poppy Bakery" className="mx-auto h-20 w-auto" priority sizes="120px" />
          <h1 className="mt-6 text-center font-display text-3xl">Staff login</h1>
          <p className="mt-1 text-center text-sm text-ink-muted">Sign in to update the website.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </label>
            {error && (
              <p role="alert" className="rounded-xl bg-poppy-light px-4 py-2.5 text-sm font-medium text-poppy-dark">
                {error}
              </p>
            )}
            {notice && <p className="rounded-xl bg-leaf-light px-4 py-2.5 text-sm font-medium text-leaf-dark">{notice}</p>}
            <button type="submit" disabled={loading || !email || !password} className="btn-primary w-full !py-3.5">
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <button type="button" onClick={sendReset} className="block w-full text-center text-sm text-ink-muted hover:text-ink">
              Forgot password?
            </button>
          </form>
        </div>
        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted hover:text-ink">
          <FiArrowLeft /> Back to the website
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
