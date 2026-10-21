"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../../../public/image/BrazenPoppy.webp";
import { inputClass } from "../../manager/_components/ui";
import { createClient } from "../../utils/supabase/client";

// Landing page for password-recovery and invite emails. Links sent from the
// Supabase dashboard carry the session in the URL hash (#access_token=…);
// links from "Forgot password?" carry ?code=…, which the client exchanges itself.
const ResetPasswordPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const hash = new URLSearchParams(window.location.hash.slice(1));

    (async () => {
      if (hash.get("error_description")) {
        setLinkError(hash.get("error_description")!.replace(/\+/g, " "));
        setStatus("invalid");
        return;
      }
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Keep tokens out of the address bar and browser history.
        window.history.replaceState(null, "", window.location.pathname);
        setStatus(error ? "invalid" : "ready");
        return;
      }
      const { data } = await supabase.auth.getSession();
      setStatus(data.session ? "ready" : "invalid");
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("The passwords don't match.");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    router.push("/manager");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl shadow-ink/5">
          <Image src={logo} alt="Brazen Poppy Bakery" className="mx-auto h-20 w-auto" priority sizes="120px" />
          <h1 className="mt-6 text-center font-display text-3xl">Set a new password</h1>

          {status === "checking" && <p className="mt-6 text-center text-sm text-ink-muted">Checking your link…</p>}

          {status === "invalid" && (
            <div className="mt-6 space-y-4 text-center">
              <p role="alert" className="rounded-xl bg-poppy-light px-4 py-2.5 text-sm font-medium text-poppy-dark">
                {linkError || "This link has expired or was already used."}
              </p>
              <Link href="/admin" className="btn-primary w-full !py-3.5">
                Back to login
              </Link>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">Confirm password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
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
              <button type="submit" disabled={saving || !password || !confirm} className="btn-primary w-full !py-3.5">
                {saving ? "Saving…" : "Save and sign in"}
              </button>
            </form>
          )}
        </div>
        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted hover:text-ink">
          <FiArrowLeft /> Back to the website
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
