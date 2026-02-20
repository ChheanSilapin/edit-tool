import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IVideo } from "@designcombo/types";
import React, { useState, useEffect, useCallback } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, PlusIcon } from "lucide-react";
import { ImageLoading } from "@/components/ui/image-loading";
import apiClient from "@/lib/api-client";

interface SceneTextVideo {
  id: number;
  scene_id: number;
  scene_index: number;
  task_id: string;
  status: string;
  video_url: string | null;
  hd_video_url: string | null;
  aspect_ratio: string;
  duration: string;
  model: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

interface SceneTextVideoResponse {
  total: number;
  generations: SceneTextVideo[];
}

export const Videos = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<SceneTextVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<SceneTextVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/api/scene_text_video");
      const response = data as SceneTextVideoResponse;
      const videoList = response.generations || [];
      setVideos(videoList);
      setFilteredVideos(videoList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch videos"
      );
      setVideos([]);
      setFilteredVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load videos on mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleAddVideo = (payload: Partial<IVideo>) => {
    dispatch(ADD_VIDEO, {
      payload,
      options: {
        resourceId: "main",
        scaleMode: "fit",
      },
    });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = videos.filter(
      (v) =>
        v.model.toLowerCase().includes(query) ||
        v.task_id.toLowerCase().includes(query)
    );
    setFilteredVideos(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredVideos(videos);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Videos
      </div>
      <div className="flex items-center gap-2 px-4 pb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Search className="h-3 w-3" />
            )}
          </Button>
        </div>
        {searchQuery && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearSearch}
            disabled={loading}
          >
            Clear
          </Button>
        )}
      </div>

      {error && (
        <div className="px-4 pb-2">
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
            {error}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 lg:max-h-[calc(100%-125px)] max-h-[500px]">
        <div className="masonry-sm px-4">
          {filteredVideos.map((video, index) => (
            <VideoItem
              key={video.id || index}
              video={video}
              shouldDisplayPreview={!isDraggingOverTimeline}
              handleAddVideo={handleAddVideo}
            />
          ))}
        </div>
        {loading && <ImageLoading message="Loading videos..." />}
        {!loading && filteredVideos.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No videos match your search." : "No videos found."}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const VideoItem = ({
  handleAddVideo,
  video,
  shouldDisplayPreview,
}: {
  handleAddVideo: (payload: Partial<IVideo>) => void;
  video: SceneTextVideo;
  shouldDisplayPreview: boolean;
}) => {
  const videoSrc = video.video_url || "";
  const hasVideo = video.status === "completed" && !!videoSrc;

  const style = React.useMemo(
    () => ({
      backgroundColor: "var(--muted)",
      width: "80px",
      height: "80px",
    }),
    []
  );

  return (
    <Draggable
      data={{
        type: "video",
        details: { src: videoSrc },
        metadata: {
          previewUrl: videoSrc,
        },
      }}
      renderCustomPreview={<div style={style} className="draggable" />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div
        onClick={() =>
          hasVideo &&
          handleAddVideo({
            id: generateId(),
            details: {
              src: videoSrc,
            },
            metadata: {
              previewUrl: videoSrc,
            },
          } as unknown as Partial<IVideo>)
        }
        className="relative flex w-full items-center justify-center overflow-hidden bg-background pb-2 group cursor-pointer"
      >
        {hasVideo ? (
          <video
            draggable={false}
            src={videoSrc}
            muted
            autoPlay
            loop
            playsInline
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-20 w-full items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
            {video.status === "failed" ? "Failed" : "No preview"}
          </div>
        )}
        {/* Add button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <div className="rounded-full p-1">
            <PlusIcon className="h-6 w-6 fill-current" />
          </div>
        </div>
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute top-2 right-2 bg-black/90 text-primary/90 text-xs px-1 py-0.5 rounded">
            {video.duration}s
          </div>
        )}
      </div>
    </Draggable>
  );
};
