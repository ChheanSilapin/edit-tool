"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { VideoProject, CreateVideoProjectRequest } from "@/lib/video-types";

export function useVideoProjects() {
  return useQuery<VideoProject[]>({
    queryKey: ["video-projects"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/video-projects");
      return data;
    },
  });
}

export function useCreateVideoProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: CreateVideoProjectRequest) => {
      const { data } = await apiClient.post<VideoProject>(
        "/api/video-projects",
        project
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-projects"] });
    },
  });
}

export function useSceneTextVideos() {
  return useQuery({
    queryKey: ["scene-text-videos"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/scene_text_video");
      return data;
    },
  });
}
