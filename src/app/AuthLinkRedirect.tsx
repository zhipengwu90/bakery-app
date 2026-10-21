"use client";

import { useEffect } from "react";

// Recovery/invite emails sent from the Supabase dashboard land on the Site URL
// (usually the homepage) with the session in the hash. Send them on to the
// page that lets staff set a password.
export default function AuthLinkRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (window.location.pathname === "/admin/reset-password") return;
    if (/[#&]type=(recovery|invite)\b/.test(hash) || /[#&]error_code=/.test(hash)) {
      window.location.replace(`/admin/reset-password${hash}`);
    }
  }, []);
  return null;
}
