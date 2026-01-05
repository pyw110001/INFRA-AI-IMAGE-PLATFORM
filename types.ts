export enum GenerationStatus {
  IDLE = 'IDLE',
  QUEUED = 'QUEUED',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ImageAsset {
  id: string;
  url: string; // Data URL
  file?: File;
  type: 'base' | 'style' | 'generated' | 'mask';
}

export interface GenerationParams {
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
  fidelity: number; // 0-1, represents creativity vs strict adherence
  styleStrength: number; // 0-1
  seed: number;
  lockedSeed: boolean;
  presetId: string;
  outputQuality: '1K' | '2K'; // Mapped from Gemini params
}

export interface ProjectVersion {
  id: string;
  parentId: string | null;
  timestamp: number;
  baseImageId: string;
  resultImageId?: string;
  prompt: string;
  params: GenerationParams;
  status: GenerationStatus;
  errorMessage?: string;
  isFavorite: boolean;
}

export interface Project {
  id: string;
  name: string;
  updatedAt: number;
  versions: ProjectVersion[];
  activeVersionId: string | null;
  assets: Record<string, ImageAsset>; // Map id -> Asset
}

export interface Preset {
  id: string;
  category: 'Road' | 'Bridge' | 'Tunnel' | 'Landscape';
  name: string;
  promptTemplate: string;
  defaultParams: Partial<GenerationParams>;
}