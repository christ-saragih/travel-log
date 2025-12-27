import { type Article } from "@/types/api.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User as UserIcon, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toDetail = () => navigate(`/article/${article.documentId}`);

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {article.category && (
          <Badge className="bg-background/80 text-foreground hover:bg-background/90 absolute top-3 right-3 backdrop-blur">
            {article.category.name}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {article.user?.username || "Anonymous"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
        </div>
        {user ? (
          <button type="button" onClick={toDetail} className="text-left">
            <h3 className="decoration-primary line-clamp-2 text-xl leading-tight font-bold underline-offset-4 hover:underline">
              {article.title}
            </h3>
          </button>
        ) : (
          <h3 className="line-clamp-2 text-xl leading-tight font-bold">
            {article.title}
          </h3>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {article.description}
        </p>
      </CardContent>

      <CardFooter>
        {user ? (
          <Button
            type="button"
            variant="outline"
            className="group/btn w-full"
            onClick={toDetail}
          >
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="group/btn w-full">
                Read More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Login Required</AlertDialogTitle>
                <AlertDialogDescription>
                  You need to be logged in to read the full article. Please
                  login to continue.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Back</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Link to="/auth/login">Login</Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
