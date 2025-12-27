import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";

import { articleService } from "@/services/article.service";
import { aiService } from "@/services/ai.service";
import { useArticleStore } from "@/stores/useArticleStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  articleSchema,
  type ArticleFormValues,
} from "@/schemas/article.schema";
import { type Article, type Category } from "@/types/api.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MyArticlePage() {
  const { user } = useAuthStore();
  const {
    articles,
    isLoading,
    fetchArticles,
    deleteArticle,
    createArticle,
    updateArticle,
  } = useArticleStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      description: "",
      cover_image_url: "",
      category: "",
    },
  });

  useEffect(() => {
    if (user?.username) {
      fetchArticles(1, "", "", user.username);
    }

    const loadCategories = async () => {
      try {
        const res = await articleService.getCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, [fetchArticles, user?.username]);

  const handleCreate = () => {
    setSelectedArticle(null);
    reset({
      title: "",
      description: "",
      cover_image_url: "",
      category: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setValue("title", article.title);
    setValue("description", article.description);
    setValue("cover_image_url", article.cover_image_url);
    setValue("category", article.category?.id?.toString() || "");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (articleToDelete) {
      await deleteArticle(articleToDelete);
      toast.success("Article deleted successfully");
      setIsAlertOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await articleService.uploadImage(file);

      const uploadedUrl = (response as any).url;
      setValue("cover_image_url", uploadedUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateContent = async () => {
    const title = watch("title");
    const categoryId = watch("category");

    if (!title) {
      toast.error("Please enter a title first");
      return;
    }

    setIsGenerating(true);
    try {
      const categoryName =
        categories.find((c) => c.id.toString() === categoryId)?.name || "";
      const content = await aiService.generateArticleContent(
        title,
        categoryName,
      );
      setValue("description", content);
      toast.success("Content generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const categoryId = values.category ? Number(values.category) : null;
      const payload = {
        title: values.title,
        description: values.description,
        cover_image_url: values.cover_image_url,
        category: categoryId,
      };

      if (selectedArticle) {
        await updateArticle(selectedArticle.documentId, payload);
        toast.success("Article updated successfully");
      } else {
        await createArticle(payload);
        toast.success("Article created successfully");
      }
      setIsDialogOpen(false);
      if (user?.username) {
        fetchArticles(1, "", "", user.username); // Refresh list
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            My articles
          </h1>
          <p className="text-muted-foreground text-sm">
            Your personal collection of travel stories.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Write new
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-16 w-24 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-100">
                  <Empty>
                    <EmptyMedia variant="icon">
                      <FileText className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>No articles found</EmptyTitle>
                      <EmptyDescription>
                        You haven't created any articles yet. Start writing your
                        first travel story!
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.documentId}>
                  <TableCell>
                    {article.cover_image_url && (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="h-16 w-24 rounded object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category?.name || "-"}</TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/article/${article.documentId}`}>
                            <Button variant="ghost" size="icon" title="Detail">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Detail</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(article)}
                            title="Update"
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
                              handleDeleteClick(article.documentId)
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[75vh] overflow-y-auto sm:max-h-[85vh] sm:max-w-150">
          <DialogHeader>
            <DialogTitle>
              {selectedArticle ? "Edit Article" : "Create Article"}
            </DialogTitle>
            <DialogDescription>
              {selectedArticle
                ? "Make changes to your article here."
                : "Write a new article to share with the world."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Article title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-destructive text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="mb-0 w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-destructive text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image</Label>
              <div className="flex flex-col gap-4">
                {(watch("cover_image_url") ||
                  selectedArticle?.cover_image_url) && (
                  <img
                    src={
                      watch("cover_image_url") ||
                      selectedArticle?.cover_image_url
                    }
                    alt="Preview"
                    className="h-40 w-full rounded-md border object-cover"
                  />
                )}
                <div className="flex items-center gap-2">
                  <Input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                <input type="hidden" {...register("cover_image_url")} />
              </div>
              {errors.cover_image_url && (
                <p className="text-destructive text-sm">
                  {errors.cover_image_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Content</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !watch("title")}
                  className="h-8 gap-2 text-xs"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="Write your article content..."
                className="min-h-50"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-destructive text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {selectedArticle ? "Save Changes" : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setArticleToDelete(null)}>
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
    </div>
  );
}
