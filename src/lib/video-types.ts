export interface VideoProject {
  id: number;
  title: string;
  description: string;
  resolution: string;
  fps: number;
  aspect_ratio: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVideoProjectRequest {
  title: string;
  description: string;
  resolution: string;
  fps: number;
  aspect_ratio: string;
}

export interface SceneTextVideo {
  id: number;
  project_id: number;
  scene_text: string;
  video_url?: string;
  status?: string;
  model?: string;
  created_at?: string;
  updated_at?: string;
}
