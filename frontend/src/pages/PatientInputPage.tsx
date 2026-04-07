import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHealthStore } from '../store/useHealthStore';

export default function PatientInputPage() {
  const navigate = useNavigate();
  const store = useHealthStore();

  const [formData, setFormData] = useState({
    age: store.age,
    height: store.height,
    weight: store.weight,
    bloodOxygen: store.bloodOxygen,
    activityLevel: store.activityLevel,
    sleepHours: store.sleepHours,
    systolicBP: store.systolicBP,
    diastolicBP: store.diastolicBP,
    glucose: store.glucose,
    stressLevel: store.stressLevel,
    heartRate: store.heartRate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(formData).forEach(([key, value]) => {
      store.updateMetric(key as any, value);
    });
    // Trigger initial API call or allow dashboard to do it when it mounts
    store.recalculateState();
    navigate('/dashboard');
  };

  const fields = [
    { name: 'age', label: 'Age (years)', min: 18, max: 120 },
    { name: 'height', label: 'Height (cm)', min: 140, max: 220 },
    { name: 'weight', label: 'Weight (kg)', min: 40, max: 200 },
    { name: 'bloodOxygen', label: 'Blood Oxygen (%)', min: 80, max: 100 },
    { name: 'activityLevel', label: 'Activity Level (1-10)', min: 1, max: 10 },
    { name: 'sleepHours', label: 'Sleep (hours)', min: 2, max: 12 },
    { name: 'systolicBP', label: 'Systolic BP (mmHg)', min: 90, max: 200 },
    { name: 'diastolicBP', label: 'Diastolic BP (mmHg)', min: 60, max: 130 },
    { name: 'glucose', label: 'Glucose (mg/dL)', min: 70, max: 300 },
    { name: 'stressLevel', label: 'Stress Level (1-10)', min: 1, max: 10 },
    { name: 'heartRate', label: 'Heart Rate (bpm)', min: 40, max: 180 },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full glass-panel p-8"
      >
        <h2 className="text-2xl font-headline text-primary mb-2 uppercase tracking-widest text-center">Patient Clinical Data</h2>
        <p className="text-sm text-on-surface-variant text-center mb-8">Enter the patient baseline metrics to initialize the physiological simulation model.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((f) => (
              <div key={f.name} className="flex flex-col">
                <label className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 ml-1">{f.label}</label>
                <input
                  type="number"
                  name={f.name}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={handleChange}
                  min={f.min}
                  max={f.max}
                  step={f.name === 'activityLevel' || f.name === 'stressLevel' ? '0.1' : '1'}
                  className="bg-surface-container border border-outline-variant rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            ))}
          </div>
          
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-primary/20 border border-primary text-primary hover:bg-primary/30 uppercase tracking-widest text-sm font-technical transition-all w-full md:w-auto"
            >
              Initialize Digital Twin
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}