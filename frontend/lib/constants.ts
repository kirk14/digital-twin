// Health metric constants and mock data

export const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Simulation", href: "/simulation", icon: "FlaskConical" },
    { label: "Digital Twin", href: "/twin", icon: "ScanLine" },
    { label: "Monitoring", href: "/monitoring", icon: "Activity" },
    { label: "Profile", href: "/profile", icon: "User" },
];

export const HEALTH_METRICS = {
    heartRate: { value: 72, unit: "bpm", min: 60, max: 100, label: "Heart Rate" },
    bloodOxygen: { value: 98, unit: "%", min: 95, max: 100, label: "Blood Oxygen" },
    bloodPressure: { value: "118/76", unit: "mmHg", label: "Blood Pressure" },
    sleepScore: { value: 84, unit: "/100", min: 0, max: 100, label: "Sleep Score" },
    stressLevel: { value: 32, unit: "%", min: 0, max: 100, label: "Stress Level" },
};

export const RISK_LEVELS = {
    LOW: { label: "Low", color: "#22C55E", bg: "#F0FDF4" },
    MODERATE: { label: "Moderate", color: "#F59E0B", bg: "#FFFBEB" },
    HIGH: { label: "High", color: "#EF4444", bg: "#FEF2F2" },
};

export const ORGANS = [
    { name: "Heart", score: 94, status: "Excellent", icon: "Heart", color: "#EF4444" },
    { name: "Lungs", score: 88, status: "Good", icon: "Wind", color: "#06B6D4" },
    { name: "Brain", score: 91, status: "Excellent", icon: "Brain", color: "#8B5CF6" },
    { name: "Liver", score: 79, status: "Good", icon: "Droplets", color: "#F59E0B" },
    { name: "Kidneys", score: 85, status: "Good", icon: "Filter", color: "#22C55E" },
    { name: "Spine", score: 72, status: "Fair", icon: "Bone", color: "#64748B" },
];

export const DEVICES = [
    { name: "Smartwatch", model: "Apple Watch Series 9", connected: true, battery: 82 },
    { name: "Smart Ring", model: "Oura Ring Gen 3", connected: true, battery: 67 },
    { name: "Sleep Monitor", model: "Withings Sleep Mat", connected: false, battery: 0 },
];

export const VITALS_HISTORY = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    heartRate: 65 + Math.round(Math.sin(i * 0.4) * 8 + Math.random() * 6),
    oxygen: 96 + Math.round(Math.random() * 3),
    stress: 20 + Math.round(Math.sin(i * 0.3) * 12 + Math.random() * 8),
}));

export const HEALTH_SCORE = 87;
