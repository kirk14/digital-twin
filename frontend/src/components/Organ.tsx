import React from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../store/useHealthStore';
import type { OrganStateData, OrganName } from '../store/useHealthStore';
import { organConfig } from './organConfig';
import { useOrganAnimation } from './useOrganAnimation';

interface OrganProps {
  id: OrganName;
  state: OrganStateData;
}

export const Organ: React.FC<OrganProps> = ({ id, state }) => {
  const config = organConfig[id];
  const { animate, transition, style } = useOrganAnimation(id, state);
  
  const focusedOrgan = useHealthStore(store => store.focusedOrgan);
  const setFocusedOrgan = useHealthStore(store => store.setFocusedOrgan);
  const xrayMode = useHealthStore(store => store.xrayMode);

  const isFocused = focusedOrgan === id;
  const isBlur = focusedOrgan !== null && focusedOrgan !== id;

  const baseOpacity = state.intensity === 'high' ? 0.9 : state.intensity === 'medium' ? 0.7 : 0.5;
  const targetOpacity = isBlur ? 0.2 : (xrayMode ? 1 : baseOpacity); // X-Ray forces full brightness on organs
  
  const baseDropShadow = `drop-shadow(0 0 ${state.intensity === 'high' ? '20px' : '10px'} ${state.color})`;

  const handleInteraction = () => {
    setFocusedOrgan(isFocused ? null : id);
  };

  const sharedProps = {
    fill: config.isStrokeOnly ? 'none' : state.color,
    stroke: config.isStrokeOnly ? state.color : undefined,
    strokeWidth: config.isStrokeOnly ? (state.intensity === 'high' ? 3 : 2) : undefined,
    style: {
      ...style,
      color: state.color, 
      filter: isFocused ? `drop-shadow(0 0 30px ${state.color}) brightness(1.5)` : baseDropShadow,
      cursor: 'pointer',
      opacity: targetOpacity,
    },
    onClick: handleInteraction,
    whileHover: { 
      opacity: 1, 
      filter: `drop-shadow(0 0 35px ${state.color}) brightness(1.8)`,
      scale: 1.08 
    },
    ...animate,
    transition: { ...transition, layout: { duration: 0.3 } },
    layout: true,
  };

  const shockwaveProps = {
    fill: 'none',
    stroke: state.color,
    strokeWidth: 2,
    style: { transformOrigin: 'center' },
    animate: {
      scale: [1, 1.8],
      opacity: [0.6, 0],
      filter: `drop-shadow(0 0 10px ${state.color})`
    },
    transition: {
      duration: state.speed === 'fast' ? 0.6 : (state.speed === 'slow' ? 2 : 1),
      repeat: Infinity,
      ease: "easeOut" as const
    }
  };

  // Shockwave rendering mechanic
  const renderShockwave = () => {
    if (state.intensity !== 'high' && state.speed !== 'fast') return null;
    
    // Multi paths shockwave mapping
    if (config.paths.length > 0) {
      return (
        <motion.g {...shockwaveProps}>
           {config.paths.map((p) => (
            <path key={`shock-${p.key}`} d={p.d} />
          ))}
        </motion.g>
      );
    }
  };

  // ── Render Tree ──

  if (config.isCircle && config.cx && config.cy && config.r) {
    return (
      <g>
        {renderShockwave()}
        <motion.circle cx={config.cx} cy={config.cy} r={config.r} {...(sharedProps as any)} />
      </g>
    );
  }

  if (config.isEllipse && config.cx && config.cy && config.rx && config.ry) {
    return (
      <g style={{ transformOrigin: `${config.cx}px ${config.cy}px` }}>
        {renderShockwave()}
        <motion.ellipse cx={config.cx} cy={config.cy} rx={config.rx} ry={config.ry} {...(sharedProps as any)} />
      </g>
    );
  }

  if (config.paths.length > 1) {
    return (
      <g>
        {renderShockwave()}
        <motion.g {...(sharedProps as any)}>
          {config.paths.map((p) => (
            <path key={p.key} d={p.d} />
          ))}
        </motion.g>
      </g>
    );
  }

  return (
    <g>
      {renderShockwave()}
      <motion.path d={config.paths[0]?.d} {...(sharedProps as any)} />
    </g>
  );
};
