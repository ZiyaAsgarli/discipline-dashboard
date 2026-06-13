import type { Metadata } from "next";
import LandingContent from "@/components/LandingContent";

export const metadata: Metadata = {
  title: "Discipline Dashboard — RPG Career & Discipline Tracker",
  description: "Full-stack RPG-based discipline, career tracking, and analytics dashboard built with Next.js, Supabase, and PostgreSQL.",
};

export default function LandingPage() {
  return <LandingContent />;
}
