export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export enum SystemState {
  INITIALIZING = 'INITIALIZING',
  STABLE = 'STABLE',
  HIGH_ENTROPY = 'HIGH_ENTROPY',
  COLLAPSE_WARNING = 'COLLAPSE_WARNING',
  EMERGENT = 'EMERGENT'
}

export interface DiagnosticData {
  time: string;
  entropy: number;
  processingDepth: number;
  stability: number;
}