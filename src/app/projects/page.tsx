"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/use-auth-store";
import AuthGuard from "@/components/auth-guard";
import { useVideoProjects, useCreateVideoProject } from "@/hooks/use-video-projects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Video, LogOut, Loader2, Film } from "lucide-react";

function ProjectsContent() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { data: projects, isLoading, error } = useVideoProjects();
    const createProject = useCreateVideoProject();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProject.mutateAsync({
                title,
                description,
                resolution: "1920x1080",
                fps: 30,
                aspect_ratio: "16:9",
            });
            setTitle("");
            setDescription("");
            setDialogOpen(false);
        } catch {
            // error handled by mutation
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <Film className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">
                            Video Projects
                        </h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create and manage your video projects
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="My awesome video"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="A short description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createProject.isPending}>
                                        {createProject.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-400">
                        Failed to load projects. Make sure your backend is running.
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && projects?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Video className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <h3 className="text-lg font-medium text-foreground">
                            No projects yet
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first video project to get started.
                        </p>
                    </div>
                )}

                {/* Project Grid */}
                {projects && projects.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                className="group cursor-pointer border border-border/50 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                                onClick={() => router.push(`/edit/${project.id}`)}
                            >
                                <div className="mb-3 flex h-28 items-center justify-center rounded-md bg-muted/50">
                                    <Video className="h-10 w-10 text-muted-foreground/40 transition-colors group-hover:text-primary/60" />
                                </div>
                                <h3 className="truncate text-sm font-semibold text-foreground">
                                    {project.title}
                                </h3>
                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                    {project.description || "No description"}
                                </p>
                                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{project.resolution}</span>
                                    <span>•</span>
                                    <span>{project.fps} fps</span>
                                    <span>•</span>
                                    <span>{project.aspect_ratio}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <AuthGuard>
            <ProjectsContent />
        </AuthGuard>
    );
}
