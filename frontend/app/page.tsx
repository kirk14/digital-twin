"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Activity, Shield, Zap, CheckCircle, ChevronRight, Star } from "lucide-react";
import { EKGLine } from "@/components/health/HeartbeatAnimation";
import { FloatingPulse } from "@/components/animations/FloatingPulse";
import { FadeIn } from "@/components/animations/FadeIn";
import { CinematicReveal, CinematicWordReveal } from "@/components/animations/CinematicReveal";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: Heart,
    title: "Real-Time Vitals",
    desc: "Monitor heart rate, oxygen, blood pressure and more. Instant alerts when anything needs attention.",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    icon: Activity,
    title: "Predictive Simulation",
    desc: "Simulate treatment plans and lifestyle changes. See how your decisions impact health outcomes over time.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Shield,
    title: "Risk Intelligence",
    desc: "AI-powered risk assessment identifying patterns before they become problems. Stay one step ahead.",
    color: "#22C55E",
    bg: "#F0FDF4",
  },
  {
    icon: Zap,
    title: "Device Integration",
    desc: "Seamlessly connects with Smartwatch, Smart Ring, and clinical wearables for complete health visibility.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

const steps = [
  { num: "01", title: "Connect Your Devices", desc: "Sync your wearables and medical devices in seconds." },
  { num: "02", title: "Build Your Digital Twin", desc: "AI constructs a personalized biological model of you." },
  { num: "03", title: "Monitor & Simulate", desc: "Track vitals and simulate treatments with real predictions." },
];

const stats = [
  { value: "99.4%", label: "Prediction Accuracy" },
  { value: "2.4M+", label: "Data Points Analyzed" },
  { value: "47 sec", label: "Average Alert Response" },
  { value: "12,000+", label: "Patients Monitored" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-dark">DigiTwin</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "How It Works", "Benefits"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-muted hover:text-dark transition-colors">
                {item}
              </a>
            ))}
          </nav>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2"
            >
              Launch Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-blue pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <CinematicReveal delay={0.1}>
            <Badge label="Now in Public Beta" color="blue" dot className="mb-6" />
          </CinematicReveal>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark leading-tight tracking-tight max-w-4xl mx-auto">
            <CinematicWordReveal text="Your Personal" delay={0.2} />{" "}
            <CinematicReveal delay={0.5} className="inline-block">
              <span className="text-gradient-blue inline-block">Digital Twin</span>
            </CinematicReveal>
            {" "}<CinematicWordReveal text="for Smarter Healthcare" delay={0.7} />
          </h1>
          
          <CinematicReveal delay={1.1}>
            <p className="mt-8 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              A predictive healthcare platform that creates a real-time biological model of you.
              Monitor vitals, simulate treatments, and get ahead of health risks — before they happen.
            </p>
          </CinematicReveal>
          <CinematicReveal delay={1.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(28,190,185,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-white font-semibold px-7 py-3 rounded-xl flex items-center gap-2.5 shadow-lg"
                >
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/twin">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-border text-dark font-medium px-7 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  View Digital Twin
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </CinematicReveal>

          {/* EKG animation strip */}
          <CinematicReveal delay={1.6}>
            <div className="mt-16 max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-card-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <FloatingPulse size={10} color="#EF4444" />
                <span className="text-xs font-semibold text-dark">Live ECG Monitor</span>
                <Badge label="Normal Sinus" color="green" dot className="ml-auto" />
              </div>
              <EKGLine color="#1CBEB9" />
              <div className="flex justify-between text-[10px] text-muted mt-2">
                <span>72 BPM</span>
                <span>98% SpO₂</span>
                <span>118/76 mmHg</span>
              </div>
            </div>
          </CinematicReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-border py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.05} direction="up">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-extrabold text-dark">{s.value}</p>
                  <p className="text-xs text-muted mt-1 font-medium">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-dark">Built for Healthcare Professionals</h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">
                Clinical-grade features designed for precision and reliability in demanding medical environments.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08} direction="up">
                <motion.div
                  className="health-card p-6 h-full"
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.09)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.bg }}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-dark mb-2">{f.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-dark">How It Works</h2>
              <p className="text-muted mt-3">Three steps to your personal digital health twin.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.1} direction="up">
                <div className="bg-white rounded-2xl border border-border shadow-card p-6">
                  <div className="text-3xl font-extrabold text-primary/20 mb-4">{s.num}</div>
                  <h3 className="text-sm font-bold text-dark mb-2">{s.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits CTA */}
      <section id="benefits" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn direction="up">
            <div className="bg-primary rounded-3xl p-10 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 relative">
                Ready to meet your Digital Twin?
              </h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto relative text-sm">
                Join 12,000+ healthcare professionals using DigiTwin for smarter, faster, data-driven care.
              </p>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-primary font-bold px-8 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto relative"
                >
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-dark">DigiTwin</span>
            <span className="text-xs text-muted ml-1">Healthcare AI Platform</span>
          </div>
          <p className="text-xs text-muted">© 2026 DigiTwin Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
