import React from 'react';
import { useHealthStore } from '../../store/useHealthStore';
import type { OrganName } from '../../store/useHealthStore';
import { Organ } from '../Organ';
import { OrganDetails } from './OrganDetails';
import { motion } from 'framer-motion';

export const BodyCanvas: React.FC = () => {
  const organs = useHealthStore((state) => state.organs);
  const focusedOrgan = useHealthStore((state) => state.focusedOrgan);
  const xrayMode = useHealthStore((state) => state.xrayMode);

  return (
    <div className="relative w-full h-full min-h-[500px] flex justify-center items-center overflow-hidden">
      
      {/* Advanced Interactive Target Details */}
      <OrganDetails />

      {/* Holographic Vertical Scanner Line */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[2px] shadow-[0_0_20px_#06b6d4] bg-neon-cyan/80 z-20"
        animate={{ y: ["0%", "500px", "0%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ opacity: xrayMode ? 0.4 : 0.8 }}
      />

      {/* Primary SVG Canvas */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 300 600" 
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible relative z-10"
      >
        <defs>
          <filter id="hologram-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={xrayMode ? "0.02" : "0.15"} />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity={xrayMode ? "0.0" : "0.05"} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={xrayMode ? "0.05" : "0.2"} />
          </linearGradient>
        </defs>

        {/* Cinematic Concentric Spinning Scanning Rings */}
        <g style={{ transformOrigin: '150px 300px', animation: 'scanningRings 25s linear infinite' }}>
          <circle cx="150" cy="300" r="180" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="5 20" />
          <circle cx="150" cy="300" r="220" fill="none" stroke="rgba(6,182,212,0.05)" strokeWidth="2" strokeDasharray="50 50" />
        </g>
        <g style={{ transformOrigin: '150px 300px', animation: 'scanningRings 15s linear infinite reverse' }}>
          <circle cx="150" cy="300" r="200" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" strokeDasharray="10 10" />
        </g>

        {/* Global Opacity Controller */}
        <g style={{ opacity: focusedOrgan ? 0.3 : 1, transition: 'opacity 0.4s ease' }}>
          
          {/* Layer 1: Background grid/scan artifacting for the body envelope */}
          <path 
            d="M 150 20 C 180 20, 195 45, 195 75 C 195 105, 175 115, 160 120 C 220 125, 250 145, 260 190 L 275 350 M 140 120 C 80 125, 50 145, 40 190 L 25 350 M 120 120 L 180 120 L 210 320 L 180 360 L 180 580 M 120 360 L 90 320 L 120 120 M 120 580 L 120 360"
            fill="none" 
            stroke="rgba(6,182,212,0.15)" 
            strokeWidth="2" 
            strokeDasharray="4 6" 
            style={{ opacity: xrayMode ? 0.2 : 1, transition: 'opacity 0.5s ease' }}
          />
          
          {/* Layer 2: Anatomical Silhouette Fill (Responsive to X-Ray) */}
          <path 
            d="M 150 20 
               C 180 20, 195 45, 195 75 
               C 195 95, 185 110, 175 115 
               C 220 120, 240 135, 250 160 
               C 260 190, 265 240, 260 300
               C 255 350, 240 360, 210 365
               L 210 580 C 190 585, 175 580, 170 560
               L 160 400 L 140 400 
               L 130 560 C 125 580, 110 585, 90 580
               L 90 365
               C 60 360, 45 350, 40 300
               C 35 240, 40 190, 50 160
               C 60 135, 80 120, 125 115
               C 115 110, 105 95, 105 75
               C 105 45, 120 20, 150 20 Z" 
            fill="url(#body-gradient)" 
            stroke="#06b6d4" 
            strokeWidth={xrayMode ? "0.5" : "1.5"}
            filter={xrayMode ? "none" : "url(#hologram-glow)"}
            style={{ transition: 'all 0.5s ease', opacity: xrayMode ? 0.3 : 1 }}
          />
          
          {/* Layer 3: Inner Depth / Skeletal mechanics */}
          <path 
            d="M 150 115 L 150 360 M 110 150 C 130 145, 170 145, 190 150 M 105 180 C 130 175, 170 175, 195 180 M 105 210 C 130 205, 170 205, 195 210 M 110 240 C 130 235, 170 235, 190 240 M 130 360 L 105 580 M 170 360 L 195 580"
            fill="none"
            stroke="rgba(6,182,212,0.25)"
            strokeWidth="1"
          />
        </g>

        {/* Layer 4: Interactive Organs Component Engine */}
        {Object.entries(organs).map(([organId, organState]) => (
          <Organ key={organId} id={organId as OrganName} state={organState} />
        ))}
      </svg>
    </div>
  );
};
