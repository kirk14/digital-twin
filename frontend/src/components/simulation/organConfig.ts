import type { OrganName } from '../../store/useHealthStore';

export interface OrganConfigData {
  id: OrganName;
  label: string;
  paths: { d: string; key: string }[];
  transform?: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  r?: number;
  isCircle?: boolean;
  isEllipse?: boolean;
  isStrokeOnly?: boolean;
}

export const organConfig: Record<OrganName, OrganConfigData> = {
  brain: {
    id: 'brain',
    label: 'Cerebral Cortex',
    paths: [],
    isEllipse: true,
    cx: 150,
    cy: 70,
    rx: 26,
    ry: 32,
  },
  lungs: {
    id: 'lungs',
    label: 'Pulmonary System',
    paths: [
      // Left Lung (Viewer Right)
      { key: 'left-lung', d: 'M 160 145 C 185 140, 205 180, 195 240 C 185 245, 175 220, 160 210 Z' },
      // Right Lung (Viewer Left)
      { key: 'right-lung', d: 'M 140 145 C 115 140, 95 180, 105 240 C 115 245, 125 220, 140 210 Z' }
    ]
  },
  heart: {
    id: 'heart',
    label: 'Cardiovascular Core',
    paths: [
      // Detailed glowing heart shape
      { key: 'heart-ventricle', d: 'M 152 175 C 160 170, 175 180, 165 200 C 150 215, 145 205, 145 190 C 140 180, 148 175, 152 175 Z' }
    ]
  },
  liver: {
    id: 'liver',
    label: 'Hepatic System',
    paths: [
      { key: 'liver-main', d: 'M 100 245 C 145 235, 170 250, 160 270 C 130 290, 105 270, 100 245 Z' }
    ]
  },
  stomach: {
    id: 'stomach',
    label: 'Gastric System',
    paths: [
      { key: 'stomach-main', d: 'M 155 255 C 180 250, 200 280, 165 295 C 150 280, 155 265, 155 255 Z' }
    ]
  },
  kidneys: {
    id: 'kidneys',
    label: 'Renal System',
    paths: [
      { key: 'left-kidney', d: 'M 115 285 C 105 290, 110 320, 120 315 C 125 305, 120 295, 115 285 Z' },
      { key: 'right-kidney', d: 'M 185 285 C 195 290, 190 320, 180 315 C 175 305, 180 295, 185 285 Z' }
    ]
  },
  vascular: {
    id: 'vascular',
    label: 'Vascular Network',
    isStrokeOnly: true,
    paths: [
      // Complex arterial network mapping torso
      { key: 'aorta', d: 'M 155 160 L 155 330' },
      // Lateral arteries
      { key: 'art-1', d: 'M 155 210 L 110 240 M 155 210 L 200 240' },
      { key: 'art-2', d: 'M 155 250 L 105 280 M 155 250 L 205 280' },
      // Femoral splits
      { key: 'femoral', d: 'M 155 330 L 125 450 M 155 330 L 185 450' },
      // Carotid splits
      { key: 'carotid', d: 'M 155 160 L 145 110 M 155 160 L 165 110' },
      // Brachial splits
      { key: 'brachial', d: 'M 145 150 L 80 180 M 165 150 L 220 180' }
    ]
  }
};
