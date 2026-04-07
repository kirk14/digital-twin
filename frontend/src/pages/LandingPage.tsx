import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6">
      <div className="max-w-3xl w-full glass-panel p-10 md:p-14 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Clinical Digital Twin</p>
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-5">
          Health Simulation Console
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Launch the real-time dashboard, run treatment simulations, and inspect AI-driven clinical signals.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-primary/15 border border-primary text-primary font-technical uppercase tracking-widest text-xs hover:bg-primary/25 transition-colors"
          >
            Open Dashboard
          </Link>
          <Link
            to="/insights"
            className="px-6 py-3 bg-surface-container-high border border-outline-variant text-on-surface font-technical uppercase tracking-widest text-xs hover:border-primary/60 transition-colors"
          >
            AI Insights
          </Link>
        </div>
      </div>
    </div>
  );
}
