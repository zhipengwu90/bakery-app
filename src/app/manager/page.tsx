import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getContent, getFeatured, getGallery } from "@/lib/content/server";
import { createClient } from "../utils/supabase/server";
import Dashboard from "./_components/Dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Website manager", robots: { index: false } };

export default async function ManagerPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/admin");

  const [menu, hours, settings, featured, gallery] = await Promise.all([
    getContent("menu"),
    getContent("hours"),
    getContent("settings"),
    getFeatured(true),
    getGallery(),
  ]);

  return <Dashboard data={{ email: data.user.email ?? "", menu, hours, settings, featured, gallery }} />;
}
