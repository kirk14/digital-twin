import { useMemo } from 'react';
import type { OrganName, OrganStateData } from '../store/useHealthStore';

export const useOrganAnimation = (organId: OrganName, state: OrganStateData) => {
  const { speed, intensity } = state;

  return useMemo(() => {
    switch (organId) {
      case 'heart':
        return {
          animate: { 
            scale: [1, 1.15, 1],
            filter: speed === 'fast' 
              ? [`drop-shadow(0 0 10px ${state.color})`, `drop-shadow(0 0 30px ${state.color})`, `drop-shadow(0 0 10px ${state.color})`] 
              : [`drop-shadow(0 0 5px ${state.color})`, `drop-shadow(0 0 15px ${state.color})`, `drop-shadow(0 0 5px ${state.color})`]
          },
          transition: { 
            duration: speed === 'fast' ? 0.5 : speed === 'slow' ? 1.5 : 0.8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        };
        
      case 'lungs':
        return {
          animate: { 
            scaleX: [1, 1.08, 1],
            scaleY: [1, 1.04, 1] 
          },
          transition: { 
            duration: speed === 'fast' ? 1.8 : speed === 'slow' ? 4 : 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          style: { transformOrigin: '150px 145px' } // Trachea anchor point
        };

      case 'brain':
        return {
          animate: { 
            opacity: intensity === 'low' ? [0.3, 0.5, 0.3] : [0.6, 0.9, 0.6],
            scale: intensity === 'high' ? [1, 1.02, 1] : 1
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };

      case 'liver':
        return {
          animate: { 
            opacity: [0.7, 0.9, 0.7],
            filter: `drop-shadow(0 0 ${intensity === 'high' ? '20px' : '5px'} currentColor)` 
          },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };

      case 'stomach':
        return {
          animate: { 
            y: intensity === 'high' ? [0, 4, -2, 0] : [0, 2, 0] 
          },
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };

      case 'kidneys':
        return {
          animate: { opacity: intensity === 'high' ? [0.6, 1, 0.6] : [0.7, 0.9, 0.7] },
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        };

      case 'vascular':
        return {
          animate: { 
            strokeOpacity: speed === 'fast' ? [0.3, 0.9, 0.3] : [0.15, 0.5, 0.15],
            strokeWidth: speed === 'fast' ? [1.5, 2.5, 1.5] : [1, 1.5, 1]
          },
          transition: { duration: speed === 'fast' ? 0.6 : 1.2, repeat: Infinity, ease: "linear" }
        };

      default:
        return { animate: {}, transition: {} };
    }
  }, [organId, speed, intensity, state.color]);
};
