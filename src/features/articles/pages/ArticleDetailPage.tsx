import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useArticleStore } from "@/stores/useArticleStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  MessageCircle,
  Loader2,
  Send,
  Pencil,
  X,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentArticle,
    isLoading,
    error,
    fetchArticleById,
    resetCurrentArticle,
    addComment,
    editComment,
    deleteComment,
  } = useArticleStore();

  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticleById(id);
    }
    return () => resetCurrentArticle();
  }, [id, fetchArticleById, resetCurrentArticle]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 pb-20">
        <div className="space-y-4">
          <Skeleton className="h-10 w-24" />
        </div>

        <Skeleton className="aspect-video w-full rounded-xl" />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-50 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentArticle) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-destructive text-2xl font-bold">
          Error loading article
        </h2>
        <p className="text-muted-foreground">{error || "Article not found"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${currentArticle.title} — TravelLog`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`,
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl,
  )}`;

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentArticle) return;

    setIsSubmittingComment(true);
    try {
      await addComment(currentArticle.id, comment);
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add comment";
      toast.error(message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const startEditing = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleUpdateComment = async (documentId: string) => {
    if (!editContent.trim()) return;

    setIsUpdatingComment(true);
    try {
      await editComment(documentId, editContent);
      toast.success("Comment updated successfully");
      cancelEditing();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update comment";
      toast.error(message);
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const handleDeleteClick = (documentId: string) => {
    setCommentToDelete(documentId);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      try {
        await deleteComment(commentToDelete);
        toast.success("Comment deleted successfully");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete comment";
        toast.error(message);
      } finally {
        setIsAlertOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  return (
    <article className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="flex flex-row items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share this article</DialogTitle>
                <DialogDescription>
                  Choose a platform to share the link.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:bg-accent rounded-md border px-3 py-2 text-sm"
                >
                  WhatsApp
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:bg-accent rounded-md border px-3 py-2 text-sm"
                >
                  Facebook
                </a>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                >
                  Copy link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border">
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={currentArticle.cover_image_url}
            alt={currentArticle.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {currentArticle.category?.name && (
            <Badge className="bg-background/80 text-foreground absolute top-4 right-4 backdrop-blur">
              {currentArticle.category.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <header className="space-y-3">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
              {currentArticle.title}
            </h1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary inline-flex h-8 w-8 items-center justify-center rounded-full">
                  <User className="h-4 w-4" />
                </span>
                <span className="text-foreground font-medium">
                  {currentArticle.user?.username || "Anonymous"}
                </span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(currentArticle.publishedAt).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {currentArticle.description}
            </p>
          </div>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-muted-foreground h-4 w-4" />
              <h2 className="text-foreground text-lg font-semibold">
                Comments
              </h2>
              <span className="text-muted-foreground text-sm">
                ({currentArticle.comments?.length || 0})
              </span>
            </div>

            {user ? (
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-25"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmittingComment || !comment.trim()}
                    className="gap-2"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </form>
            ) : (
              <Card className="bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    Please login to leave a comment.
                  </p>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {currentArticle.comments && currentArticle.comments.length > 0 ? (
              <div className="space-y-3">
                {currentArticle.comments.map((c) => (
                  <Card key={c.id}>
                    <CardHeader className="space-y-1 p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          {c.user?.username || "Anonymous"}
                        </CardTitle>
                        {user && user.id === c.user?.id && (
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    startEditing(c.documentId, c.content)
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Update</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handleDeleteClick(c.documentId)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(c.publishedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {editingCommentId === c.documentId ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-20"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditing}
                              disabled={isUpdatingComment}
                            >
                              <X className="mr-1 h-3 w-3" /> Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateComment(c.documentId)}
                              disabled={
                                isUpdatingComment || !editContent.trim()
                              }
                            >
                              {isUpdatingComment && (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              )}
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                          {c.content}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/20">
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm">
                    No comment yet. Be the first to comment!
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Quick actions</CardTitle>
              <p className="text-muted-foreground text-sm">
                Save link & share with friends.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigator.clipboard.writeText(shareUrl)}
              >
                Copy link
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full">
                  WhatsApp
                </Button>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full">
                  Facebook
                </Button>
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
